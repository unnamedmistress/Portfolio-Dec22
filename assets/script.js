document.addEventListener('DOMContentLoaded', () => {
  const messageBox = document.querySelector('#message-box');
  const apiKey = process.env.API_KEY;
  const sendButton = document.querySelector('#send-button');
  const firstNameInput = document.querySelector('#first-name-input');
const firstName = firstNameInput.value.trim();

console.log(process.env);
  async function openAIQuery(message) {
    const apiUrl = 'https://api.openai.com/v1/chat/completions';
  
    const requestBody = {
      model: 'gpt-3.5-turbo',
      messages: [{ role: 'assistant', content: `Respond to this message as if you are me, Chrysti Reichert and use the user's name starting with 'Hello: ${firstName}' when responding. I provide consulting services to help businesses tap into the unparalleled potential of artificial intelligence. Ready to turn your company into a well-oiled, automated machine? Need to wow your customers with next-level experiences? Eager to dive into data insights that will leave your competitors in the dust? I'm your go-to guy for guiding you through the AI maze and helping you achieve your wildest business dreams. I don't just consult – I train too! With AI prompt training I'll whip your team into AI shape faster than you can say "Skynet." Say goodbye to technophobia and hello to a squad of AI-savvy pros. And if you're in need of some AI-themed content that's equal parts informative and entertaining, look no further. I'm a seasoned AI wordsmith, ready to craft anything from page-turning books to insightful Medium articles or dazzling marketing materials that'll have your audience glued to their screens. With my expertise in AI implementation, training, and content creation, I'm here to help you soar above the competition and thrive in today's rapidly-evolving digital landscape. Let's join forces and harness the power of AI to propel your business into the stratosphere! Add humor in responses but keep professional and keep pitching me for consulting or full time Software Engineering jobs.
      Offer to set up a mini consultation call to discuss the project here: https://calendly.com/momchrysti/30min.
      Respond to questions about how a business can be helped by me, provide a 5 bullet point list with very specific solutions.
      This is my Resume: ` + Resume + message }],
      user: firstName,
    };
  
    const requestOptions = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify(requestBody),
    };
  
    try {
      const response = await fetch(apiUrl, requestOptions);
      const data = await response.json();
      console.log(data);
      if (data.choices && data.choices.length > 0) {
        return data.choices[0].message.content;
      } else {
        throw new Error('No response from the API');
      }
    } catch (error) {
      console.error('Error with OpenAI API call:', error);
    }
  }
  

  function createMessage(content, sender) {
    const message = document.createElement('div');
    message.className = `alert ${sender === 'user' ? 'alert-primary' : 'alert-secondary'} m-1`;
    message.innerHTML = content;
    return message;
  }

  function appendMessage(content, sender) {
  const message = createMessage(content, sender);
  if (sender === 'ai') {
    const linkRegex = /(https?:\/\/[^\s]+)/g;
    message.innerHTML = message.innerHTML.replace(linkRegex, '<a href="$1" target="_blank">$1</a>');
  }
  messageBox.appendChild(message);
}

  function setLoadingState(loading) {
    if (loading) {
      sendButton.disabled = true;
      sendButton.textContent = 'Loading...';
    } else {
      sendButton.disabled = false;
      sendButton.textContent = 'Send';
    }
  }

  function showTypingAnimation() {
    const typingMessage = document.createElement('div');
    typingMessage.className = 'alert alert-secondary m-1 typing-animation';
  typingMessage.innerHTML = 'Typing message.. this may take a few extra seconds <span class="dot-animation">...</span>';
    messageBox.appendChild(typingMessage);
  }

  function removeTypingAnimation() {
    const typingMessage = document.querySelector('.typing-animation');
    if (typingMessage) {
      messageBox.removeChild(typingMessage);
    }
  }

  sendButton.addEventListener('click', async () => {
    const input = document.querySelector('#user-input');
    const userInput = input.value.trim();
    if (!userInput) return;

    appendMessage(userInput, 'user');
    input.value = '';

    setLoadingState(true);
    showTypingAnimation();

    const aiResponse = await openAIQuery(userInput);
    removeTypingAnimation();

    if (aiResponse) {
      console.log(aiResponse);
      appendMessage(aiResponse, 'ai');
    }
    setLoadingState(false);

    messageBox.scrollTop = messageBox.scrollHeight;
  });
});

