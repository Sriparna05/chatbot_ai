# app.py
import os
import google.generativeai as genai
from dotenv import load_dotenv
from flask import Flask, render_template, request, jsonify
from system_prompt import SYSTEM_PROMPT
from knowledge_base import KNOWLEDGE_BASE
import json

load_dotenv()
genai.configure(api_key=os.getenv("GOOGLE_API_KEY"))
model = genai.GenerativeModel('gemini-2.5-flash')


app = Flask(__name__)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/ask', methods=['POST'])
def ask():
    data = request.get_json()
    user_question = data.get('question', '')
    if not user_question:
        return jsonify({'error': 'No question provided'}), 400
    try:
        full_prompt = f"{SYSTEM_PROMPT}\n\nUser Question: {user_question}"
        response = model.generate_content(full_prompt)
        return jsonify({'answer': response.text})
    except Exception as e:
        return jsonify({'error': 'Failed to get a response from the AI model.'}), 500

# --- NEW ENDPOINT TO GENERATE SUGGESTIONS ---
@app.route('/get-suggestions', methods=['GET'])
def get_suggestions():
    """Generates and returns suggested questions using the AI."""
    try:
        suggestion_prompt = f"""
        Based on the following knowledge base, generate exactly 3 diverse, short, and engaging sample questions a user might ask.
        The questions should cover different topics from the knowledge base (e.g., one HR, one IT, one customer).
        Return the result as a valid JSON array of strings. For example: ["Question 1?", "Question 2?", "Question 3?"]

        Knowledge Base:
        {KNOWLEDGE_BASE}
        """
        response = model.generate_content(suggestion_prompt)
        suggestions_text = response.text.strip().replace("`", "")
        if suggestions_text.startswith("json"):
            suggestions_text = suggestions_text[4:].strip()
        suggestions = json.loads(suggestions_text)
        return jsonify(suggestions)
    except Exception as e:
        # Provide fallback suggestions if the AI fails
        fallback_suggestions = ["What is the leave policy?", "How do I reset my password?", "What is your return policy?"]
        return jsonify(fallback_suggestions)

if __name__ == '__main__':
    app.run(debug=True)