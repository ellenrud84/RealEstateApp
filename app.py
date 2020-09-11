# load dependencies
import sqlalchemy
from sqlalchemy.ext.automap import automap_base
from sqlalchemy.orm import Session
from sqlalchemy import create_engine, func, inspect,join
import numpy as np
import pandas as pd
from flask import (Flask, render_template, jsonify, request, redirect)
from flask_sqlalchemy import SQLAlchemy
import json
from user_inputs import default_inputs
import pull
import processInputs


####### INITIATE FLASK APP #########################
app= Flask(__name__)

###### DEFINE HOME ROUTE #################################
@app.route('/api/<weightCriteriaProvided>')
def results(weightCriteriaProvided):
    ##############CALL ON SCORES MODULE FROM processInputs WITH DEFAULT INPUTS######################################
    data = processInputs.scores(weightCriteriaProvided)
    ########## RETURNS AT HOME ROUTE: #####################
    return render_template('results.html', table=[data.to_html(classes='data')], titles=data.columns.values)


@app.route('/')
def home():
    return render_template('index.html')

@app.route('/api/jsonData/<weightCriteriaProvided>')
def data(weightCriteriaProvided):
    data = processInputs.scores(weightCriteriaProvided)
    return jsonify(data)

@app.route('/apis')
def apis():
    return(
        f'Available api routes: <br>'
        f'json Data: /api/jsonData/weightCriteriaProvided <br> '
        f'Results:  /api/weightCriteriaProvided'
    )
       
        

############# FLASK CLOSING CODE ###################    
if __name__ =='__main__':
    app.run(debug=True)