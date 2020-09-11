
///////////////////////////////////////////////////////////
// SCRIPT TO HANDLE USER SELECTED CRITERIA FROM HOME PAGE
///////////////////////////////////////////////////////////

// create a tbody variable to get a handle on the html element
const tbody = d3.select('tbody');

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
    // get the value property of the each input
    const inputBudget = d3.select('#budget').property('value');
    const inputSalesWeight = d3.select('#salesWeight').property('value');
    const inputCrimeWeight = d3.select('#crimeWeight').property('value');
    const inputSchoolWeight = d3.select('#schoolWeight').property('value');
    const inputAcreageWeight = d3.select('#acreageWeight').property('value');
    const inputSQFTWeight = d3.select('#sqftWeight').property('value');
    const inputFloodWeight = d3.select('#floodWeight').property('value');
    const inputValueChangeWeight = d3.select('#changeValueWeight').property('value');

    // create an empty object to hold the user input
    let weightCriteriaProvided = {};

    // check if input criteria was provided and add to weightCriteria object
    if (!(inputBudget == "")){weightCriteriaProvided.budget = inputBudget;}
        else{weightCriteriaProvided.budget = 1000000;} // default value
    if (!(inputSalesWeight == "")){weightCriteriaProvided.salesWeight = inputSalesWeight;}
        else{weightCriteriaProvided.salesWeight = 5;} // default value
    if (!(inputCrimeWeight == "")){weightCriteriaProvided.crimeWeight = inputCrimeWeight;}
        else{weightCriteriaProvided.crimeWeight = 5;} // default value
    if (!(inputSchoolWeight == "")){weightCriteriaProvided.schoolWeight = inputSchoolWeight;}
        else{weightCriteriaProvided.schoolWeight = 5;} // default value
    if (!(inputAcreageWeight == "")){weightCriteriaProvided.acreageWeight = inputAcreageWeight;}
        else{weightCriteriaProvided.acreageWeight = 5;} // default value
    if (!(inputSQFTWeight == "")){weightCriteriaProvided.SQFTWeight = inputSQFTWeight;}
        else{weightCriteriaProvided.SQFTWeight = 5;} // default value
    if (!(inputFloodWeight == "")){weightCriteriaProvided.floodWeight = inputFloodWeight;}
        else{weightCriteriaProvided.floodWeight = 5;} // default value
    if (!(inputValueChangeWeight == "")){weightCriteriaProvided.ValueChangeWeight = inputValueChangeWeight;}
        else{weightCriteriaProvided.ValueChangeWeight = 5;} // default value
    
    // call the function that will update the content of the page based on user's input
    top5NeighborhoodsContent(weightCriteriaProvided)
}

//////////////////////////////////////////////////////////////////
// FUNCTION TO PROVIDE RESULTS BASED ON USER'S SELECTION
//////////////////////////////////////////////////////////////////
function top5NeighborhoodsContent(weightCriteriaProvided){
    const baseURL= 'https://ellenrud84-real-estate-app.herokuapp.com'
    const api_url= "/api/jsonData/"
    url='/api/jsonData/{"budget":1000000, "salesWeight":5, "crimeWeight":5, "schoolWeight":5, "acreageWeight":5, "sqftWeight":5,"floodWeight":5, "changeValueWeight":5}'
    // console.log(url)
    d3.json(`${api_url}${weightCriteriaProvided}`).then((response)=>{
        const data = response;
        console.log(data);
    })
}

//         /////////////////////////////////////////
//         // SUMMARY TABLE
//         /////////////////////////////////////////

//         // extract the data needed for the table
//         const neighborhood = data.map(entry=> entry.Neighborhood);
//         const sales = data.map(entry=> entry.SalesIndex);
//         const crime = data.map(entry=> entry.CrimeIndex);
//         const school = data.map(entry=> entry.SchoolRating);
//         const acreage = data.map(entry=> entry.AcreageIndex);
//         const sqft = data.map(entry=> entry.SQFTIndex);
//         const flood = data.map(entry=> entry.FloodIndex);
//         const valuation = data.map(entry=> entry.ValueChangeIndex);

//         // create an object with table data
//         const tableData = neighborhood.map((item,i)=>({
//             neighborhood: item, 
//             sales: sales[i],
//             crime: crime[i],
//             school: school[i],
//             acreage: acreage[i],
//             sqft: sqft[i],
//             flood: flood[i],
//             valuation: valuation[i]
//         }));

//         // use d3 to select the table body
//         const tbody = d3.select('tbody');

//         console.log('Neighborhood Data:')
//         console.log(tableData);

//         // add code to delete an existing table before adding the new one
//         // add data to the table
//         const fullTable = tableData.forEach(neighborhood => {
//             let row = tbody.append('tr');
//             Object.values(neighborhood).forEach(info => {
//                 let cell = row.append('td');
//                 cell.text(info);
//             })
            
