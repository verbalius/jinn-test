# JINN: jinn-test
record audio to audd.io api

Find the running project on heroku:
https://jinn-test-task.herokuapp.com/

## Prepare

### Set up virtual venv
	
	$ python3 -m venv env
	$ source env/bin/activate

or if you are on windos..just delete windows..or

	$ .\env\bin\activate

install requirements

	(env)$ pip install -r requirements.txt

## Run/Deploy the the project

### Python way

	(env)$ export AUDD_API=your_audd_api_key
	(env)$ export FLASK_KEY=flask_encrypt_key
	(env)$ python jinn.py

### Deploy heroku

Specify environmental variables:

	AUDD_API and FLASK_KEY

Procfile content (for info, can be unchanged):

	web: gunicorn --worker-class eventlet -w 1 jinn:app
