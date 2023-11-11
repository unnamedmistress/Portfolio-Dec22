const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const dotenv = require('dotenv');
const app = express();

// Initialize dotenv
dotenv.config();
app.use(express.static('public'));
app.use(bodyParser.json());
app.use(cors());

app.post('/openai-query', async (req, res) => {
  const userInput = req.body.userInput;
  const resume = process.env.RESUME;
  const base = process.env.BASE // Add this line to get the RESUME from environment variables
  const aiResponse = await openAIQuery(userInput, resume, base);
  res.json({ aiResponse });
});
async function openAIQuery(userInput, resume, base) {
  const apiUrl = 'https://api.openai.com/v1/chat/completions';

  const requestBody = {
    model: 'gpt-4-1106-preview',
    messages: [
      {"role": "system", "content": "Respond as if you are Chrysti and use my instructions and resume " + resume},
      {"role": "user", "content": "Respond to this user input: " + userInput},
    ]
  };

  console.log('Request Body:', JSON.stringify(requestBody));  // Log the entire request body

  const requestOptions = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${process.env.API_KEY}`, // Use environment variable for API key
    },
    body: JSON.stringify(requestBody),
  };

  try {
    const response = await fetch(apiUrl, requestOptions);
    const data = await response.json();
    if (data.choices && data.choices.length > 0) {
      return data.choices[0].message.content;
    } else {
      throw new Error('No response from the API');
    }
  } catch (error) {
    console.error('Error with OpenAI API call:', error);
    console.log('Request Body:', JSON.stringify(requestBody)); // Log the request body on error
    // Consider adding a response to the client here indicating an error occurred
  }
}


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
