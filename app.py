# load dependencies
import sqlalchemy
from sqlalchemy.ext.automap import automap_base
from sqlalchemy.orm import Session
from sqlalchemy import create_engine, func, inspect,join
import numpy as np
import pandas as pd
from flask import (Flask, render_template, jsonify, request, redirect)
from flask_sqlalchemy import SQLAlchemy
from processInputs import scores
from userInputs import default_inputs

app= Flask(__name__)
hello_dict = {"hello":"world2"}

@app.route("/jsondata")
def jsondata():
   scores(default_inputs)
   return render_template("index.html", j="top5hoods.json")


@app.route('/')
def hello():
    return jsonify(hello_dict)


if __name__ =='__main__':
    app.run(debug=True)