# eMentora AI FAQ Chatbot

![Python Version](https://img.shields.io/badge/python-3.9+-blue.svg)
![Framework](https://img.shields.io/badge/Framework-Flask-green.svg)
![AI](https://img.shields.io/badge/AI-Google%20Gemini%20Pro-purple.svg)

A sophisticated, production-ready FAQ chatbot powered by the Google Gemini Pro API. This application provides instant, accurate answers to user questions based on a custom knowledge base for the EdTech company, eMentora. It features a sleek, modern, and fully animated user interface designed for a premium user experience.

## Core Features

- **Dynamic AI Backend**: Utilizes the powerful Google Gemini Pro model to understand user queries and provide contextually relevant answers.
- **Custom Knowledge Base**: The chatbot's knowledge is entirely based on modular, easy-to-update Python files (`knowledge_base.py`), ensuring all responses are accurate and specific to eMentora.
- **AI-Generated Suggestions**: On startup, the chatbot uses AI to generate relevant "suggestion chips," providing users with intelligent starting points for their conversation.
- **Interactive Chat Interface**: A full-fledged chat log displays a threaded conversation between the user and the bot, complete with timestamps and distinct message bubbles.
- **Stunning "Void" UI/UX**:
  - A dark, near-black theme creates a modern and focused atmosphere.
  - A lively, animated background with fading circles provides a sense of depth and dynamism.
  - "Glassmorphism" effect on the main container for a sleek, frosted look.
  - Subtle glow effects on all interactive elements (text boxes, buttons, messages) that enhance visibility and provide a futuristic feel.
- **Enhanced User Experience**: Includes a real-time typing indicator while the bot is processing a response and an active/inactive state for the send button.
- **Production-Ready Deployment**: Configured to be served with Gunicorn, a robust WSGI server suitable for production environments.

## Technology Stack

- **Backend**: Python, Flask
- **AI Model**: Google Gemini Pro API (`google-generativeai`)
- **Frontend**: HTML5, CSS3, JavaScript
- **Deployment Server**: Gunicorn
- **Environment Management**: `python-dotenv` for secure API key management

## Project Structure

```
gemini-faq-chatbot/
├── static/
│   ├── css/
│   │   └── style.css
│   └── js/
│       └── script.js
│   └── icon.png
├── templates/
│   └── index.html
├── app.py
├── knowledge_base.py
├── system_prompt.py
├── .env
├── .gitignore
└── requirements.txt
```

---

## Setup and Installation

Follow these steps to get the application running on your local machine.

### 1. Clone the Repository

```bash
git clone https://github.com/Sriparna05/chatbot_ai
cd gemini-faq-chatbot
```

### 2. Create and Activate a Virtual Environment

This keeps your project dependencies isolated.

```bash
# Create the virtual environment
python -m venv venv

# Activate it
# On Windows:
venv\Scripts\activate
# On macOS/Linux:
source venv/bin/activate
```

### 3. Install Dependencies

Create a `requirements.txt` file and then install from it.

```bash
# First, create the file (if you haven't already)
pip freeze > requirements.txt

# Then, install the dependencies
pip install -r requirements.txt
```

### 4. Set Up Your Environment Variables

You need to provide your Google API key.

1.  Create a file named `.env` in the root directory.
2.  Add your API key to this file:

    ```
    GOOGLE_API_KEY="your-google-api-key-here"
    ```

    _The `.gitignore` file is configured to ignore this file, keeping your key secure._

---

## How to Run the Application

You can run the application in two ways:

### 1. For Development (using Flask's built-in server)

This method is perfect for testing and making changes, as it automatically reloads the server when you save a file.

```bash
python app.py
```

Now, open your web browser and navigate to `http://127.0.0.1:5000`.

### 2. For Production (using Gunicorn)

This is the recommended way to run the application for multiple users or for deployment. It is much more robust and performant.

```bash
gunicorn -w 4 -b 0.0.0.0:8000 app:app
```

- `-w 4`: Runs 4 worker processes to handle simultaneous requests.
- `-b 0.0.0.0:8000`: Binds the server to port 8000 and makes it accessible from other devices on your network.

Now, open your web browser and navigate to `http://localhost:8000`. To stop the server, press `Ctrl+C` in your terminal.
