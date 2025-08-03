document.addEventListener("DOMContentLoaded", () => {
  const chatForm = document.getElementById("chat-form");
  const userInput = document.getElementById("user-input");
  const chatLog = document.getElementById("chat-log");
  const suggestionChipsContainer = document.getElementById("suggestion-chips");

  // --- Function to append a message to the chat log ---
  const appendMessage = (text, sender) => {
    const messageElement = document.createElement("div");
    messageElement.classList.add("chat-message", `${sender}-message`);
    messageElement.textContent = text;
    chatLog.appendChild(messageElement);
    chatLog.scrollTop = chatLog.scrollHeight; // Auto-scroll to the bottom
  };

  // --- Function to show/hide typing indicator ---
  const showTypingIndicator = () => {
    const indicator = document.createElement("div");
    indicator.classList.add("chat-message", "bot-message", "typing-indicator");
    indicator.innerHTML = "<span></span><span></span><span></span>";
    chatLog.appendChild(indicator);
    chatLog.scrollTop = chatLog.scrollHeight;
  };

  const hideTypingIndicator = () => {
    const indicator = document.querySelector(".typing-indicator");
    if (indicator) {
      indicator.remove();
    }
  };

  // --- Handle form submission ---
  chatForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const question = userInput.value.trim();
    if (!question) return;

    // 1. Display user's message
    appendMessage(question, "user");
    userInput.value = ""; // Clear input field

    // 2. Show typing indicator
    showTypingIndicator();

    // 3. Send question to backend and get response
    try {
      const response = await fetch("/ask", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: question }),
      });

      hideTypingIndicator();

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      appendMessage(data.answer, "bot");
    } catch (error) {
      console.error("Fetch error:", error);
      hideTypingIndicator();
      appendMessage("Sorry, something went wrong. Please try again.", "bot");
    }
  });

  // --- Fetch and display AI-generated suggestions ---
  const fetchSuggestions = async () => {
    try {
      const response = await fetch("/get-suggestions");
      const suggestions = await response.json();

      suggestionChipsContainer.innerHTML = ""; // Clear old chips
      suggestions.forEach((text) => {
        const chip = document.createElement("button");
        chip.classList.add("chip");
        chip.textContent = text;
        chip.onclick = () => {
          userInput.value = text;
          chatForm.dispatchEvent(
            new Event("submit", { cancelable: true, bubbles: true })
          );
        };
        suggestionChipsContainer.appendChild(chip);
      });
    } catch (error) {
      console.error("Error fetching suggestions:", error);
    }
  };

  // --- Initial setup ---
  appendMessage("Hello! I'm SupportBot. How can I assist you today?", "bot");
  fetchSuggestions();
});
