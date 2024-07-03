const express = require('express');
const app = express();
const { GoogleGenerativeAI } = require('@google/generative-ai');
const dotenv = require('dotenv');
const bodyParser = require('body-parser');
const cors = require('cors'); 
dotenv.config();

const apiKey = process.env.GOOGLE_API_KEY;

if (!apiKey) {
  throw new Error('Missing GOOGLE_API_KEY environment variable');
}

const genAI = new GoogleGenerativeAI(apiKey);
const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

async function chat(prompt) {
  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error('Error generating response:', error);
    return 'An error occurred. Please try again later.';
  }
}


app.use(bodyParser.json());
app.use(cors());
app.get('/', (req, res) => {
  res.send('Welcome to the ai-server! 🙏');
});


app.post('/chat', async (req, res) => {
  const { prompt } = req.body;

  if (!prompt) {
    return res.status(400).send('Missing prompt in request body');
  }

  const response = await chat(prompt);
  res.json({ response });
});

app.listen(3000, () => console.log('Server listening on port 3000'));
