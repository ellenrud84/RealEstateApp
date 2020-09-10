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
@app.route('/')
def home():
    ##############CALL ON SCORES MODULE FROM processInputs WITH DEFAULT INPUTS######################################
    data = processInputs.scores(default_inputs)
    ########## RETURNS AT HOME ROUTE: #####################
    return render_template('index.html', table=[data.to_html(classes='data')], titles=data.columns.values)

############# FLASK CLOSING CODE ###################    
if __name__ =='__main__':
    app.run(debug=True)