from models import create_classes
import os
from flask import (
    Flask,
    render_template,
    jsonify,
    request,
    redirect)

from flask_sqlalchemy import SQLAlchemy

#################################################
# Flask Setup
#################################################
app = Flask(__name__)

#################################################
# Database Setup
#################################################
 ########################################################################
 # ELLENS PART- FLASK APP GET AND DEPLOY
 # ########################################################   

# create route that renders index.html template
@app.route("/", methods=["GET", "POST"]))
# def handle_neighborhoods():
#     if request.method =='POST'
#      # if (request.form["budget"] != Null)
#         #     max_budget = request.form["budget"]
#         # else  max_budget = 1000000

#         # if (request.form["sch_imp_all"] != Null)
#         #     imp_all_schools =["sch_imp_all"]
#         # else   imp_all_schools = 10,

#         # if (request.form["sch_imp_elem"] != Null)
#         #     imp_all_schools =["sch_imp_elem"]
#         # else   imp_all_schools = 10,
        
#         # if (request.form["sch_imp_elem"] != Null)
#         #     imp_all_schools =["sch_imp
#     # results= ranked_neighborhoods
#     # return render_template("index.html", results = results)
  
# # Query the database and send the jsonified results

def send():
    if request.method == "GET":
        if request.is_json:
            data=request.get_json()
       
        # else   imp_all_schools = 10,
# ##########################################################


# url for heroku database
URL= 'postgres://wtzcxlhtevtgnn:a611ddfea80402e93d32df58dad93c3dfe320544d635b77e14e9bb8936eeca9e@ec2-52-86-116-94.compute-1.amazonaws.com:5432/d5hl5ab4698nnc'
app.config['SQLALCHEMY_DATABASE_URI'] = os.environ.get(URL) 
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db= SQLAlchemy(app)
migrate = Migrate(app, db)
# # Remove tracking modifications




def SQL_Pull(budget):
    #Import Dependencies
    import sqlalchemy
    from sqlalchemy.ext.automap import automap_base
    from sqlalchemy.orm import Session
    from sqlalchemy import create_engine, func, inspect,join
    from key import url
    import numpy as np
    import pandas as pd

    #Connect to PostgreSQL
    #Create the engine
    engine = create_engine(URL)

    # reflect an existing database into a new model
    Base = automap_base()

    # reflect the tables
    Base.prepare(engine, reflect=True)
    session=Session(engine)

    #Using Pandas for Data Analysis
    #  Read the appraisal Table
    appraisal=pd.read_sql_table('appraisal',engine)

    # Calculate % of change of value between 2018 and 2019
    appraisal_2018=appraisal.loc[appraisal.tax_year==2018,:]
    appraisal_2019=appraisal.loc[appraisal.tax_year==2019,:]
    appraisal_df=pd.merge(appraisal_2019,appraisal_2018,on='account', suffixes=('_2019','_2018'))
    appraisal_df['pct_value_change']=(appraisal_df['total_appraised_value_2019']-appraisal_df['total_appraised_value_2018'])\
                                  /appraisal_df['total_appraised_value_2018']*100
    results_df=appraisal_df[['id_2019','account','total_appraised_value_2019', 'pct_value_change']]
    results_df=results_df.rename(columns={'id_2019':'id'})

    # Filter by budget on year 2019
    results_df=results_df.loc[results_df.total_appraised_value_2019<=budget,:]

    #Read properties table and merge to results
    properties_df=pd.read_sql_table('properties',engine)
    results_df=pd.merge(results_df,properties_df,on="account")
    del results_df['latitude']
    del results_df['longitude']
    del results_df['address']

    #Read crime table and merge to results
    crime_df=pd.read_sql_table('crime',engine)
    crime_df=crime_df.rename(columns={'Zip_Code':'Zip_code'})
    crime_aggr=crime_df.groupby(['Zip_code']).count()['Offense_Count']
    crime_aggr_df=pd.DataFrame(crime_aggr)
    results_df=pd.merge(results_df,crime_aggr_df,on="Zip_code")

    #Read property_school table and merge to results
    property_school_df=pd.read_sql_table('property_school',engine)
    results_df=pd.merge(results_df,property_school_df,on="account")
    
    #Read school table and merge to results
    school_df=pd.read_sql_table('school',engine)
    results_df=pd.merge(results_df,school_df,on=['school_id','school_type'])

    #Read flood_zone table and merge to results
    # flood_zone_df=pd.read_sql_table('flood_zone',engine)
    #Add flood ranking
    #3- High Risk
    #2 - Medium Risk
    #1- Low Risk
    results_df['flood_risk']=np.where(results_df['flood_description']=='AREA OF MINIMAL FLOOD HAZARD',1," ")
    results_df.loc[(results_df['flood_description']=='0.2 PCT ANNUAL CHANCE FLOOD HAZARD'),'flood_risk']=2
    results_df.loc[(results_df['flood_description']=='FLOODWAY'),'flood_risk']=3
    results_df.loc[(results_df['flood_description']=='High-Risk Flood Zone'),'flood_risk']=3
    del results_df['flood_description']
    del results_df['name']
    del results_df['address']
    del results_df['city']
    del results_df['zip_code']
    del results_df['district_id']
    del results_df['latitude']
    del results_df['longitude']

    #Count the house sale per neighborhood in 2019 and merge results
    sales2019=results_df.loc[results_df.new_owner_date>'2018-12-31']
    results_df['sales2019']=np.where(results_df['new_owner_date']>'2018-12-31',1,0)
    sales=results_df.groupby('neighborhood_code')['sales2019'].count()
    sales=pd.DataFrame(sales)
    sales=sales.rename(columns={'sales2019':'sales_neighborhood_2019'})
    results_df=pd.merge(results_df,sales, on="neighborhood_code")
    del results_df['sales2019']
    print('computation completed')
