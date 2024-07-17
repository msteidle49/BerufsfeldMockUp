from flask import Flask, render_template, redirect, url_for, jsonify, send_file

app = Flask(__name__)

@app.route('/')
def login():
    return render_template('login.html')

@app.route('/main')
def index():
    return render_template('index.html')

@app.route('/patient')
def patient():
    return render_template('patient.html')

@app.route('/get_json_data')
def get_json_data():
    json_filename = './static/data/patienten.json'
    return send_file(json_filename)

@app.route('/get_termin_data')
def get_termin_data():
    json_filename = './static/data/termine.json'
    return send_file(json_filename)

if __name__ == '__main__':
    app.run(debug=True)
