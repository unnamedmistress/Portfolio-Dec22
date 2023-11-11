document.addEventListener('DOMContentLoaded', async () => {
  const messageBox = document.querySelector('#message-box');
  const sendButton = document.querySelector('#send-button');

  function showInitialMessage() {
    const initialMessage = 'Hi, How can we help you evolve with Artificial Intelligence today?';
    appendMessage(initialMessage, 'ai');
  }
  async function openAIQuery(userInput) {
    try {
      const response = await fetch('/openai-query', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userInput }),
      });
      const data = await response.json();
      return data.aiResponse;
    } catch (error) {
      alert (`You've hit the question limit or the AI is temporarily undergoing maintenance, reload the page to ask more or schedule a consultation with me.`);
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

  async function handleSendMessage() {
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
  }
  showInitialMessage();

  sendButton.addEventListener('click', handleSendMessage);

  document.querySelector('#user-input').addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      handleSendMessage();
    }
  });
});
