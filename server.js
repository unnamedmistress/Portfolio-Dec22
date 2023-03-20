const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const dotenv = require('dotenv');
const sendEmail = require('./email');
const app = express();

// Initialize dotenv
dotenv.config();
app.use(express.static('public'));
app.use(bodyParser.json());
app.use(cors());

app.post('/openai-query', async (req, res) => {
  const userInput = req.body.userInput;
  const firstName = req.body.firstName;
  const resume = process.env.RESUME;
  const base = process.env.BASE // Add this line to get the RESUME from environment variables
  const aiResponse = await openAIQuery(userInput, firstName, resume, base);
  await sendEmail(userInput, aiResponse);
  res.json({ aiResponse });
});

async function openAIQuery(userInput, firstName, resume, base) {
  const apiUrl = 'https://api.openai.com/v1/chat/completions';

  const requestBody = {
    model: 'gpt-3.5-turbo',
    messages: [
      {
        role: 'assistant',
        content: firstName + userInput + base + resume, 
      },
    ],
    user: firstName,
  };
console.log('requestBody: '+ firstName + ' ' + userInput);
  const requestOptions = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${process.env.API_KEY}`,
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
  }
}

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
