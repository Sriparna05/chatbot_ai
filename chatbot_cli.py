import os
import google.generativeai as genai
from dotenv import load_dotenv
from system_prompt import SYSTEM_PROMPT


# Load environment variables from .env file
load_dotenv()

# Configure the Gemini API
genai.configure(api_key=os.getenv("GOOGLE_API_KEY"))
model = genai.GenerativeModel('gemini-2.5-flash')
print("--- SupportBot is online! Ask your question or type 'quit' to exit. ---")

# Start a conversation loop
while True:
    user_question = input("You: ")
    if user_question.lower() == 'quit':
        print("SupportBot: Goodbye!")
        break

    # Combine the system prompt with the user's question
    full_prompt = f"{SYSTEM_PROMPT}\n\nUser Question: {user_question}"
    
    # Send the prompt to the model
    response = model.generate_content(full_prompt)

    # Print the model's response
    print(f"SupportBot: {response.text}")
