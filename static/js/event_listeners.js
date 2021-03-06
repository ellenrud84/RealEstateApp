///////////////////////////////////////////////////////////
// GLOBAL VARIABLES
///////////////////////////////////////////////////////////
let data,
    neighborhood,       
    sales,
    crime,
    school,
    acreage,
    sqft,
    flood,
    valuation,
    tableData,
    markers,
    tileLayerMap,
    myMap1,
    tableInfo;

///////////////////////////////////////////////////////////
// SCRIPT TO HANDLE USER SELECTED CRITERIA FROM HOME PAGE
///////////////////////////////////////////////////////////
// select the results button
const button = d3.select('#filter-btn');

// create an event handler for clicking the button or pressing the enter key
button.on('click', handleResultButtonSubmit);

window.addEventListener('keyup', function (event){
    if (event.defaultPrevented){
        return;
    }
    if (event.keyCode === 13){
        handleResultButtonSubmit();
    }
});

function handleResultButtonSubmit(){

    // change the class of of the #content1 html element to hide data
    document.getElementById('content1').classList.add('hideData');
    document.getElementById('content1').classList.remove('showData');


    // change the class of the results page to show data
    document.getElementById('content2').classList.add('showData')
    document.getElementById('content2').classList.remove('hideData');

    // get the value property of the each input
    const budgetSlider = document.getElementById('budget');
    const salesSlider = document.getElementById('salesWeight');
    const crimeSlider = document.getElementById('crimeWeight');
    const schoolSlider = document.getElementById('schoolWeight');
    const acreageSlider = document.getElementById('acreageWeight');
    const sqftSlider = document.getElementById('sqftWeight');
    const floodSlider = document.getElementById('floodWeight');
    const valuationSlider = document.getElementById('valueWeight');

    const w_budget = budgetSlider.value;
    const w_sales = salesSlider.value;
    const w_crime = crimeSlider.value;
    const w_schools = schoolSlider.value;
    const w_acreage = acreageSlider.value;
    const w_SQ_FT = sqftSlider.value;
    const w_flood = floodSlider.value;
    const w_change = valuationSlider.value;

    // call the function that will update the content of the page based on user's input
    return top5NeighborhoodsContent(w_budget,w_sales,w_crime,w_schools,w_acreage,w_SQ_FT,w_flood,w_change)
}

