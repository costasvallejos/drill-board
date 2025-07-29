require('dotenv').config();
const express = require('express');
const cors = require('cors');
const axios = require('axios');

const app = express();
app.use(cors());
app.use(express.json());

const ALLOWED_CATEGORIES = ['Shooting', 'Skating', 'Passing'];

// Helper function to convert coordinate arrays to objects
function convertCoordinates(data) {
  if (Array.isArray(data)) {
    return data.map(point => {
      if (Array.isArray(point) && point.length === 2) {
        return { x: point[0], y: point[1] };
      }
      return point;
    });
  }
  return data;
}

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
    return `Generate a hockey drill for the category: Passing. The drill must use 2 players and involve a minimum of 2 real passes between them (not to themselves). Each pass must end at a player at a rink location. Respond in 2-3 concise sentences.

Create a dynamic drill where players move around the rink while passing. Players should not stay stationary - they should move to different positions on the rink while passing the puck back and forth. The drill should show realistic hockey movement and positioning.

IMPORTANT: The puck path must be physically realistic. The puck should only change direction when it reaches a player position - it cannot change direction in mid-air. Each segment of the puck path should go directly from one player to another player.

CRITICAL: The puck path should have clear pass events that correspond to actual player positions. Each pass should:
1. Start from where Player 1 is located
2. Travel in a straight line to where Player 2 is located
3. Only change direction when it reaches a player position
4. Have fewer total points than player paths (since passes are straight lines between players)

For example, if players move from position A to B to C, the puck should only move: A→B→C (following the players), not random zigzags.

Return a JSON object with:
- 'description': the drill description,
- 'path': an array of rink coordinates (x, y) for Player 1 (should include movement, not just one position),
- 'player2Path': an array of rink coordinates (x, y) for Player 2 (should include movement, not just one position),
- 'puckPath': an array of rink coordinates (x, y) for the puck. The puck should follow a simple path that goes from Player 1 to Player 2 to Player 1, etc., matching their actual positions. No random direction changes.

Label the two players as Player 1 and Player 2. Player 2 will be shown as a different color dot in the visualization.

${rinkPoints}

If there is a pass, the puckPath should show the puck leaving one player and traveling to the other. Format your response as JSON only.`;
  }
  if (category === 'Shooting') {
    return `Generate a hockey drill for the category: Shooting. Use 1 or 2 players. Respond in 2-3 concise sentences.

Return a JSON object with:
- 'description': the drill description. Always specify the exact rink location for the shot using the provided dot names (e.g., 'top left dot', 'left faceoff dot').
- 'path': an array of rink coordinates (x, y) for the player. The shot location must be one of the named dots.
- 'puckPath': an array of rink coordinates (x, y) for the puck. The puck should follow the player until the shot, then go to the net.
- 'shotLocation': the coordinates (x, y) where the shot is taken (must match a point in 'path').

All coordinates must be within the rink bounds: x between 0 and 50, y between 0 and 100. Only use the provided dot coordinates or coordinates within the rink.

${rinkPoints}

Format your response as JSON only.`;
  }
  if (category === 'Skating') {
    return `Generate a hockey drill for the category: Skating. Use 1 player. Focus on skating skills like figure eights, crossovers, and edge work around the faceoff dots and circles.

The drill should involve the player skating around the faceoff dots and circles in patterns like:
- Figure eight patterns around the faceoff dots
- Skating around the center circle
- Crossovers around the faceoff circles
- Edge work and tight turns

Respond in 2-3 concise sentences describing the skating pattern and what skills it develops.

Return a JSON object with:
- 'description': the drill description focusing on skating skills and patterns,
- 'path': an array of rink coordinates (x, y) for the player that creates smooth skating patterns around dots and circles,
- 'puckPath': an array of rink coordinates (x, y) for the puck (if used, otherwise match player path).

Use the faceoff dots and circles as key waypoints: left faceoff dot (13,83), right faceoff dot (37,83), top left dot (13,17), top right dot (37,17), center dot (25,50), and the faceoff circles around these points.

${rinkPoints}

Format your response as JSON only.`;
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
    // Convert coordinate arrays to objects
    if (drill.path) drill.path = convertCoordinates(drill.path);
    if (drill.puckPath) drill.puckPath = convertCoordinates(drill.puckPath);
    if (drill.player2Path) drill.player2Path = convertCoordinates(drill.player2Path);
    if (drill.shotLocation && Array.isArray(drill.shotLocation) && drill.shotLocation.length === 2) {
      drill.shotLocation = { x: drill.shotLocation[0], y: drill.shotLocation[1] };
    }
    console.log(JSON.stringify(drill, null, 2)); // Debug: log the drill object
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