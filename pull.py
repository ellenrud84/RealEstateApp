# load dependencies
import sqlalchemy
from sqlalchemy.ext.automap import automap_base
from sqlalchemy.orm import Session
from sqlalchemy import create_engine, func, inspect,join
import numpy as np
import pandas as pd

def SQL_Pull(budget):
    engine= create_engine("postgres://wtzcxlhtevtgnn:a611ddfea80402e93d32df58dad93c3dfe320544d635b77e14e9bb8936eeca9e@ec2-52-86-116-94.compute-1.amazonaws.com:5432/d5hl5ab4698nnc")
    Base= automap_base()
    Base.prepare(engine, reflect=True)
    
    appraisal=Base.classes.appraisal
    properties=Base.classes.properties
    crime=Base.classes.crime
    zip_code=Base.classes.zip_code
    flood_zone=Base.classes.flood_zone
    neighborhoods=Base.classes.neighborhoods
    # property_school=Base.classes.property_school
    school_district=Base.classes.school_district
    school=Base.classes.school
    session=Session(bind=engine)
    
    sel=[appraisal.id,appraisal.account,appraisal.land_value,appraisal.total_appraised_value,appraisal.total_market_value,appraisal.tax_year,\
      properties.latitude, properties.longitude, properties.Zip_code, properties.neighborhood_code,properties.acreage,\
      properties.new_owner_date, properties.sq_ft, properties.flood_description,\
      neighborhoods.neighborhood]

    appraisal_df=session.query(*sel).\
            select_from(join(join(appraisal, properties, appraisal.account==properties.account),neighborhoods,\
                           properties.neighborhood_code== neighborhoods.neighborhood_code)).\
            filter(appraisal.total_appraised_value<=budget).\
            filter(properties.sq_ft<9000).\
            all()

    appraisal_df=pd.DataFrame(appraisal_df)
    
     # Calculate % of change of value between 2018 and 2019
    appraisal_2018=appraisal_df.loc[appraisal_df.tax_year==2018,:]
    appraisal_2019=appraisal_df.loc[appraisal_df.tax_year==2019,:]
    appraisal_df=pd.merge(appraisal_2019,appraisal_2018,on='account', suffixes=('_2019','_2018'))
    appraisal_df['pct_value_change']=(appraisal_df['total_appraised_value_2019']-appraisal_df['total_appraised_value_2018'])\
                                  /appraisal_df['total_appraised_value_2018']*100
    results_df=appraisal_df[['id_2019','account','total_appraised_value_2019', 'pct_value_change','latitude_2019',\
                            'longitude_2019','acreage_2019','Zip_code_2019','neighborhood_code_2019','sq_ft_2019','neighborhood_2019', 'new_owner_date_2019',\
                             'flood_description_2019']]
    results_df=results_df.rename(columns={'id_2019':'id', 'latitude_2019':'latitude','longitude_2019':'longitude',\
                                     'Zip_code_2019':'zip_code','neighborhood_code_2019':'neighborhood_code',\
                                      'sq_ft_2019':'sq_ft','neighborhood_2019':'neighborhood','acreage_2019':'acreage',\
                                       'flood_description_2019':'flood_description','new_owner_date_2019':'new_owner_date'})
    sel=[crime.Zip_Code, func.count(crime.Offense_Count)]
    crime_df=session.query(*sel).select_from(crime).group_by(crime.Zip_Code).all()
    # crime_df=pd.DataFrame(crime_df)
    crime_df=pd.DataFrame(crime_df,columns=['zip_code','Offense_Count'])
    crime_df.head()
    results_df=pd.merge(results_df,crime_df,on="zip_code")
    
    #Read property_school table and merge to results
    property_school_df=pd.read_sql_table('property_school',engine)
    results_df=pd.merge(results_df,property_school_df,on="account")

    #Read school table and merge to results
    school_df=pd.read_sql_table('school',engine)
    results_df=pd.merge(results_df,school_df,on=['school_id','school_type'])

    #Add flood ranking#3- High Risk
    #2 - Medium Risk
    #1- Low Risk
    results_df['flood_risk']=np.where(results_df['flood_description']=='AREA OF MINIMAL FLOOD HAZARD',1,3)
    results_df.loc[(results_df['flood_description']=='0.2 PCT ANNUAL CHANCE FLOOD HAZARD'),'flood_risk']=2
    results_df.loc[(results_df['flood_description']=='FLOODWAY'),'flood_risk']=3
    del results_df['name']
    del results_df['address']
    del results_df['city']
    del results_df['zip_code_y']
    del results_df['district_id']
    del results_df['latitude_y']
    del results_df['longitude_y']
    del results_df['flood_description']
    results_df=results_df.rename(columns={'latitude_x':'latitude', 'longitude_x':'longitude', 'zip_code_x':'zip_code'})
    
    #Count the house sale per neighborhood in 2019 and merge results
    results_df=results_df.loc[results_df['account']!=530420000012,:]
    results_df['new_owner_date']=pd.to_datetime(results_df['new_owner_date'])
    results_df['sales2019']=np.where(results_df['new_owner_date']>'2018-12-31',1,0)
    sales=results_df.groupby('neighborhood_code')['sales2019'].sum()
    sales=pd.DataFrame(sales)
    sales=sales.rename(columns={'sales2019':'sales_neighborhood_2019'})
    results_df=pd.merge(results_df,sales, on="neighborhood_code")
    del results_df['sales2019']
    
    results_df['total_appraised_value_2019']=results_df['total_appraised_value_2019'].astype(float)
    results_df['pct_value_change']=results_df['pct_value_change'].astype(float)
    results_df['latitude']=results_df['latitude'].astype(float)
    results_df['longitude']=results_df['longitude'].astype(float)
    results_df['acreage']=results_df['acreage'].astype(float)
    results_df['neighborhood_code']=results_df['neighborhood_code'].astype(float)
    results_df['sq_ft']=results_df['sq_ft'].astype(float)
    
    print('data pull complete')
    results_df.to_csv('results.csv')
    return (results_df)