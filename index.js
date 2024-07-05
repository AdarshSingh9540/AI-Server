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

async function generateBlog(title) {
  const prompt = `Write a comprehensive blog post with the title "${title}". The blog post should be well-structured, informative, and engaging. Include an introduction, several main points with supporting details, and a conclusion. Aim for a length of about 300-400 words.`;

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error('Error generating blog post:', error);
    return 'An error occurred while generating the blog post. Please try again later.';
  }
}

app.use(bodyParser.json());
app.use(cors());

app.get('/', (req, res) => {
  res.send('Welcome to the ai-server! 🙏');
});

app.post('/chat', async (req, res) => {
  const { title } = req.body;
  const blogTitle = req.header('X-Blog-Title') || title;

  if (!blogTitle) {
    return res.status(400).send('Missing title in request body or X-Blog-Title header');
  }

  const response = await generateBlog(blogTitle);
  res.json({ response });
});

app.listen(3000, () => console.log('Server listening on port 3000'));