//variable to hold loading progress
let fill = 0;

//funciton to load the bar
function load_bar(){
    window.setInterval(function(){
        fill +=2;

        function handleProgressBar(){
            
            // function to toggle content:
            const resultsContent=document.getElementById('content3')
            const progBarContent = document.getElementById('content2')

            // scenario where user prefs have already been called, results generated and user is changing prefs:
            if (resultsContent.classList.contains("showData")){
                // hide results content
                resultsContent.classList.add('hideData');
                resultsContent.classList.remove('showData')

                // show progress bar
                progBarContent.classList.add('showData');
                progBarContent.classList.remove('hideData');

            }

            // scenario where user is choosing preferences for first time and content is switching from home to results
            else{
                // show progress bar
                progBarContent.classList.add('showData');
                progBarContent.classList.remove('hideData');
            }; 
        };

        // scenario where fill bar is 100% loaded:
        if(fill ===100){
            clearInterval();
            handleProgressBar();
            
            // change the class of the results page to show data
            resultsContent.classList.add('showData')
            resultsContent.classList.remove('hideData');

            // re-initialize fill level of bar to 0 for next use
            fill=0;
        }
        // keep loading prog bar if not already 100% loaded
        else{
            document.getElementById("progress_one").style.width= fill+ "%";
        }

    }, 500);
}

