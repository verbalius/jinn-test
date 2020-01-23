from flask import Flask, render_template, request
from flask_socketio import SocketIO, emit
from base64 import b64encode, b64decode
import requests
import json
import secrets
import os, stat
from re import sub

app = Flask(__name__,
            static_url_path='', 
            static_folder='static',
            template_folder='templates')

app.config['SECRET_KEY'] = os.environ['FLASK_KEY']
socketio = SocketIO(app)

@app.route('/')
def index():
    return render_template('index.html')

@socketio.on('audio')
def handle_message(audio_blob_b64):
    audio_blob_binary = b64decode(audio_blob_b64)
    file_name = secrets.token_hex(15) + '.ogg'
    file_path = 'static/' + file_name
    my_data_file = open(file_path, 'w+b')
    my_data_file.write(audio_blob_binary)
    my_data_file.close()
    os.chmod(file_path, stat.S_IRUSR | stat.S_IWUSR | stat.S_IROTH)
    print('written audio to file')
    file_url = request.url_root+file_name
    print(file_url)
    data_processed_from_api = get_data_from_audd_api(file_url)
    audio_processing_results_json = json.dumps(data_processed_from_api, indent=4, sort_keys=True)
    emit('audio_results', audio_processing_results_json)
    os.remove(file_path)

@socketio.on('connect', namespace='/test')
def test_connect():
    emit('my response', {'data': 'Connected'})

@socketio.on('disconnect', namespace='/test')
def test_disconnect():
    print('Client disconnected')

def get_data_from_audd_api(file_url):
    data = {
        'url': file_url,
        'return': 'apple_music',
        'api_token': os.environ['AUDD_API']
    }

    result = requests.post('https://api.audd.io/recognizeWithOffset/', data=data)
    api_data = json.loads(result.text)
    if api_data['status'] != 'error' and result.status_code == 200:
        useful_data = {
            'status': 'success',
            'artist': api_data['result']['artist'],
            'title': api_data['result']['title']
        }
    else:
        useful_data = {
            'status' : 'error'
        }
        
    return useful_data

if __name__ == '__main__':
    socketio.run(app)