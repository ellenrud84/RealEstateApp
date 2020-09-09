# load modules
from flask import (Flask, render_template, jsonify, request, redirect)
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from models import create_classes
from sqlalchemy import create_engine
import os
import pandas as pd
import psycopg2
import json
import collections
import sys

app= Flask(__name__)
engine= create_engine("postgres://wtzcxlhtevtgnn:a611ddfea80402e93d32df58dad93c3dfe320544d635b77e14e9bb8936eeca9e@ec2-52-86-116-94.compute-1.amazonaws.com:5432/d5hl5ab4698nnc")

app.config['SQLALCHMEY_DATABASE_URI']= os.environ.get('DATABASE_URL', "postgres://wtzcxlhtevtgnn:a611ddfea80402e93d32df58dad93c3dfe320544d635b77e14e9bb8936eeca9e@ec2-52-86-116-94.compute-1.amazonaws.com:5432/d5hl5ab4698nnc")

app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False 


db= SQLAlchemy(app)

Classes= create_classes(db)

@app.route("/jsondata")
def jsondata():
    rows= engine.execute("select flood_description, name, address, city, zip_code, district_id, latitude, longitude, neighborhood_code, 
@app.route('/')
def hello():
    return{"hello":"world"}
def data():
    rows = engine.execute("select * from master")
    return render_template("data.html", data=rows)

if __name__ =='__main__':
    app.run(debug=True)