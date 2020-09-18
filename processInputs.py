# Dependencies
import pandas as pd
from pull import SQL_Pull
import plotly


def scores (dictionaryOfUserInput):
    
    
    w_budget = dictionaryOfUserInput["budget"]
    w_sales = dictionaryOfUserInput["salesWeight"]
    w_crime = dictionaryOfUserInput["crimeWeight"]
    w_schools = dictionaryOfUserInput["schoolWeight"]
    w_acreage = dictionaryOfUserInput["acreageWeight"]
    w_SQ_FT = dictionaryOfUserInput["sqftWeight"]
    w_flood = dictionaryOfUserInput["floodWeight"]
    w_change = dictionaryOfUserInput["changeValueWeight"]

    # call SQL_Pull function to query the database and create a dataframe
    df = SQL_Pull(w_budget)

    # Normalize data for each parameter
    max=df['sales_neighborhood_2019'].max()
    min=df['sales_neighborhood_2019'].min()
    df["Sales Index"]=(df['sales_neighborhood_2019']-min)/(max-min)*100

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

     # look at only the parameters of interest
    parameter_and_score = df[['latitude','longitude', 'pct_value_change',
        'acreage','sq_ft','Offense_Count','Sales Index','Crime Index','School Rating Index',
        'Acreage Index','SQ_FT Index', 'Flood Risk Index', 'Valuation Index','Score',
        'total_appraised_value_2019','neighborhood']]

    # group parameters by neighborhood name
    neighborhood_group = parameter_and_score.groupby(['neighborhood']).mean()
    
    # add count of residences per neighborhood
    residence_count = parameter_and_score.groupby(["neighborhood"]).count()
    renamed_count = residence_count.rename(columns = {"latitude":"Counts"})
    single_column_counts = renamed_count["Counts"]

    # merge the counts to the neighborhood group
    neighborhood_group_with_counts = neighborhood_group.merge(single_column_counts,how='inner',on='neighborhood')

    # To get to the top list, neighborhoods need positive valuation index and non-zero sales index
    neighborhood_group_with_counts=neighborhood_group_with_counts.loc[(neighborhood_group_with_counts['Valuation Index']>0)&(neighborhood_group_with_counts['Sales Index']>0)&(neighborhood_group_with_counts['Score']>0),:]

    min=neighborhood_group_with_counts['Valuation Index'].min()
    max=neighborhood_group_with_counts['Valuation Index'].max()
    neighborhood_group_with_counts['Valuation Index']=(neighborhood_group_with_counts['Valuation Index']-min)/(max-min)*100

    min=neighborhood_group_with_counts['Score'].min()
    max=neighborhood_group_with_counts['Score'].max()
    neighborhood_group_with_counts['Score']=(neighborhood_group_with_counts['Score']-min)/(max-min)*100                                                                                                                        

    min=neighborhood_group_with_counts['Sales Index'].min()
    max=neighborhood_group_with_counts['Sales Index'].max()
    neighborhood_group_with_counts['Sales Index']=(neighborhood_group_with_counts['Sales Index']-min)/(max-min)*100 

    min=neighborhood_group_with_counts['Crime Index'].min()
    max=neighborhood_group_with_counts['Crime Index'].max()
    neighborhood_group_with_counts['Crime Index']=(neighborhood_group_with_counts['Crime Index']-min)/(max-min)*100   

    min=neighborhood_group_with_counts['School Rating Index'].min()
    max=neighborhood_group_with_counts['School Rating Index'].max()
    neighborhood_group_with_counts['School Rating Index']=(neighborhood_group_with_counts['School Rating Index']-min)/(max-min)*100

    min=neighborhood_group_with_counts['Acreage Index'].min()
    max=neighborhood_group_with_counts['Acreage Index'].max()
    neighborhood_group_with_counts['Acreage Index']=(neighborhood_group_with_counts['Acreage Index']-min)/(max-min)*100 

    min=neighborhood_group_with_counts['SQ_FT Index'].min()
    max=neighborhood_group_with_counts['SQ_FT Index'].max()
    neighborhood_group_with_counts['SQ_FT Index']=(neighborhood_group_with_counts['SQ_FT Index']-min)/(max-min)*100                                                                                                                          

    min=neighborhood_group_with_counts['Flood Risk Index'].min()
    max=neighborhood_group_with_counts['Flood Risk Index'].max()
    neighborhood_group_with_counts['Flood Risk Index']=(neighborhood_group_with_counts['Flood Risk Index']-min)/(max-min)*100   

    neighborhood_group_with_counts=neighborhood_group_with_counts.rename(columns={"total_appraised_value_2019":"Mean Value 2019"})                                                                                                                  

    # sort scores
    ranked_neighborhoods = neighborhood_group_with_counts.sort_values('Score',ascending=False)
    top5neighborhoods= ranked_neighborhoods.head()

    return top5neighborhoods 