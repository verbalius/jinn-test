# JINN: jinn-test
record audio to audd.io api

## Run & Deploy

### Set up virtual venv
	
	$ python3 -m venv env
	$ source env/bin/activate

or if you are on windos..just delete windows..or

	$ .\env\bin\activate

install requirements

	(env)$ pip install -r requirements.txt

## Run the the project

### Python way (can work as production)

	(env)$ python jinn.py

### Flask way (DEBUG, not cool way)

	(env)$ export FLASK_APP=jinn.py
	(env)$ flask run

### Deploy heroku

Environmental variables:

	AUDD_API and FLASK_KEY

Procfile:

	web: gunicorn --worker-class eventlet -w 1 jinn:app