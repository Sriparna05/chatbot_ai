document.addEventListener("DOMContentLoaded", () => {
  const chatForm = document.getElementById("chat-form");
  const userInput = document.getElementById("user-input");
  const chatLog = document.getElementById("chat-log");
  const suggestionChipsContainer = document.getElementById("suggestion-chips");
  const sendButton = document.getElementById("send-button");

  userInput.addEventListener("input", () => {
    sendButton.classList.toggle("active", userInput.value.trim().length > 0);
  });

  const appendMessage = (text, sender) => {
    const messageElement = document.createElement("div");
    messageElement.classList.add("chat-message", `${sender}-message`);
    messageElement.textContent = text;
    chatLog.appendChild(messageElement);
    chatLog.scrollTop = chatLog.scrollHeight;
  };

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

  chatForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const question = userInput.value.trim();
    if (!question) return;
    appendMessage(question, "user");
    userInput.value = "";
    sendButton.classList.remove("active");
    suggestionChipsContainer.style.display = "none"; // Hide chips after first question

    showTypingIndicator();
    try {
      const response = await fetch("/ask", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: question }),
      });
      hideTypingIndicator();
      const data = await response.json();
      appendMessage(data.answer || data.error, "bot");
    } catch (error) {
      hideTypingIndicator();
      appendMessage("Sorry, something went wrong. Please try again.", "bot");
    }
  });

  // --- NEW: FUNCTION TO FETCH AND DISPLAY SUGGESTIONS ---
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
          userInput.dispatchEvent(new Event("input")); // Activate send button
          chatForm.dispatchEvent(
            new Event("submit", { cancelable: true, bubbles: true })
          );
        };
        suggestionChipsContainer.appendChild(chip);
      });
    } catch (error) {
      console.error("Error fetching suggestions:", error);
      suggestionChipsContainer.style.display = "none"; // Hide on error
    }
  };

  // --- INITIAL SETUP ---
  appendMessage("Hello! I'm SupportBot. How can I assist you today?", "bot");
  fetchSuggestions(); // Call the new function on page load
});
