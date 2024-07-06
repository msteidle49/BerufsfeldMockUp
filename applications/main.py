from flask import Flask, render_template, redirect, url_for

app = Flask(__name__)

@app.route('/')
def login():
    return render_template('login.html')

@app.route('/main')
def index():
    return render_template('index.html')

@app.route('/termin')
def termin():
    return render_template('termin.html')

@app.route('/termin/wahl')
def terminwahl():
    return render_template('terminWahl.html')

if __name__ == '__main__':
    app.run(debug=True)
