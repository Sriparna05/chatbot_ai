# app.py
import os
import google.generativeai as genai
from dotenv import load_dotenv
from flask import Flask, render_template, request, jsonify
from system_prompt import SYSTEM_PROMPT

load_dotenv()
genai.configure(api_key=os.getenv("GOOGLE_API_KEY"))
model = genai.GenerativeModel('gemini-2.5-flash')


app = Flask(__name__)

@app.route('/', methods=['GET'])
def index():
    """Serves the main HTML page."""
    return render_template('index.html')

@app.route('/ask', methods=['POST'])
def ask():
    """Handles the chatbot query and returns a JSON response."""
    data = request.get_json()
    user_question = data.get('question', '')

    if not user_question:
        return jsonify({'error': 'No question provided'}), 400

    try:
        model = genai.GenerativeModel('gemini-2.5-flash')
        full_prompt = f"{SYSTEM_PROMPT}\n\nUser Question: {user_question}"
        response = model.generate_content(full_prompt)
        
        # We add a little "thinking" effect by simulating a stream if needed,
        # but for simplicity, we'll just return the full text.
        bot_answer = response.text

        return jsonify({'answer': bot_answer})
    except Exception as e:
        print(f"Error calling Gemini API: {e}")
        return jsonify({'error': 'Failed to get a response from the AI model.'}), 500

if __name__ == '__main__':
    app.run(debug=True)