//////////////////////////////////////////////////////////////////
// FUNCTION TO PROVIDE RESULTS BASED ON USER'S SELECTION
//////////////////////////////////////////////////////////////////
function top5NeighborhoodsContent(w_budget,w_sales,w_crime,w_schools,w_acreage,w_SQ_FT,w_flood,w_change){
    d3.json(`/api/jsonData/${w_budget}/${w_sales}/${w_crime}/${w_schools}/${w_acreage}/${w_SQ_FT}/${w_flood}/${w_change}`)
    .then((response)=>{
        data = response;
        console.log(data)

        /////////////////////////////////////////
        // SUMMARY TABLE
        /////////////////////////////////////////

        // extract the data needed for the table
        neighborhood = Object.keys(data['latitude']);
        sales = Object.values(data['Sales Index']).map(item => Math.round(item));
        crime = Object.values(data['Crime Index']).map(item => Math.round(item));
        school = Object.values(data['School Rating Index']).map(item => Math.round(item));
        acreage = Object.values(data['Acreage Index']).map(item => Math.round(item));
        sqft = Object.values(data['SQ_FT Index']).map(item => Math.round(item));
        flood = Object.values(data['Flood Risk Index']).map(item => Math.round(item));
        valuation = Object.values(data['Valuation Index']).map(item => Math.round(item));
        residentialCounts = Object.values(data['Counts']).map(item => Math.round(item));
        scores = Object.values(data['Score']).map(item => Math.round(item));
        meanValue = Object.values(data['Mean Value 2019']).map(item => Math.round(item));
        pctValueChange = Object.values(data['pct_value_change']).map(item => Math.round(item,2));
        meanSQFT = Object.values(data['sq_ft']).map(item => Math.round(item));
        meanAcreage = Object.values(data['acreage']).map(item => item.toFixed(2));
        offenseCounts = Object.values(data['Offense_Count']).map(item => Math.round(item));

        // create an object with table data
        tableData = neighborhood.map((item,i)=>({
            neighborhood: item,
            num_Residences: residentialCounts[i],
            avg_value_2019: `$${meanValue[i]}`,
            pct_value_change: pctValueChange[i],
            avg_sq_ft: meanSQFT[i],
            avg_acreage: meanAcreage[i],
            school_index: school[i],
            flood_risk_index: flood[i],
            crime_offenses: offenseCounts[i],
            total_score: scores[i]
        }));
        // delete the table if it exists
        d3.selectAll('th').remove();
        d3.selectAll('tr').remove();

        // use d3 to select the table body
        const tbody = d3.select('#table');

        // add table headers
        const headers = Object.keys(tableData[0]);

        headers.forEach(item => {
            let columnHeader = tbody.append('th');
            columnHeader.classed('tableinfo', true);
            columnHeader.text(item);
        });

        // add data to the table
        const fullTable = tableData.forEach(neighborhood => {
            let row = tbody.append('tr');
            Object.values(neighborhood).forEach(info => {
                let cell = row.append('td');
                cell.classed('tableinfo', true);
                cell.text(info);
            })
            
        });

        ///////////////////////////////////////////////////
        // SUMMARY MAP - TOP 5 NEIGHBORHOODS
        ///////////////////////////////////////////////////
        // Remove map object if it exists
        if(myMap1){myMap1.remove()};

        myMap1 = L.map("map_hou_top_5", {
            center: [29.74, -95.367497],
            zoom: 11
        });
        
        // Adding tile layer to the map
        tileLayerMap = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
            attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
            tileSize: 512,
            maxZoom: 18,
            zoomOffset: -1,
            id: "mapbox/streets-v11",
            accessToken: API_KEY
        }).addTo(myMap1)
        
        // create an object with info per neighborhood
        const latitudes = Object.values(data['latitude']);
        const longitudes = Object.values(data['longitude']);

        const neighborhoodData = neighborhood.map((item,i)=>({
            neighborhoodName: item, 
            location: [latitudes[i],longitudes[i]],
            score: scores[i],
        }));

        // clear existing markers before adding new ones
        if(!markers == null){markers.clearLayers()};

        // loop through the neighborhood object and plot each item on the map
        neighborhoodData.forEach(hood =>{
            markers = L.marker(hood.location);
            markers.bindPopup("<h7>"+hood.neighborhoodName+"</h7><br><h8>Total Score: "+hood.score+"</h8>")
            .addTo(myMap1)
        })

        ////////////////////////////////////////////////
        // HORIZONTAL BAR CHART
        // NEIGHBORHOOD RANKING BASED ON TOTAL SCORE
        ////////////////////////////////////////////////

        // create a horizontal bar chart with average score per neighborhood
        const coordinates = neighborhoodData.map(item => [item.score, item.neighborhoodName]);
        const sorted = coordinates.sort((a,z)=> a[0]- z[0]);
        const selectedBudget = document.getElementById('budget').value;

        // create a trace object with x as the score and y as the neighborhood name
        const NeighborhoodTrace = {
            type: 'bar',
            x: sorted.map(item => item[0]),
            y: sorted.map(item => item[1]),
            orientation: 'h'
        }
        // define layout
        const layout = {
            title: `Top Five Neighborhoods For $${selectedBudget} Budget`,
            yaxis: {
                automargin: true,
                rangemode: 'tozero'
            },
            xaxis: {
                rangemode: 'tozero',
                title: 'Total Score'
            }
        }
        Plotly.newPlot('hbarPlotTopScores', [NeighborhoodTrace], layout);

        /////////////////////////////////////////////
        // INTERACTIVE BAR CHART
        /////////////////////////////////////////////
        // remove neigborhoods from the dropdown menu before adding new ones
        d3.selectAll('.hoodMenu').remove();

        // add neighborhoods to the dropdown menu
        const dropDownMenu = d3.select('#parameters')

        neighborhood.forEach(hood => {
            const option = dropDownMenu.append('option');
            option.text(`${hood}`);
            option.classed('hoodMenu', true);
            option.attr('value',`${hood}`);
        });

        // create a bar chart to show all parameter per neighborhood
        const salesIndexTrace = {
            x: neighborhood,
            y: sales,
            name: 'Sales Index',
            type: 'bar'
        };
        const crimeIndexTrace = {
            x: neighborhood,
            y: crime,
            name: 'Crime Index',
            type: 'bar'
        };
        const schoolRatingTrace = {
            x: neighborhood,
            y: school,
            name: 'School Rating',
            type: 'bar'
        };
        const acreageIndexTrace = {
            x: neighborhood,
            y: acreage,
            name: 'Acreage Index',
            type: 'bar'
        };
        const sqftIndexTrace = {
            x: neighborhood,
            y: sqft,
            name: 'SQFT Index',
            type: 'bar'
        };
        const floodIndexTrace = {
            x: neighborhood,
            y: flood,
            name: 'Flood Index',
            type: 'bar'
        };
        const valueChangeIndexTrace = {
            x: neighborhood,
            y: valuation,
            name: 'Value Change Index',
            type: 'bar'
        };

        const parametersTrace = [salesIndexTrace, 
                        crimeIndexTrace, 
                        schoolRatingTrace,
                        acreageIndexTrace,
                        sqftIndexTrace,
                        floodIndexTrace,
                        valueChangeIndexTrace,
                    ];

        const groupLayout = {
            barmode: 'group',
            xaxis: {
                tickangle: 10
            },
            yaxis:{
                title: 'Index'
            },
            margin:{
                b: 100,
                r: 200,
            }
        };
        Plotly.newPlot('barPlotParameter', parametersTrace, groupLayout);
    });  
};
//////////////////////////////////////////////////////////
// UPDATE INTERACTIVE BAR CHART PER USER SELECTION
//////////////////////////////////////////////////////////

