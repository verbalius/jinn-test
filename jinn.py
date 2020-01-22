from flask import Flask, render_template
from flask_socketio import SocketIO, emit
from base64 import b64encode, b64decode

app = Flask(__name__,
            static_url_path='', 
            static_folder='static',
            template_folder='templates')

app.config['SECRET_KEY'] = 'secret!'
socketio = SocketIO(app)

@app.route('/')
def index():
    return render_template('index.html')

@socketio.on('audio')
def handle_message(message):
    message = b64decode(message)
    my_data_file = open('audio.ogg', 'w+b')
    my_data_file.write(message)
    my_data_file.close()
    print('written audio to file')

@socketio.on('connect', namespace='/test')
def test_connect():
    emit('my response', {'data': 'Connected'})

@socketio.on('disconnect', namespace='/test')
def test_disconnect():
    print('Client disconnected')

if __name__ == '__main__':
    socketio.run(app)