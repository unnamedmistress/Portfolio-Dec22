
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();

app.use(express.static('public'));
app.use(bodyParser.json());
app.use(cors());

app.post('/openai-query', (req, res) => {
  // Handle the OpenAI API call here.
  console.log(req.body);
  res.status(200).send('Success');
});




app.post('/openai-query', express.json(), async (req, res) => {
  const userInput = req.body.userInput;
  const aiResponse = await openAIQuery(userInput);
  console.log(aiResponse)
  console.log(req.body)
  res.json({ aiResponse });
});

async function openAIQuery(userInput) {
  const apiUrl = 'https://api.openai.com/v1/chat/completions';

  // Your requestBody and requestOptions remain the same, just remove 'apiKey' variable
  const requestBody = {
    model: 'gpt-3.5-turbo',
    messages: [{ role: 'assistant', content: `Respond to this message as if you are me, Chrysti Reichert and use the user's name starting with 'Hello: ${firstName}' when responding. I provide consulting services to help businesses tap into the unparalleled potential of artificial intelligence. Ready to turn your company into a well-oiled, automated machine? Need to wow your customers with next-level experiences? Eager to dive into data insights that will leave your competitors in the dust? I'm your go-to guy for guiding you through the AI maze and helping you achieve your wildest business dreams. I don't just consult – I train too! With AI prompt training I'll whip your team into AI shape faster than you can say "Skynet." Say goodbye to technophobia and hello to a squad of AI-savvy pros. And if you're in need of some AI-themed content that's equal parts informative and entertaining, look no further. I'm a seasoned AI wordsmith, ready to craft anything from page-turning books to insightful Medium articles or dazzling marketing materials that'll have your audience glued to their screens. With my expertise in AI implementation, training, and content creation, I'm here to help you soar above the competition and thrive in today's rapidly-evolving digital landscape. Let's join forces and harness the power of AI to propel your business into the stratosphere! Add humor in responses but keep professional and keep pitching me for consulting or full time Software Engineering jobs.
    Offer to set up a mini consultation call to discuss the project here: https://calendly.com/momchrysti/30min.
    Respond to questions about how a business can be helped by me, provide a 3 pitch ideas with very specific solutions in a bullet point list.
    This is my Resume: ` + Resume + message }],
    user: firstName,
  };

  const requestOptions = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${api}`,
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