// Function to change bar chart parameters based on user selection    
function chooseParameter (parameter){
    switch(parameter){
        case "SaleIndex":
            return sales;
        case "CrimeIndex":
            return crime;
        case "SchoolRating":
            return school;
        case "AcreageIndex":
            return acreage;
        case "SQFTIndex":
            return sqft;
        case "FloodIndex":
            return flood;
        default:
            return valuation;
    }
};

// Event handler to update interactive bar chart based on user selection
function handleBarChartSubmit(){
    // use D3 to select the dropdown menu
    const dropdownMenu = d3.select('#parameters');

    // Assign the value of the dropdown menu option to a variable
    const parameter = dropdownMenu.property('value');

    // build a plot with the new subject
    updateInteractiveBarChart(parameter);
}

function updateInteractiveBarChart(parameter){
    // array of available parameters to chose from
    const parametersArr = [
        "SalesIndex",
        "CrimeIndex",
        "SchoolRating",
        "AcreageIndex",
        "SQFTIndex",
        "FloodIndex",
        "ValueChangeIndex"
    ];

    // array of available neighborhoods
    const neighborhoodsArr = neighborhood;

    const parameterSelected = parameter;

    if(parametersArr.includes(parameterSelected)){
    // create a trace object with x as the neighborhood and y as the userSelected parameter
    const ParameterTrace = {
        type: 'bar',
        x: neighborhoodsArr,
        y: chooseParameter(parameterSelected)
    }
    // define layout
    const parameterLayout = {
        title: "Top 5 Neighborhoods",
        yaxis: {
            automargin: true,
            rangemode: 'tozero',
            title: parameterSelected
        },
        xaxis: {
            rangemode: 'tozero',
            tickangle: 10
        },
        margin:{
            b: 100,
            r: 200
        }
    }
        Plotly.newPlot('barPlotParameter', [ParameterTrace], parameterLayout);
    }
    else if(neighborhoodsArr.includes(parameterSelected)){
        // create an object with table data
        const graphData = neighborhood.map((item,i)=>({
            neighborhood: item, 
            sales: sales[i],
            crime: crime[i],
            school: school[i],
            acreage: acreage[i],
            sqft: sqft[i],
            flood: flood[i],
            valuation: valuation[i],
            num_Residences: residentialCounts[i],
            score: scores[i]
        }));

        // filter data by neighborhood selected
        const neighborhoodData = graphData.filter(item => item.neighborhood == parameterSelected);

        const x =  ["Sales","Crime","School Rating","Acreage",
                    "SQFT","Flood","Value Change"];

        const y = [
            neighborhoodData[0]['sales'],
            neighborhoodData[0]['crime'],
            neighborhoodData[0]['school'],
            neighborhoodData[0]['acreage'],
            neighborhoodData[0]['sqft'],
            neighborhoodData[0]['flood'],
            neighborhoodData[0]['valuation']
        ];
        const neighborhoodTrace = {
            x: x,
            y: y,
            type: 'bar'
        };

        const neighborhoodLayout = {
            title: `${parameterSelected}`,
            xaxis:{
                tickangle: 10
            },
            yaxis:{
                title: 'Index'
            }
        };

        Plotly.newPlot('barPlotParameter', [neighborhoodTrace], neighborhoodLayout);
    }
    else {
    // create a bar chart to show all parameter per neighborhood
    const salesIndexTrace2 = {
        x: neighborhood,
        y: sales,
        name: 'Sales Index',
        type: 'bar'
    };
    const crimeIndexTrace2 = {
        x: neighborhood,
        y: crime,
        name: 'Crime Index',
        type: 'bar'
    };
    const schoolRatingTrace2 = {
        x: neighborhood,
        y: school,
        name: 'School Rating',
        type: 'bar'
    };
    const acreageIndexTrace2 = {
        x: neighborhood,
        y: acreage,
        name: 'Acreage Index',
        type: 'bar'
    };
    const sqftIndexTrace2 = {
        x: neighborhood,
        y: sqft,
        name: 'SQFT Index',
        type: 'bar'
    };
    const floodIndexTrace2 = {
        x: neighborhood,
        y: flood,
        name: 'Flood Index',
        type: 'bar'
    };
    const valueChangeIndexTrace2 = {
        x: neighborhood,
        y: valuation,
        name: 'Value Change Index',
        type: 'bar'
    };

    const parametersTrace2 = [salesIndexTrace2, 
                    crimeIndexTrace2, 
                    schoolRatingTrace2,
                    acreageIndexTrace2,
                    sqftIndexTrace2,
                    floodIndexTrace2,
                    valueChangeIndexTrace2,
                ];

    const groupLayout = {
        barmode: 'group',
        xaxis: {
            tickangle: 10
        },
        yaxis:{
            title: 'Index'
        },
        margin:{
            b: 100,
            r: 200
        }
    };
    Plotly.newPlot('barPlotParameter', parametersTrace2, groupLayout);
    }
};