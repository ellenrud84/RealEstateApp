# Group3_Project2
Our group created a Heroku-Postgres database based on our prior ETL activity under Adrianas ETL repository.

Python then processes the data further based on the users selected preferences to output a json file.
When a user accesses our website they see a map containing all the parameters that the program can investigate.
The user can view the boundaries and popup information of each of these parameters in a layer.
The user inputs their preferences for max budget and a relative ranking of how much they care about each of the input parameters
THe program then accesses the database and pulls only the data relevant to properties less than the users selected budget.
Then the program further processes this data based on the users other input preferences.

Finally the program outputs visualizations of the top 5 neighborhoods in the areas investigated for the user to consider investing in, 
based on the user's input preferences. 

While the data is processing from the user inputs and database pull all outputs are hidden and a progress bar is shown.  The duration of hte progress bar animation is
based on average load time for the program.

The visualizations consist of:
1) A map showing the top 5 nieghborhoods locations, with popups for more info about each neighborhood
2) A bar horizontal chart showing the total scores of each neighborhood based on the users inputs.  This chart shows more info when the user hovers over each bar.
3) An interactive bar chart, where the output is determined by the users choice in a dropdown menu.  The bars show more information when the user hovers over them.
4) A table showing the scores for each parameter of each of top 5 neighborhoods calculated from the database information and the users ranks of parameter preference.

The user can also access the raw json data from the api through a multi parameter or budget route.  The accessible API routes are listed when
the user clicks the "APIs" tag on the top navigation menu.
