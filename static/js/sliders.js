// BUDGET SLIDER////////////////////////////////////////
const budgetSlider = document.getElementById("budget");
const budgetOutput = document.getElementById("budgetValue");

budgetOutput.innerHTML=budgetSlider.value;

budgetSlider.oninput= function(){
    budgetOutput.innerHTML=this.value;
};

budgetSlider.addEventListener("mousemove", function(){
    const x = budgetSlider.value;
    const color = "linear-gradient(90deg, rgb(1, 68, 33)" + x/10000 + "%, rgb(214,214,214)" + x/10000 + "%)";
    budgetSlider.style.background = color;
});

// sales slider//////////////////////////////////////////////
const salesSlider = document.getElementById("salesWeight");
const salesOutput = document.getElementById("salesValue");

salesOutput.innerHTML=salesSlider.value;

salesSlider.oninput= function(){
    salesOutput.innerHTML=this.value;
};

salesSlider.addEventListener("mousemove", function(){
    const x = salesSlider.value;
    const color = "linear-gradient(90deg, rgb(117, 252, 117)" + x*10 + "%, rgb(214,214,214)" + x*10 + "%)";
    salesSlider.style.background = color;
});

//SCHOOLS SLIDER///////////////////////////////////////////////
const schoolSlider = document.getElementById("schoolWeight");
const schoolOutput = document.getElementById("schoolValue");

schoolOutput.innerHTML=schoolSlider.value;

schoolSlider.oninput= function(){
    schoolOutput.innerHTML=this.value;
};

schoolSlider.addEventListener("mousemove", function(){
    const x = schoolSlider.value;
    const color = "linear-gradient(90deg, rgb(117, 252, 117)" + x*10 + "%, rgb(214,214,214)" + x*10 + "%)";
    schoolSlider.style.background = color;
});

//CRIME SLIDER///////////////////////////////////////////////
const crimeSlider = document.getElementById("crimeWeight");
const crimeOutput = document.getElementById("crimeValue");

crimeOutput.innerHTML=crimeSlider.value;

crimeSlider.oninput= function(){
    crimeOutput.innerHTML=this.value;
};

crimeSlider.addEventListener("mousemove", function(){
    const x = crimeSlider.value;
    const color = "linear-gradient(90deg, rgb(117, 252, 117)" + x*10 + "%, rgb(214,214,214)" + x*10 + "%)";
    crimeSlider.style.background = color;
});

//ACREAGE SLIDER///////////////////////////////////////////////
const acreageSlider = document.getElementById("acreageWeight");
const acreageOutput = document.getElementById("acreageValue");

acreageOutput.innerHTML=acreageSlider.value;

acreageSlider.oninput= function(){
    acreageOutput.innerHTML=this.value;
};

acreageSlider.addEventListener("mousemove", function(){
    const x = acreageSlider.value;
    const color = "linear-gradient(90deg, rgb(117, 252, 117)" + x*10 + "%, rgb(214,214,214)" + x*10 + "%)";
    acreageSlider.style.background = color;
});

//SQFT SLIDER///////////////////////////////////////////////
const sqftSlider = document.getElementById("sqftWeight");
const sqftOutput = document.getElementById("sqftValue");

sqftOutput.innerHTML=sqftSlider.value;

sqftSlider.oninput= function(){
    sqftOutput.innerHTML=this.value;
};

sqftSlider.addEventListener("mousemove", function(){
    const x = sqftSlider.value;
    const color = "linear-gradient(90deg, rgb(117, 252, 117)" + x*10 + "%, rgb(214,214,214)" + x*10 + "%)";
    sqftSlider.style.background = color;
});

//FLOOD SLIDER///////////////////////////////////////////////
const floodSlider = document.getElementById("floodWeight");
const floodOutput = document.getElementById("floodValue");

floodOutput.innerHTML=floodSlider.value;

floodSlider.oninput= function(){
    floodOutput.innerHTML=this.value;
};

floodSlider.addEventListener("mousemove", function(){
    const x = floodSlider.value;
    const color = "linear-gradient(90deg, rgb(117, 252, 117)" + x*10 + "%, rgb(214,214,214)" + x*10 + "%)";
    floodSlider.style.background = color;
});

//FLOOD SLIDER///////////////////////////////////////////////
const valueSlider = document.getElementById("valueWeight");
const valueOutput = document.getElementById("valueValue");

valueOutput.innerHTML=valueSlider.value;

valueSlider.oninput= function(){
    valueOutput.innerHTML=this.value;
};

valueSlider.addEventListener("mousemove", function(){
    const x = valueSlider.value;
    const color = "linear-gradient(90deg, rgb(117, 252, 117)" + x*10 + "%, rgb(214,214,214)" + x*10 + "%)";
    valueSlider.style.background = color;
});






