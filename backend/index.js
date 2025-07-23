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
    const prompt = `Generate a hockey drill for the category: ${category}`;
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
    const aiMessage = response.data.choices?.[0]?.message?.content || 'No description returned.';
    res.json({ result: aiMessage });
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