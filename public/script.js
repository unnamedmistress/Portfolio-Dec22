document.addEventListener('DOMContentLoaded', async () => {
  // --- MODAL Elements ---
  const chatModalElement = document.getElementById('chatModal');
  const chatModal = new bootstrap.Modal(chatModalElement); // Initialize Bootstrap Modal JS
  const messageBox = chatModalElement.querySelector('#message-box'); // Target elements inside modal
  const sendButton = chatModalElement.querySelector('#send-button');
  const userInput = chatModalElement.querySelector('#user-input');

  // --- MODAL Trigger Logic ---
  let modalShown = false;
  let scrollTimeout;

  function showModalAfterScroll() {
    if (modalShown) return; // Don't show if already shown or manually opened

    clearTimeout(scrollTimeout); // Clear previous timeout if user keeps scrolling
    scrollTimeout = setTimeout(() => {
      if (!modalShown) { // Double check before showing
        chatModal.show();
        modalShown = true; // Mark as shown automatically
        showInitialMessage(); // Show initial message when modal pops up
        // Optional: Remove scroll listener after showing modal
        // window.removeEventListener('scroll', showModalAfterScroll);
      }
    }, 2000); // Show modal 5 seconds after scrolling stops
  }

  // Add scroll listener
  window.addEventListener('scroll', showModalAfterScroll, { passive: true });

  // Prevent scroll listener from triggering if user manually closes modal
  chatModalElement.addEventListener('hidden.bs.modal', () => {
      modalShown = true; // Mark as shown (even if closed) to prevent auto-popup again
      clearTimeout(scrollTimeout); // Stop timer if modal is closed before it triggers
      window.removeEventListener('scroll', showModalAfterScroll); // Stop listening after interaction
  });
  // --- End MODAL Trigger Logic ---


  // --- Chat Functions (largely the same, ensure selectors target modal elements) ---

  function showInitialMessage() {
    if (messageBox.children.length === 0) {
       const initialMessage = 'Hi! I\'m an AI assistant trained on Chrysti\'s expertise. How can I help you explore AI, Power Platform, or Azure solutions today?';
       appendMessage(initialMessage, 'ai');
    }
  }

  async function openAIQuery(input) {
    setLoadingState(true);
    showTypingAnimation();
    try {
      const response = await fetch('/openai-query', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userInput: input }),
      });
      const data = await response.json();
      removeTypingAnimation();
      setLoadingState(false);

      if (data.error) {
        appendMessage(`Sorry, there was an error: ${data.error}`, 'ai');
        return null;
      }
      return data.aiResponse;

    } catch (error) {
      removeTypingAnimation();
      setLoadingState(false);
      appendMessage(`An issue occurred connecting to the AI service. Please try again later or connect with Chrysti directly via LinkedIn.`, 'ai');
      console.error('Error with OpenAI API call:', error);
      return null;
    }
  }

  function createMessage(content, sender) {
    const message = document.createElement('div');
    message.className = `d-flex ${sender === 'user' ? 'justify-content-end' : 'justify-content-start'} mb-3 align-items-end`;

    const bubble = document.createElement('div');
    bubble.className = `speech-bubble shadow-sm ${sender === 'user' ? 'user-bubble bg-primary text-white' : 'ai-bubble bg-light text-dark'} p-3`;
    bubble.style.wordBreak = 'break-word';
    bubble.innerHTML = content;

    const avatar = document.createElement('img');
    avatar.className = 'avatar rounded-circle border shadow-sm';
    avatar.alt = sender === 'user' ? 'User' : 'AI (Chrysti)';
    avatar.src = sender === 'user'
      ? 'https://ui-avatars.com/api/?name=User&background=6c757d&color=fff'
      : './assets/img/P2355734.jpg';
    avatar.style.width = '40px';
    avatar.style.height = '40px';
    avatar.style.objectFit = 'cover';

    if (sender === 'user') {
      message.appendChild(bubble);
      message.appendChild(avatar);
      avatar.style.marginLeft = '0.5rem';
    } else {
      message.appendChild(avatar);
      message.appendChild(bubble);
      avatar.style.marginRight = '0.5rem';
    }
    return message;
  }

  function appendMessage(content, sender) {
    if (!content) return;
    const messageElement = createMessage(content, sender);
    messageBox.appendChild(messageElement);
    messageBox.scrollTop = messageBox.scrollHeight;
  }

  function setLoadingState(loading) {
    userInput.disabled = loading;
    sendButton.disabled = loading;
    if (loading) {
      sendButton.innerHTML = '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>';
    } else {
      sendButton.innerHTML = '<i class="bi bi-send-fill"></i>';
    }
  }

  function showTypingAnimation() {
    removeTypingAnimation();
    const typingMessage = document.createElement('div');
    typingMessage.className = 'd-flex justify-content-start mb-3 align-items-center typing-animation';
    typingMessage.innerHTML = `
      <img src="./assets/img/P2355734.jpg" alt="AI Typing" class="avatar rounded-circle border shadow-sm" style="width:40px;height:40px; object-fit: cover; margin-right: 0.5rem;">
      <div class="ai-bubble bg-light text-dark p-3 shadow-sm">
        <div class="spinner-grow spinner-grow-sm text-primary me-1" role="status"></div>
        <div class="spinner-grow spinner-grow-sm text-primary me-1" style="animation-delay: 0.1s;" role="status"></div>
        <div class="spinner-grow spinner-grow-sm text-primary" style="animation-delay: 0.2s;" role="status"></div>
      </div>
    `;
    messageBox.appendChild(typingMessage);
    messageBox.scrollTop = messageBox.scrollHeight;
  }

  function removeTypingAnimation() {
    const typingMessage = messageBox.querySelector('.typing-animation');
    if (typingMessage) typingMessage.remove();
  }

  async function handleSendMessage() {
    const text = userInput.value.trim();
    if (text === '') return;
    appendMessage(text, 'user');
    userInput.value = '';
    const aiResponse = await openAIQuery(text);
    if (aiResponse) {
        appendMessage(aiResponse, 'ai');
    }
  }

  // Event listeners for modal chat elements
  sendButton.addEventListener('click', handleSendMessage);
  userInput.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      handleSendMessage();
    }
  });

  // Optional: Show initial message if modal is opened manually later (e.g., via another button)
  // chatModalElement.addEventListener('shown.bs.modal', () => {
  //    showInitialMessage();
  // });

});
