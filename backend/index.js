require('dotenv').config();
const express = require('express');
const cors = require('cors');
const axios = require('axios');

const app = express();
app.use(cors());
app.use(express.json());

app.post('/api/generate-drill', async (req, res) => {
  const { category } = req.body;
  try {
    const prompt = `Generate a short, simple hockey drill for the category: ${category}. The drill should only use 1 or 2 players. Respond in 3-4 concise sentences.\n\nAlso, return a JSON object with two fields:\n- 'description': the drill description,\n- 'path': an array of rink coordinates (objects with x and y fields, using this system: x from 0 to 50, y from 0 to 100) that represent the path the player(s) should follow.\n\nHere are some key rink points you can use:\n- Left faceoff dot: { x: 13, y: 83 }\n- Right faceoff dot: { x: 37, y: 83 }\n- Top left dot: { x: 13, y: 17 }\n- Top right dot: { x: 37, y: 17 }\n- Center dot: { x: 25, y: 50 }\n- Neutral zone dots: { x: 13, y: 36 }, { x: 37, y: 36 }, { x: 13, y: 64 }, { x: 37, y: 64 }\n\nFormat your response as JSON only.`;
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
    let drill = { description: '', path: [] };
    // Remove code block markers if present
    aiMessage = aiMessage.trim().replace(/^```json|^```|```$/gim, '').trim();
    try {
      drill = JSON.parse(aiMessage);
    } catch (e) {
      // Try to extract description with regex
      const match = aiMessage.match(/"description"\s*:\s*"([^"]+)"/);
      drill.description = match ? match[1] : (aiMessage || 'No description returned.');
      drill.path = [];
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