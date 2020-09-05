#  #Import Dependencies
# import sqlalchemy
# from sqlalchemy.ext.automap import automap_base
# from sqlalchemy.orm import Session
# from sqlalchemy import create_engine, func, inspect,join
# from key import url
# import numpy as np
# import pandas as pd

# # 1. Import datatable from Jonathan's csv:
# # -----------------------------------------
# path= TBD  #TO DO: ADD FILE PATH FROM JONATHANS OUTPUT

# pd.read_csv(path) #UPDATE WITH CSV READER

# neighborhoods=  [] #TO DO: PULL OUT LIST OF TOP 5 NEIGHBORHOODS

# # 2. Access SQL DB for info pull:
# # -----------------------------------------
# def SQL_Pull(budget, neighborhoods):

#     #Connect to PostgreSQL
#     #Create the engine
#     engine = create_engine(url)

#     # reflect an existing database into a new model
#     Base = automap_base()

#     # reflect the tables
#     Base.prepare(engine, reflect=True)
#     session=Session(engine)

#     #Using Pandas for Data Analysis
#     #  Read the appraisal Table
#     appraisal=pd.read_sql_table('appraisal',engine)
#     properties_df=pd.read_sql_table('properties',engine)

#     # run data pull only for addresses in the top 5 neighborhoods
#     top5props= pd.dataFame() # create blank dataframe called top5props
#     # TO DO: nestedfor loop:
#         #  for neighborhood neighborhoods,
#                     # include_me= properties.loc[properties.neighborhood_code]==neighborhood,
#                     # top5props.append(include_me)


#     # Calculate % of change of value between 2018 and 2019
#     appraisal_2018=appraisal.loc[appraisal.tax_year==2018,:]
#     appraisal_2019=appraisal.loc[appraisal.tax_year==2019,:]
#     appraisal_df=pd.merge(appraisal_2019,appraisal_2018,on='account', suffixes=('_2019','_2018'))
#     appraisal_df['pct_value_change']=(appraisal_df['total_appraised_value_2019']-appraisal_df['total_appraised_value_2018'])\
#                                   /appraisal_df['total_appraised_value_2018']*100
#     appraisal_df=appraisal_df[['id_2019','account','total_appraised_value_2019', 'pct_value_change']]
#     appraisal_df=appraisal_df.rename(columns={'id_2019':'id'})

#     # Filter by budget on year 2019
#     results_df=appraisal_df.loc[appraisal.total_appraised_value_2019<=budget,:]

#     #Read properties table and merge to results
    
#     top5results_df=pd.merge(results_df,properties_df,on="account")
    

#     #Read crime table and merge to results
#     crime_df=pd.read_sql_table('crime',engine)
#     crime_df=crime_df.rename(columns={'Zip_Code':'Zip_code'})
#     crime_aggr=crime_df.groupby(['Zip_code']).count()['Offense_Count']
#     crime_aggr_df=pd.DataFrame(crime_aggr)
#     top5results=pd.merge(top5results,crime_aggr_df,on="Zip_code")

#     #Read property_school table and merge to results
#     property_school_df=pd.read_sql_table('property_school',engine)
#     top5results=pd.merge(top5results,property_school_df,on="account")
    
#     #Read school table and merge to results
#     school_df=pd.read_sql_table('school',engine)
#     top5results=pd.merge(results_df,school_df,on=['school_id','school_type'])

#     #Read flood_zone table and merge to results
#     flood_zone_df=pd.read_sql_table('flood_zone',engine)
#     # results_df=pd.merge(results_df, flood_zone_df,on=['?','?'])TO DO ADD MERGING FIELDS
#     #TO DO Add flood ranking
#     #3- High Risk
#     #2 - Medium Risk
#     #1- Low Risk

