let fill = 0;

//funciton to load the bar
function load_bar(){
    window.setInterval(function(){
        fill +=2;

        function handleProgressBar(){

            document.getElementById('content2').classList.add('hideData');
            document.getElementById('content2').classList.remove('showData');
        
        
            // change the class of the results page to show data
            document.getElementById('content3').classList.add('showData')
            document.getElementById('content3').classList.remove('hideData');
        };
        //if prog bar at 100 percent
        if(fill ===100){
            clearInterval();
            handleProgressBar();
            //reset prog bar fill for next run
            fill = 0
        }
        //if prog bar not at 100 percent loaded
        else{
            document.getElementById("progress_one").style.width= fill+ "%";
        }

    }, 750);
}

