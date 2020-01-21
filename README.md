# jinn-test
record audio to audd.io api

## set up environment

### set up virtual venv
	
	$ python3 -m venv env
	$ source env/bin/activate

or if you are on windos..just delete windows..or

	$ .\env\bin\activate

install requirements

	(env)$ pip install -r requirements.txt

## run the the project

### python way (can work as production)

	(env)$ python jinn.py

### flask way (DEBUG, not cool way)

	export FLASK_APP=jinn.py
	flask run