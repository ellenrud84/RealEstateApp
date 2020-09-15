//variable to hold loading progress
let fill = 0;
 // get elements
const resultsContent=document.getElementById('content3')
const progBarContent = document.getElementById('content2')
const homePageContent= document.getElementById('content1')

// on click... 
function load_bar(){


    // handle scenario to transition from home page to prog bar:
    if (homePageContent.classList.contains("showData")){
        // hide homepage content
        homePageContent.classList.add('hideData');
        homePageContent.classList.remove('showData');
        //turn on prog bar
        progBarContent.classList.remove('hideData');
        progBarContent.classList.add('showData');

    }

   //handle scenario where refreshing results page
   else {
       //hide results
       resultsContent.classList.add('hideData')
       resultsContent.classList.remove('showData')
       //show prog bar
       progBarContent.classList.remove('hideData');
       progBarContent.classList.add('showData');
   }

    window.setInterval(function(){
        fill +=2;
        

        // scenario where fill bar is 100% loaded:
        if(fill ===100){
            clearInterval();
            //show results
            resultsContent.classList.add('showData')
            resultsContent.classList.remove('hideData')
            //hide prog bar:
            progBarContent.classList.remove('showData');
            progBarContent.classList.add('hideData');
            //reset fill to 0 for next run
            fill = 0;
        }
        else{
            document.getElementById("progress_one").style.width= fill+ "%";
        }

    }, 500);
}





// //funciton to load the bar
// function load_bar(){
//     window.setInterval(function(){
//         fill +=2;

//         // function to toggle content
//         function handleProgressBar(){
            
            

//             // scenario where user prefs have already been called, results generated and user is changing prefs:
//             if (resultsContent.classList.contains("showData")){
//                 // hide results content
//                 resultsContent.classList.add('hideData');
//                 resultsContent.classList.remove('showData')

//                 // show progress bar
//                 progBarContent.classList.add('showData');
//                 progBarContent.classList.remove('hideData');

//             }

//             // scenario where user is choosing preferences for first time and content is switching from home to results
//             else if (resultsContent.classList.contains('hideData')){
//                 // show progress bar
//                 progBarContent.classList.add('showData');
//                 progBarContent.classList.remove('hideData');
//             }; 
//         };

        // scenario where fill bar is 100% loaded:
        // if(fill ===100){
        //     clearInterval();
        //     handleProgressBar();
            
        //     // change the class of the results page to show data
        //     resultsContent.classList.add('showData')
        //     resultsContent.classList.remove('hideData');

        //     // re-initialize fill level of bar to 0 for next use
        //     fill=0;
        // }
        // keep loading prog bar if not already 100% loaded
        else{
            document.getElementById("progress_one").style.width= fill+ "%";
        }

    }, 500);
}