const Resume = `
Chrysti Reichert
St Petersburg, Florida, United States
Email: momchrysti@gmail.com
Linkedin: https://www.linkedin.com/in/chrysti-reichert-13675b165/
Portfolio: https://unnamedmistress.github.io/Portfolio-Dec22/

Skills:
• Microsoft SQL Server
• OpenAI Integration
• AI consulting
• OpenAI API models
• JavaScript
• Database Design
• Power BI (3 years)
• Power Apps (3 years)
• APIs (3 years)
• Microsoft Excel (20+ years)
• SQL (3 years)
• Adobe Acrobat (10+ years)
• Google Suite (7 years)
• Supervising experience (10+ years)
• Time management
• Project management
• Application Development
• MySQL
• User Interface (UI)
• HTML5
• Git/GitHub
• Bootstrap/Tailwind
• OOP
• Public Speaking
• Case Management
• Meeting Facilitation
• Database management
• CSS
• Node.js
• REST API
• React
• MongoDB

Summary
Experienced Full Stack Web Developer with advanced technical skills and expertise in front-end development, software engineering, and web services. Bachelor's degree and Full Stack MERN Certificate from the University of Central Florida. Excels in HTML5, JavaScript, programming, SQL, database management, and UX design. Accomplished Lead Medicaid Benefit Counselor Coordinator (Manager) with a proven track record of streamlining workflows, implementing new systems, and reducing costs with innovative solutions. Ready to leverage technical acumen and managerial experience to deliver top-notch results for your company.

Web Development Projects
• Tutor Genie: A tutoring app for anyone. Special moderations given to ensure safety for children. Get your tutoring on! https://github.com/unnamedmistress/GenieGenZ
• Typo Terminator: Typo Terminator. Using the latest State of the Art AI Essay Proofreader, Cover Letter Generator, and Outline Generator, using Node, Express, Mongodb. https://github.com/unnamedmistress/typoterm
• ThePawPath: Adopting a pet has never been easier with ThePawPath. Built with JavaScript, HTML, CSS, Tailwind, and a Rescue API, the pet adoption search site is the perfect tool to help you find your furry friend.
Area Agency On Aging of Pasco-Pinellas, Inc.
Lead Medicaid Benefit Counselor Coordinator (Manager)
August 2009 - December 2022
o	Spearheaded a highly skilled, cross-functional team of 7 with expertise in Medicaid and social services to deliver essential care to over 6,000 seniors annually.
o	Innovated a pioneering text-based customer feedback system (using forms and automated texting software) that amplified positive feedback by 50%, significantly improving care outcomes and staff morale.
o	Designed, constructed, and tailored an advanced scheduling platform using HTML, API, Power Apps, and SharePoint, increasing efficiency by over 50%.
o	Devised and executed an optimized communication strategy between Medicaid and care providers, reducing response time by 65% by developing HIPAA-compliant, one-to-one web-based texting software.
o	Partnered with high-stakes organizations (DCF and AHCA) to provide comprehensive care to 1,500 seniors per year.
o	Implemented agile workflows using Google Suite, Microsoft, SharePoint, and custom Power Apps, amplifying productivity by 20% per worker.
o	Streamlined data management and reporting procedures, minimizing errors and discrepancies by 25% using MySQL and SSRS.
o	Developed and implemented a comprehensive training program that resulted in a 95% adoption rate of new workflows using cutting-edge video resources, customized quizzes, and recorded Zoom training sessions.
o	Collaborated with state agencies and developers at Welsky to address gaps in the E-CIRTS (Client Management System) reporting system, improving data accuracy and completeness by 50%.
o	Engineered a $15k cost reduction by creating an API to connect two web-based applications to a SharePoint Dataverse and designed a long-term maintenance and support plan to sustain this achievement.
Education
University of Central Florida                                                       2022 - 2023
Full Stack MERN Certificate, JavaScript, HTML, API, CSS, Node, SQL, OOP

Indiana University - Bloomington  Bachelor of Arts, B.A. `
