document.addEventListener("DOMContentLoaded", () => {
  const chatForm = document.getElementById("chat-form");
  const userInput = document.getElementById("user-input");
  const responseContainer = document.getElementById("response-container");
  const suggestionChips = document.querySelectorAll(".chip");

  chatForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const question = userInput.value.trim();
    if (!question) return;

    displayResponse("loading");

    try {
      const response = await fetch("/ask", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ question: question }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      displayResponse("success", data.answer);
    } catch (error) {
      console.error("Fetch error:", error);
      displayResponse(
        "error",
        "Sorry, something went wrong. Please try again."
      );
    }
  });

  // Handle suggestion chip clicks
  suggestionChips.forEach((chip) => {
    chip.addEventListener("click", () => {
      const query = chip.textContent;
      if (query !== "...") {
        userInput.value = query;
        chatForm.dispatchEvent(
          new Event("submit", { cancelable: true, bubbles: true })
        );
      }
    });
  });

  function displayResponse(type, content = "") {
    responseContainer.innerHTML = ""; // Clear previous content
    responseContainer.classList.add("visible");

    if (type === "loading") {
      const spinner = document.createElement("div");
      spinner.className = "spinner";
      responseContainer.appendChild(spinner);
    } else if (type === "success") {
      const strong = document.createElement("strong");
      strong.textContent = "SupportBot says:";
      const p = document.createElement("p");
      p.textContent = content;
      responseContainer.appendChild(strong);
      responseContainer.appendChild(p);
    } else if (type === "error") {
      const p = document.createElement("p");
      p.textContent = content;
      p.style.color = "#ff6b6b";
      responseContainer.appendChild(p);
    }
  }
});
