# import dependency modules
import pull

def scores (dictionaryOfUserInput):
    
    
    w_budget = dictionaryOfUserInput["budget"]
    w_sales = dictionaryOfUserInput["sales"]
    w_crime = dictionaryOfUserInput["crime"]
    w_schools = dictionaryOfUserInput["schools"]
    w_acreage = dictionaryOfUserInput["acreage"]
    w_SQ_FT = dictionaryOfUserInput["sqft"]
    w_flood = dictionaryOfUserInput["flood"]
    w_change = dictionaryOfUserInput["change"]

    # call SQL_Pull function to query the database and create a dataframe
    df = pull.SQL_Pull(w_budget)
 
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

    # convert the score to percentage and scale them
    max=df["Score"].max()
    min=df["Score"].min()
    max=df["Score"]=(df["Score"]-min)/(max-min)*100

    # look at only the parameters of interest
    parameter_and_score = df[["Sales Index",'Crime Index', 'School Rating Index',
            'Acreage Index','SQ_FT Index', 'Flood Risk Index', 'Valuation Index','Score',
            'total_appraised_value_2019','neighborhood']]

    # group parameters by neighborhood name
    neighborhood_group = parameter_and_score.groupby(['neighborhood']).mean()

    # To get to the top list, neighnorhoods need positive valuation index and non-zero sales index
    neighborhood_group=neighborhood_group.loc[(neighborhood_group['Valuation Index']>0)&(neighborhood_group['Sales Index']>0),:]

    min=neighborhood_group['Valuation Index'].min()
    max=neighborhood_group['Valuation Index'].max()
    min=neighborhood_group['Valuation Index']=(neighborhood_group['Valuation Index']-min)/(max-min)*100

    # sort scores
    ranked_neighborhoods = neighborhood_group.sort_values('Score',ascending=False)

    top5neighborhoods = ranked_neighborhoods.head()
#     top5hoods= top5neighborhoods.to_json('top5hoods.html')
    
    return top5neighborhoods