//         });
//         ///////////////////////////////////////////////////
//         // SUMMARY MAP - TOP 5 NEIGHBORHOODS
//         ///////////////////////////////////////////////////

//         // add a map showing houston's top 5 neighborhoods
//         // Creating map object
//         const myMap1 = L.map("map_hou_top_5", {
//             center: [29.76, -95.37],
//             zoom: 11
//         });
        
//         // Adding tile layer to the map
//         L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
//             attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
//             tileSize: 512,
//             maxZoom: 18,
//             zoomOffset: -1,
//             id: "mapbox/streets-v11",
//             accessToken: API_KEY
//         }).addTo(myMap1)
        
//         // add marker to each neighborhood and popup with info
//         data.forEach(item => {
//             L.marker([item.Latitude, item.Longitude])
//             .bindPopup("<h1>"+item.Neighborhood+"</h1> <h3>Total Score: "+item.TotalScore+"</h3")
//             .addTo(myMap1)
//         });   
    
//         ////////////////////////////////////////////////
//         // HORIZONTAL BAR CHART
//         // NEIGHBORHOOD RANKING BASED ON TOTAL SCORE
//         ////////////////////////////////////////////////

//         // create a horizontal bar chart with average score per neighborhood
//         const coordinates = data.map(item => [item.TotalScore, item.Neighborhood]);
//         const sorted = coordinates.sort((a,z)=> a[0]- z[0]);

//         // create a trace object with x as the score and y as the neighborhood name
//         const NeighborhoodTrace = {
//             type: 'bar',
//             x: sorted.map(item => item[0]),
//             y: sorted.map(item => item[1]),
//             orientation: 'h'
//         }
//         // define layout
//         const layout = {
//             title: "Top 5 Neighborhoods",
//             yaxis: {
//                 automargin: true,
//                 rangemode: 'tozero'
//             },
//             xaxis: {
//                 rangemode: 'tozero',
//                 title: 'Total Score'
//             }
//         }
//         Plotly.newPlot('hbarPlotTopScores', [NeighborhoodTrace], layout);

//         /////////////////////////////////////////////
//         // INTERACTIVE BAR CHART
//         /////////////////////////////////////////////
//         // create a bar chart to show all parameter per neighborhood
//         const x = data.map(item => item.Neighborhood);

//         const salesIndexTrace = {
//             x: x,
//             y: data.map(item => item.SalesIndex),
//             name: 'Sales Index',
//             type: 'bar'
//         };
//         const crimeIndexTrace = {
//             x: x,
//             y: data.map(item => item.CrimeIndex),
//             name: 'Crime Index',
//             type: 'bar'
//         };
//         const schoolRatingTrace = {
//             x: x,
//             y: data.map(item => item.SchoolRating),
//             name: 'School Rating',
//             type: 'bar'
//         };
//         const sqftIndexTrace = {
//             x: x,
//             y: data.map(item => item.SQFTIndex),
//             name: 'SQFT Index',
//             type: 'bar'
//         };
//         const acreageIndexTrace = {
//             x: x,
//             y: data.map(item => item.AcreageIndex),
//             name: 'Acreage Index',
//             type: 'bar'
//         };
//         const floodIndexTrace = {
//             x: x,
//             y: data.map(item => item.FloodIndex),
//             name: 'Flood Index',
//             type: 'bar'
//         };
//         const valueChangeIndexTrace = {
//             x: x,
//             y: data.map(item => item.ValueChangeIndex),
//             name: 'Value Change Index',
//             type: 'bar'
//         };

//         const parametersTrace = [salesIndexTrace, 
//                         crimeIndexTrace, 
//                         schoolRatingTrace,
//                         acreageIndexTrace,
//                         sqftIndexTrace,
//                         floodIndexTrace,
//                         valueChangeIndexTrace,
//                     ];

//         const groupLayout = {
//             barmode: 'group',
//             yaxis:{
//                 title: 'Index'
//             }
//         };

//         Plotly.newPlot('barPlotParameter', parametersTrace, groupLayout);

//         /////////////////////////////////////////////////////
//         // GEO-INTERACTIVE NEIGBORHOODS
//         // NEED MORE INFORMATION ABOUT THE CONTENTS OF THIS MAP
//         /////////////////////////////////////////////////////
//     });  
// };
// //////////////////////////////////////////////////////////
// // UPDATE INTERACTIVE BAR CHART PER USER SELECTION
// //////////////////////////////////////////////////////////

// // Function to change bar chart parameters based on user selection    
// function chooseParameter (data, parameter){
//     switch(parameter){
//         case "SaleIndex":
//             return data.map(item => item.SaleIndex);
//         case "CrimeIndex":
//             return data.map(item => item.CimeIndex);
//         case "SchoolRating":
//             return data.map(item => item.SchoolRating);
//         case "AcreageIndex":
//             return data.map(item => item.AcreageIndex);
//         case "SQFTIndex":
//             return data.map(item => item.SQFTIndex);
//         case "FloodIndex":
//             return data.map(item => item.FloodIndex);
//        default:
//             return data.map(item => item.ValueChangeIndex);
//     }
// };

