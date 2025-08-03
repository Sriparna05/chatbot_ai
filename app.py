# app.py
import os
import google.generativeai as genai
from dotenv import load_dotenv
from flask import Flask, render_template, request
from system_prompt import SYSTEM_PROMPT

# --- SETUP (Same as before) ---
load_dotenv()
genai.configure(api_key=os.getenv("GOOGLE_API_KEY"))
model = genai.GenerativeModel('gemini-2.5-flash')


# --- FLASK APP ---
app = Flask(__name__)

@app.route('/', methods=['GET', 'POST'])
def home():
    answer = ""
    question = ""
    if request.method == 'POST':
        question = request.form.get('question')
        if question:
            full_prompt = f"{SYSTEM_PROMPT}\n\nUser Question: {question}"
            response = model.generate_content(full_prompt)
            answer = response.text
    
    return render_template('index.html', question=question, answer=answer)

if __name__ == '__main__':
    app.run(debug=True)