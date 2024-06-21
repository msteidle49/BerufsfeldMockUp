from flask import Flask, render_template, redirect, url_for

app = Flask(__name__)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/back_to_home')
def back_to_home():
    return redirect(url_for('homepage'))

if __name__ == '__main__':
    app.run(debug=True)