// // Event handler to update interactive bar chart based on user selection
// function handleBarChartSubmit(){
//     // use D3 to select the dropdown menu
//     const dropdownMenu = d3.select('#parameters');

//     // Assign the value of the dropdown menu option to a variable
//     const parameter = dropdownMenu.property('value');

//     // build a plot with the new subject
//     updateInteractiveBarChart(parameter);
// }

// function updateInteractiveBarChart(parameter){
//     d3.json('static/data/data.json').then((importedData)=>{

//         const data = importedData;

//         // array of available parameters to chose from
//         const parametersArr = [
//             "SalesIndex",
//             "CrimeIndex",
//             "SchoolRating",
//             "AcreageIndex",
//             "SQFTIndex",
//             "FloodIndex",
//             "ValueChangeIndex"
//         ];

//         // array of available neighborhoods
//         const neighborhoodsArr = data.map(item => item.Neighborhood);

//         const parameterSelected = parameter;
//         console.log(parameterSelected);

//         if(parametersArr.includes(parameterSelected)){
//         // create a trace object with x as the neighborhood and y as the userSelected parameter
//         const x = data.map(item => item.Neighborhood);
//         let y = chooseParameter(data, parameterSelected);

//         const ParameterTrace = {
//             type: 'bar',
//             x: data.map(item => item.Neighborhood),
//             y: chooseParameter(data, parameterSelected)
//         }
//         // define layout
//         const parameterLayout = {
//             title: "Top 5 Neighborhoods",
//             yaxis: {
//                 automargin: true,
//                 rangemode: 'tozero',
//                 title: parameterSelected
//             },
//             xaxis: {
//                 rangemode: 'tozero'
//             }
//         }
//             Plotly.newPlot('barPlotParameter2', [ParameterTrace], parameterLayout);
//         }
//         else if(neighborhoodsArr.includes(parameterSelected)){
//             // filter data by neighborhood selected
//             const neighborhoodData = data.filter(item => item.Neighborhood == parameterSelected);

//             const x =  ["SalesIndex","CrimeIndex","SchoolRating","AcreageIndex",
//                         "SQFTIndex","FloodIndex","ValueChangeIndex"];

//             const y = [
//                 neighborhoodData.SalesIndex,
//                 neighborhoodData.CrimeIndex,
//                 neighborhoodData.SchoolRating,
//                 neighborhoodData.AcreageIndex,
//                 neighborhoodData.SQFTIndex,
//                 neighborhoodData.FloodIndex,
//                 neighborhoodData.ValueChangeIndex
//             ]
//             const neighborhoodTrace = {
//                 x: x,
//                 y: y,
//                 type: 'bar'
//             };

//             const neighborhoodLayout = {
//                 yaxis:{
//                     title: 'Index'
//                 }
//             };
    
//             Plotly.newPlot('barPlotParameter2', [neighborhoodTrace], neighborhoodLayout);
//         }
//         else {
//         // create a bar chart to show all parameter per neighborhood
//         const x = data.map(item => item.Neighborhood);

//         const salesIndexTrace = {
//             x: x,
//             y: data.map(item => item.SalesIndex),
//             name: 'Sales Index',
//             type: 'bar'
//         };
//         const crimeIndexTrace = {
//             x: x,
//             y: data.map(item => item.CrimeIndex),
//             name: 'Crime Index',
//             type: 'bar'
//         };
//         const schoolRatingTrace = {
//             x: x,
//             y: data.map(item => item.SchoolRating),
//             name: 'School Rating',
//             type: 'bar'
//         };
//         const sqftIndexTrace = {
//             x: x,
//             y: data.map(item => item.SQFTIndex),
//             name: 'SQFT Index',
//             type: 'bar'
//         };
//         const acreageIndexTrace = {
//             x: x,
//             y: data.map(item => item.AcreageIndex),
//             name: 'Acreage Index',
//             type: 'bar'
//         };
//         const floodIndexTrace = {
//             x: x,
//             y: data.map(item => item.FloodIndex),
//             name: 'Flood Index',
//             type: 'bar'
//         };
//         const valueChangeIndexTrace = {
//             x: x,
//             y: data.map(item => item.ValueChangeIndex),
//             name: 'Value Change Index',
//             type: 'bar'
//         };

//         const parametersTrace = [salesIndexTrace, 
//                         crimeIndexTrace, 
//                         schoolRatingTrace,
//                         acreageIndexTrace,
//                         sqftIndexTrace,
//                         floodIndexTrace,
//                         valueChangeIndexTrace,
//                     ];

//         const groupLayout = {
//             barmode: 'group',
//             yaxis:{
//                 title: 'Index'
//             }
//         };

//         Plotly.newPlot('barPlotParameter2', parametersTrace, groupLayout);
//         }
//     });
// };