return (results_df)  

# #Run function SQL_Pull--- we do this later
output= SQL_Pull(100000) 


# Jonathans module:  takes Javascript object of user prefs or defaults
def scores (dictionaryOfUserInput):
    budget = dictionaryOfUserInput[budget]
    w_sales = dictionaryOfUserInput[sales]
    w_crime = dictionaryOfUserInput[crime]
    w_schools = dictionaryOfUserInput[schools]
    w_acreage = dictionaryOfUserInput[acreage]
    w_SQ_FT = dictionaryOfUserInput[sqft]
    w_flood = dictionaryOfUserInput[Flood]
    w_change = dictionaryOfUserInput[change]

# call SQL_Pull function to query the database and create a dataframe
df = SQL_Pull(budget)

# Normalize data for each parameter
max=df['Offense_Count'].max()
min=df['Offense_Count'].min()
df["Crime Index"]=(df['Offense_Count']-min)/(max-min)*100

max=df['school_rating'].max()
min=df['school_rating'].min()
df["School Rating Index"]=(df['school_rating']-min)/(max-min)*100

max=df['acreage'].max()
min=df['acreage'].min()
df["Acreage Index"]=(df['acreage']-min)/(max-min)*100

max=df['sq_ft'].max()
min=df['sq_ft'].min()
df["SQ_FT Index"]=(df['sq_ft']-min)/(max-min)*100

max=df['flood_risk'].max()
min=df['flood_risk'].min()
df["Flood Risk Index"]=(df['flood_risk']-min)/(max-min)*100


max=df['pct_value_change'].max()
df['Valuation Index']=df['pct_value_change']/max*100

# Calculate scores for each address.
total_weights=w_sales+w_crime+w_schools+w_acreage+w_SQ_FT+w_flood+w_change

# Add calculated scores to the dataframe
df["Sales Index_W"]=w_sales*df['Sales Index']
df['Crime Index_W']= w_crime*df['Crime Index']
df["School Rating Index_W"]=w_schools*df['School Rating Index']
df["Acreage Index_W"]= w_acreage*df['Acreage Index']
df["SQ_FT_Index_W"]= w_SQ_FT*df['SQ_FT Index']
df["Flood Risk Index_W"]=w_flood*df['Flood Risk Index']
df['Valuation Index_W']= w_change*df['Valuation Index']

# Calculate total score per row
df["Score"]=round((w_sales*df['Sales Index']-
                                   w_crime*df['Crime Index']+
                                   w_schools*df['School Rating Index']+
                                   w_acreage*df['Acreage Index']+
                                   w_SQ_FT*df['SQ_FT Index']-
                                   w_flood*df['Flood Risk Index']+
                                   w_change*df['Valuation Index'])/total_weights,2)

# convert the score to percentage and scale them
max=df["Score"].max()
min=df["Score"].min()
max=df["Score"]=(df["Score"]-min)/(max-min)*100

# look at only the parameters of interest
parameter_and_score = homes_less_than_1M[["Sales Index",'Crime Index', 'School Rating Index',
         'Acreage Index','SQ_FT Index', 'Flood Risk Index', 'Valuation Index','Score',
         'TOTAL_APPRAISED_VALUE_2019','NEIGHBORHOOD']]

# group parameters by neighborhood name
neighborhood_group = parameter_and_score.groupby(["NEIGHBORHOOD"]).mean()

# To get to the top list, neighnorhoods need positive valuation index and non-zero sales index
neighborhood_group=neighborhood_group.loc[(neighborhood_group['Valuation Index']>0)&(neighborhood_group['Sales Index']>0),:]

min=neighborhood_group['Valuation Index'].min()
max=neighborhood_group['Valuation Index'].max()
min=neighborhood_group['Valuation Index']=(neighborhood_group['Valuation Index']-min)/(max-min)*100

# sort scores
ranked_neighborhoods = neighborhood_group.sort_values('Score',ascending=False)

return top5neighborhoods= ranked_neighborhoods.head()
    top5neighborhoods.to_json('top5hoods.json')




                        
        

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