#     top5results['flood_risk']=np.where(results_df['flood_description']=='AREA OF MINIMAL FLOOD HAZARD',1," ")
#     top5results.loc[(results_df['flood_description']=='0.2 PCT ANNUAL CHANCE FLOOD HAZARD'),'flood_risk']=2
#     top5results.loc[(results_df['flood_description']=='FLOODWAY'),'flood_risk']=3
#     top5results.loc[(results_df['flood_description']=='High-Risk Flood Zone'),'flood_risk']=3
#     # DO NOT DELETE THESE RESULTS FOR FINAL PULL
#         # del results_df['flood_description']
#         # del results_df['name']
#         # del results_df['address']
#         # del results_df['city']
#         # del results_df['zip_code']
#         # del results_df['district_id']
#         # del results_df['latitude']
#         # del results_df['longitude']

#     #Count the house sale per neighborhood in 2019 and merge results
#     sales2019=top5results_df.loc[top5results_df.new_owner_date>'2018-12-31']
#     top5results_df['sales2019']=np.where(top5results_df['new_owner_date']>'2018-12-31',1,0)
#     sales=top5results_df.groupby('neighborhood_code')['sales2019'].count()
#     sales=pd.DataFrame(sales)
#     sales=sales.rename(columns={'sales2019':'sales_neighborhood_2019'})
#     top5results_df=pd.merge(top5results_df,sales, on="neighborhood_code")
#     del top5results_df['sales2019']
#     print('computation completed')
#     return (top5results_df)  

# #Run function SQL_Pull
# SQL_Pull(100000)


# import necessary libraries
# import models
# from models import create_classes
import os
from flask import (
    Flask,
    render_template,
    jsonify,
    request,
    redirect)

import flask_sqlalchemy

#################################################
# Flask Setup
#################################################
app = Flask(__name__)

#################################################
# Database Setup
#################################################

from flask_sqlalchemy import SQLAlchemy
# app.config['SQLALCHEMY_DATABASE_URI'] = os.environ.get('DATABASE_URL', '') or "sqlite:///db.sqlite"

# # Remove tracking modifications
# app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

# db = SQLAlchemy(app)

# Pet = create_classes(db)

# create route that renders index.html template
@app.route("/")
def home():
    return render_template("index.html")

# # Query the database and send the jsonified results
# @app.route("/send", methods=["GET", "POST"])
# def send():
#     if request.method == "POST":
#         if (request.form["budget"] != Null)
#             max_budget = request.form["budget"]
#         else  max_budget = 1000000

#         if (request.form["sch_imp_all"] != Null)
#             imp_all_schools =["sch_imp_all"]
#         else   imp_all_schools = 10,

#         if (request.form["sch_imp_elem"] != Null)
#             imp_all_schools =["sch_imp_elem"]
#         else   imp_all_schools = 10,
        
#         if (request.form["sch_imp_elem"] != Null)
#             imp_all_schools =["sch_imp_elem"]
#         else   imp_all_schools = 10,


                        
        

#         imp_elem_schools = request.form["sch_imp_elem"]
#         imp_mid_schools = request.form["sch_imp_mid"]
#         imp_high_schools = request.form["sch_imp_high"]
#         imp_crime = request.form["crime_imp"]
#         imp_flood= request.form["flood_imp"]
#         imp_val_inc= request.form["val_inc_imp"]

#         pet = Pet(name=name, lat=lat, lon=lon)
#         db.session.add(pet)
#         db.session.commit()
#         return redirect("/", code=302)

#     return render_template("form.html")


# @app.route("/results")
# def pals():
#     results = db.session.query(Pet.name, Pet.lat, Pet.lon).all()

#     hover_text = [result[0] for result in results]
#     lat = [result[1] for result in results]
#     lon = [result[2] for result in results]

#     pet_data = [{
#         "type": "scattergeo",
#         "locationmode": "USA-states",
#         "lat": lat,
#         "lon": lon,
#         "text": hover_text,
#         "hoverinfo": "text",
#         "marker": {
#             "size": 50,
#             "line": {
#                 "color": "rgb(8,8,8)",
#                 "width": 1
#             },
#         }
#     }]

#     return jsonify(pet_data)


if __name__ == "__main__":
    app.run()
