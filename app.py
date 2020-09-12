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
from werkzeug.http import HTTP_STATUS_CODES


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

@app.route('/api/jsonData/?q/budget<budget>/salesWeight<salesWeight>/crimeWeight<crimeWeight>/schoolWeight<schoolWeight>/acreageWeight<acreageWeight>/sqftWeight<sqftweight>/floodWeight<floodWeight>/valueChangeWeight<valueChangeWeight>')
def data(weightCriteriaProvided):
    inputBudget = (int(request.args['budget']), 1000000)
    inputSalesWeight= (int(request.args['salesweight']), 5)
    inputCrimeWeight= (int(request.args['crimeWeight']), 5)
    inputSchoolWeight=(int(request.args['schoolWeight']), 5)
    inputAcreageWeight=(int(request.args['acreageWeight']), 5)
    inputSQFTWeight=(int(request.args['sqftWeight']), 5)
    inputFloodWeight=(int(request.args['floodWeight']), 5)
    inputValueChangeWeight=(int(request.args['valueChangeWeight']), 5)

  
    data = processInputs.scores(weightCriteriaProvided)
    return jsonify(data)

@app.route('/apis')
def apis():
    return(
        f'Available api routes: <br>'
        f'json Data: /api/jsonData/weightCriteriaProvided <br> '
        f'Results:  /api/weightCriteriaProvided'
    )

@app.route("/test", methods=["POST"])
def test():
    budget = request.form["budget"]
    return budget

##########  ERROR HANDLING ##################
def error_response(status_code, message=None):
    payload = {'error': HTTP_STATUS_CODES.get(status_code, 'Unknown error')}
    if message:
        payload['message'] = message
    response = jsonify(payload)
    response.status_code = status_code
    return response
     

############# FLASK CLOSING CODE ###################    
if __name__ =='__main__':
    app.run(debug=True)