def SQL_Pull(budget):
    # load dependencies
    import sqlalchemy
    from sqlalchemy.ext.automap import automap_base
    from sqlalchemy.orm import Session
    from sqlalchemy import create_engine, func, inspect,join
    import numpy as np
    import pandas as pd
    from flask import (Flask, render_template, jsonify, request, redirect)
    from flask_sqlalchemy import SQLAlchemy
    import psycopg2
    from key import URL

    # create heroku database connection with SQLAlchemy
    engine= create_engine(URL)
    conn = engine.connect()

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
    
    #Read properties table
    properties_df=pd.read_sql_table('properties',engine)
    results_df=pd.merge(results_df,properties_df,on="account")
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

    #Add flood ranking
    #3- High Risk
    #2 - Medium Risk
    #1- Low Risk
    results_df.loc[(results_df['flood_description']=='AREA OF MINIMAL FLOOD HAZARD'),'flood_risk']=1
    results_df.loc[(results_df['flood_description']=='0.2 PCT ANNUAL CHANCE FLOOD HAZARD'),'flood_risk']=2
    results_df.loc[(results_df['flood_description']=='FLOODWAY'),'flood_risk']=3
    results_df.loc[(results_df['flood_description']=='High-Risk Flood Zone'),'flood_risk']=3
    del results_df['flood_description']
    del results_df['name']
    del results_df['address']
    del results_df['city']
    del results_df['zip_code']
    del results_df['district_id']
    del results_df['latitude_y']
    del results_df['longitude_y']
    results_df=results_df.rename(columns={'latitude_x':'latitude', 'longitude_x':'longitude'})

    #Count the house sale per neighborhood in 2019 and merge results
    results_df['sales2019']=np.where(results_df['new_owner_date']>'2018-12-31',1,0)
    sales=results_df.groupby('neighborhood_code')['sales2019'].sum()
    sales=pd.DataFrame(sales)
    sales=sales.rename(columns={'sales2019':'sales_neighborhood_2019'})
    results_df=pd.merge(results_df,sales, on="neighborhood_code")
    del results_df['sales2019']
    
    #  Read the neighborhoods Table
    neighborhoods_df=pd.read_sql_table('neighborhoods',engine)
    results_df=pd.merge(results_df,neighborhoods_df,on='neighborhood_code')
    
    # Filter by budget on year 2019
    results_df=results_df.loc[results_df.total_appraised_value_2019<=budget,:]
    
    print('data pull complete')
    return (results_df) 

