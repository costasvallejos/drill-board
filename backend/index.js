require('dotenv').config();
const express = require('express');
const cors = require('cors');
const axios = require('axios');

const app = express();
app.use(cors());
app.use(express.json());

const ALLOWED_CATEGORIES = ['Shooting', 'Skating', 'Passing'];

function getPrompt(category) {
  const rinkPoints = `Here are some key rink points you can use:
- Left faceoff dot: { x: 13, y: 83 }
- Right faceoff dot: { x: 37, y: 83 }
- Top left dot: { x: 13, y: 17 }
- Top right dot: { x: 37, y: 17 }
- Center dot: { x: 25, y: 50 }
- Neutral zone dots: { x: 13, y: 36 }, { x: 37, y: 36 }, { x: 13, y: 64 }, { x: 37, y: 64 }
- Center of top net: { x: 25, y: 7 }
- Center of bottom net: { x: 25, y: 93 }`;

  if (category === 'Passing') {
    return `Generate a very short hockey drill for the category: Passing. The drill must use 2 players and involve a minimum of 2 real passes between them (not to themselves). Each pass must end at a player at a rink location. Respond in 2-3 concise sentences.\n\nReturn a JSON object with:\n- 'description': the drill description,\n- 'path': an array of rink coordinates (x, y) for Player 1,\n- 'player2Path': an array of rink coordinates (x, y) for Player 2,\n- 'puckPath': an array of rink coordinates (x, y) for the puck. The puckPath should show the puck moving from one player to the other for each pass.\n\nLabel the two players as Player 1 and Player 2. Player 2 will be shown as a different color dot in the visualization.\n\n${rinkPoints}\n\nIf there is a pass, the puckPath should show the puck leaving one player and traveling to the other. Format your response as JSON only.`;
  }
  if (category === 'Shooting') {
    return `Generate a very short hockey drill for the category: Shooting. Use 1 or 2 players. Respond in 2-3 concise sentences.\n\nReturn a JSON object with:\n- 'description': the drill description,\n- 'path': an array of rink coordinates (x, y) for the player,\n- 'puckPath': an array of rink coordinates (x, y) for the puck. If there is a shot, the puckPath must end at the center of either net ({ x: 25, y: 7 } or { x: 25, y: 93 }).\n\n${rinkPoints}\n\nFormat your response as JSON only.`;
  }
  if (category === 'Skating') {
    return `Generate a very short hockey drill for the category: Skating. Use 1 player. Respond in 2-3 concise sentences.\n\nReturn a JSON object with:\n- 'description': the drill description,\n- 'path': an array of rink coordinates (x, y) for the player,\n- 'puckPath': an array of rink coordinates (x, y) for the puck (if used, otherwise match player path).\n\n${rinkPoints}\n\nFormat your response as JSON only.`;
  }
  // Should not reach here
  return '';
}

app.post('/api/generate-drill', async (req, res) => {
  const { category } = req.body;
  if (!ALLOWED_CATEGORIES.includes(category)) {
    return res.status(400).json({ error: `Category must be one of: ${ALLOWED_CATEGORIES.join(', ')}` });
  }
  try {
    const prompt = getPrompt(category);
    const response = await axios.post(
      'https://api.groq.com/openai/v1/chat/completions',
      {
        model: 'llama-3.3-70b-versatile',
        messages: [
          { role: 'user', content: prompt }
        ]
      },
      {
        headers: {
          'Authorization': `Bearer ${process.env.GROQ_API_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    );
    let aiMessage = response.data.choices?.[0]?.message?.content || '';
    let drill = { description: '', path: [], puckPath: [] };
    // Remove code block markers if present
    aiMessage = aiMessage.trim().replace(/^```json|^```|```$/gim, '').trim();
    try {
      drill = JSON.parse(aiMessage);
    } catch (e) {
      // Try to extract description with regex
      const match = aiMessage.match(/"description"\s*:\s*"([^"]+)"/);
      drill.description = match ? match[1] : (aiMessage || 'No description returned.');
      drill.path = [];
      drill.puckPath = [];
    }
    res.json(drill);
  } catch (error) {
    if (error.response) {
      res.status(error.response.status).json({
        error: error.message,
        groqData: error.response.data,
        groqStatus: error.response.status
      });
    } else {
      res.status(500).json({ error: error.message });
    }
  }
});

const PORT = process.env.PORT || 5050;
app.listen(PORT, () => console.log(`Backend running on port ${PORT}`));