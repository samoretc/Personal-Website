var sketchProc=function(processingInstance){ with (processingInstance){

size(600, 1050); 
frameRate(111);
var tol = 0.01; 
//var dead = true;
//var lastF = 1; 
//var dies = false; 
var dt = 0.1; 
var mouseOverSlider = false;

/*Arrow Stuff */
var arrowsinCol = 10 ; 
var arrowsinRow = 10; 

/*Function Stuff */
var xMin = 0; 
var xMax = 2; 
var yMin = 0; 
var yMax = 2; 
var xLength = xMax - xMin;
var dx = xLength/arrowsinCol;
var yLength = yMax - yMin;
var dy = yLength/arrowsinRow; 

/*Graph Stuff*/
var graphWidth = 400; 
var graphHeight = 400; 
var graphxMin = 150;
var graphxMax = graphxMin + graphWidth;
var graphyMin = 510;
var graphyMax = graphyMin - graphHeight;

var boxWidth = graphWidth / arrowsinCol;
var boxHeight = graphHeight / arrowsinRow;
var yTickIntervals = 4; 
var xTickIntervals = 4; 
var tickgraphdX = graphWidth / xTickIntervals;
var tickgraphdY = graphHeight/ yTickIntervals;
var tickLength = 10; 
var tickdX = xLength/ xTickIntervals;
var tickdY = yLength/ yTickIntervals; 

var graphdY = 50; 
var graph2yMin = graphyMin + graphHeight + graphdY;


/* arrow aestics */
var triLength = 9; 
  
/*Theta Stuff*/ 
var thetaMin = 0; 
var thetaMax = 3; 
var thetaLength = thetaMax - thetaMin; 
var numofIntervals= 6;  
var thetaInterval = thetaLength/numofIntervals; 
var thetaPlay = 1;

/*UI Text Box Stuff*/
var myFont = createFont("Times", 15);
var uiBoxX = graphxMin + graphWidth*3/5; 
var uiBoxY = 40; 
var uiWidth = 150; 
var uiHeight = 38; 
var uiIntervalLength = uiWidth / numofIntervals;
var heading = "Theta: ";

/*ODE solver Stuff*/
var numPoints = 200; 
var tMin = 0; 
var tMax = 10; 
var tLength = tMax - tMin; 
var ic = 1;

var icX = 0.5; 
var icY = 1;

var ballX = (icX/xLength)*(graphWidth)  + graphxMin; 
var ballY = - (icY/yLength)*(graphHeight) + graphyMin; 


var eHeading = "Initial E. Coli Concentration: " + icY;
var eHeaderY = 70;

var yHeading = "Initial Yeast Concentration: " + icX;
var yHeaderY = 50; 

var dieHeading = "The Population Dies";
var dieHeadingX = 240;
var dieHeadingY = 20; 




var arrow = function(X, Y, graphX, graphY){
/* These never change*/
    this.graphX = graphX;
    this.graphY = graphY; 
/*X, Y are locations where the function will be evaluated */
    this.functionX = function(x, y) {
        return y - x;   
    };
    this.functionY = function(x, y) {
        return thetaPlay*y*(x - 1);  /*y;        */
    };
    

    this.calculate = function(){
    this.lengthX = this.functionX(X, Y);
    this.lengthY = this.functionY(X, Y);
    this.length = sqrt( pow(this.lengthX, 2) + pow(this.lengthY, 2)); 
    if (this.lengthX >= 0) {
    this.theta = atan(this.lengthY / this.lengthX);          
    }
    else{
    this.theta = atan(this.lengthY / this.lengthX) + 3.1415;
    }
    };

    this.drawOn = function(maxLength) {
        strokeWeight(1); stroke(0, 0, 0);
        var alpha = 36*(3.1415/180);
        var scaledLength=(this.length / maxLength)*boxHeight; // Box height scales arrow length  
        var endX = this.graphX + scaledLength*cos(this.theta)/2;
        var endY = this.graphY - scaledLength*sin(this.theta)/2;
        line(this.graphX - scaledLength*cos(this.theta)/2, this.graphY + scaledLength*sin(this.theta)/2, endX, endY);
        triangle(endX, endY, endX + cos(3.1415 + this.theta - alpha/2)*triLength, endY - sin(3.1415 + this.theta - alpha/2)*triLength, endX + cos(3.1415 + this.theta + alpha/2)*triLength, endY - sin(3.1415 + this.theta + alpha/2)*triLength);
};

};




var drawHeader = function(x, y, heading){
    textFont(myFont, 15);
    fill(0, 0, 0);
    text(heading, x, y);
    fill(0, 0, 0);
};


var makeAxis = function(xlabel, ylabel, min){
        strokeWeight(3);
        stroke(13, 1, 1);
        line(graphxMin + ((0 - xMin)/xLength)*graphWidth, min, graphxMin + ((0 - xMin)/xLength)*graphWidth, min - graphHeight  );
        line(graphxMin, min + ((0 - yMin)/yLength)*graphHeight, graphxMax, min + ((0 - yMin)/yLength)*graphHeight);

        strokeWeight(2);
        textAlign(RIGHT, CENTER);
        for (var k = 0; k < yTickIntervals + 1; k++){
            line(graphxMin, min - k*tickgraphdY, graphxMin - tickLength, min - k*tickgraphdY);
            text(yMin + k*tickdY, graphxMin - 30, min - k*tickgraphdY + 5);
        }

        translate(graphxMin - 40, min - graphHeight/2);
        rotate(2*3.1415*(3/4));
        textAlign(CENTER, BOTTOM);
        text(ylabel, 0, 0);
        resetMatrix(); 

        /*X axis */
        textAlign(CENTER, CENTER);
        for (var p = 0; p < xTickIntervals + 1; p++){
            line(graphxMin + p*tickgraphdX, min, graphxMin + p*tickgraphdX, min + tickLength);
            text(xMin + p*tickdX, graphxMin + p*tickgraphdX - 3, min + 30);
        }

        text(xlabel, graphxMin + graphWidth/2, min + 50);
};


var plotSolution = function(t, y, min, color) {
    /*Other ways to do this. We already now which graph based on min*/    

    if (min >graphyMin){ 
       stroke(56, 79, 224);
    }
    else{
        stroke(255, 0, 0);
    }
    if (color === 1){
         stroke(56, 79, 224);
    }
    var point1X = (t[0] - xMin)*graphWidth/xLength +graphxMin; 
    var point1Y= - (y[0] - yMin)*graphHeight/yLength +min;
    var point2X; var point2Y; 

    strokeWeight(2);


    for (var k = 1; k < t.length; k++){
        point2X = (t[k] - xMin)*(graphWidth/xLength) +     graphxMin;
        point2Y =  - (y[k] - yMin)*graphHeight/yLength + min;

        if (point2X <= graphxMax && point2X >= graphxMin && point2Y <= min && point2Y >= (min - graphWidth) &&   point1X <= graphxMax && point1X >= graphxMin && point1Y < min && point1Y > (min - graphWidth) )
        line(point1X, point1Y, point2X, point2Y); 

        point1X = point2X;
        point1Y = point2Y;   

        
    }


};

var odefunX = function(y1, y2){
        var sol = [];
        sol[0] = y2 - y1;
        sol[1] = thetaPlay*y2*(y1 - 1);
        return sol; 
    };




var odeSolution = function (icONE, icTWO) {
    this.yone = []; 
    this.ytwo = [];
    this.calculate = function(){
    this.yone = []; 
    this.ytwo = [];

  

    this.yone.push(icONE);
    this.ytwo.push(icTWO);    
    var counter = 0;


    var odePart; 
    var on = true;

    while(on){

        if (this.yone[counter] < 2){
            if (this.yone[counter] > 0 ){
                if (this.ytwo[counter] > 0){
                    if (this.ytwo[counter] < 2) {
                                odePart = odefunX(this.yone[counter], this.ytwo[counter]);
                                this.yone.push(- odePart[0]*dt + this.yone[counter]);
                                this.ytwo.push(- odePart[1]*dt + this.ytwo[counter]);
                                counter++;

                    }                    else{
                        on = false; 
                    }}                    else{
                        on = false; 
                    }}
                                    else{
                        on = false; 
                    }}
                    else{
                        on = false; 
                    }

    }
on = true; 

    this.yone.reverse();
    this.ytwo.reverse(); 
 
       while(on){

        if (this.yone[counter] < 2){
            if (this.yone[counter] > 0.1 ){
                if (this.ytwo[counter] > 0.1){
                    if (this.ytwo[counter] < 2) {
        odePart = odefunX(this.yone[counter], this.ytwo[counter]);
        this.yone.push(odePart[0]*dt + this.yone[counter]);
        this.ytwo.push(odePart[1]*dt + this.ytwo[counter]);
                                counter++;

                    }                    else{
                        on = false; 
                    }}                    else{
                        on = false; 
                    }}
                                    else{
                        on = false; 
                    }}
                    else{
                        on = false; 
                    }

    }


};
    this.plot = function(){
    plotSolution(this.yone, this.ytwo, graphyMin); 
};

};


var flagellum = function(x, y1, y2, theta) {
    var cx1 = x - s   + 0.01*s*sin(theta);
    var cx2 = x - s*2 + 0.01*s*sin(theta+90);
    var x2  = x - s*3;
    var cy1 = y1 + 2*s*cos(theta);
    var cy2 = y1 - 2*s*cos(theta+90);
    bezier(x, y1, cx1, cy1, cx2, cy2, x2, y2);

};

var s = 9;

var drawYeast = function(xx, yy){
    fill(194, 85, 72);
    noStroke();
    ellipse(xx + 5 , yy + 5 , 20, 20);
    ellipse(xx, yy, 20, 20);
};

var drawBacteria = function(xx, yy){
    translate(xx, yy);
    rotate(3.14*4/3);
    //
    strokeWeight(2);
    fill(124, 159, 139);
    stroke(111, 96, 86);
    rect(-s, -s/2, s*2, s, s);

    strokeWeight(1);
    noFill();




    flagellum(-s, 0, 0, 0.25 * frameCount % 360);
    flagellum(-s, -1, -3, 30 + 0.25 * frameCount % 360);
    flagellum(-s, 1, 3, 60 + 0.25 * frameCount % 360);
    flagellum(-s, 0, 2, 90 + 0.25 * frameCount % 360);
    flagellum(-s, 0, -2, 90 + 0.25 * frameCount % 360);
    resetMatrix();
   // if (!dead){
   // lastF++; 
   // }
};

var interactiveSolver = function (icONE, icTWO) { 
    this.yone = []; 
    this.ytwo = [];
    this.t = [];
    t.push(0); 
    this.yone.push(icONE);
    this.ytwo.push(icTWO);

    var counter = 0; 
    var odePart; 
    while (this.yone[counter] < 2 && this.yone[counter] > 0.05 && this.ytwo[counter] > 0.05 && this.ytwo[counter] < 2){
        odePart = odefunX(this.yone[counter], this.ytwo[counter]);
        this.yone.push(odePart[0]*dt + this.yone[counter]);
        this.ytwo.push(odePart[1]*dt + this.ytwo[counter]);
        counter++;
        this.t.push(counter*dt);
    }
         textFont(myFont, 18);
         fill(0, 0, 0);
         textAlign(CENTER, CENTER);

         noFill();
    if (this.yone[counter] > 0.8) { 

            text("The Population Survives!", graphxMin + graphWidth/2, dieHeadingY);
            //dead = false;
            stroke(0, 250, 0);
    }
    else {
            text("The Population Dies", graphxMin + graphWidth/2, dieHeadingY);
            //dead = true;
            stroke(250, 0, 0);
    }
            rect(graphxMin, 7, graphWidth, 80, 10);


    plotSolution(this.yone, this.ytwo, graphyMin, 1);
    plotSolution(this.t, this.ytwo, graph2yMin);
    plotSolution(this.t, this.yone, graph2yMin);


    var eColiY= - (this.ytwo[0] - yMin)*graphHeight/yLength + graph2yMin;
    var yeastY= -(this.yone[0] - yMin)*graphHeight/yLength + graph2yMin;
    drawYeast(graphxMin, yeastY);
    drawBacteria(graphxMin, eColiY);
   // drawBacteria(graphxMin - 40, graphyMin - graphHeight*5/8);
  //  drawYeast(graphxMin + graphWidth*5/9 + 10, graphyMin + 45);
};


var mousePressed = function() {
    mouseOverSlider = true; 
};
 
var mouseReleased = function() {
    mouseOverSlider = false; 
};

//Setting up arrows to be in Vector field
    /*Vector Field */
    var arrows =  [];
    var funcX = xMin + dx/2; /* Start X */
    var funcY = yMin + dy/2;
    var graphX = graphxMin + boxWidth/2;
    var graphY = graphyMin - boxHeight/2;
    var maxLength = 0; 
    var count = 0; 

    /*This is for finding the actual values in the x and y direction*/
    for (var k = 0; k < arrowsinRow; k++) {
        for (var l = 0; l < arrowsinCol; l++){
            arrows.push(new arrow(funcX, funcY, graphX, graphY));
            arrows[count].calculate();
            funcX += dx; 
            graphX+= boxWidth;

            /* Find Max Length to scale arrow lengths */
            if (maxLength < arrows[count].length) {
                maxLength = arrows[count].length; 
            }
            count++; 
        }
          funcY += dy; 
          funcX = xMin + dx;
          graphX = graphxMin + boxWidth/2;
          graphY -= boxHeight;
    }


     var nullClines = []; 
     nullClines.push(new odeSolution(1.001, 1.001)); 
     nullClines.push(new odeSolution(0.999, 0.999)); 
     nullClines[0].calculate();
     nullClines[1].calculate();

var boxSlider = function(x, y, w, h, heading, theta, max, thetaInterval) {
    this.x = x; 
    this.y = y; 
    this.w = w; 
    this.h = h; 
    this.heading = heading; 
    this.theta = theta; 
    this.max = max; 
    this.myX = (w-30)*(this.theta/this.max) + this.x + 15; 
    this.myY = this.y + 28; 

    
    this.draw = function(){
    noStroke();
    fill(50, 50, 50);
    rect(x+2, y+2, w, h, 8);
    fill(255, 255, 255, 230);
    rect(x, y, w, h, 8);
    textFont(myFont, 15);
    fill(0, 0, 0);
    textAlign(LEFT, BOTTOM);
    text(heading + this.theta, x+10, y+16);
    fill(50, 50, 50, 220);
    rect(x+10, y+25, w-20, 6, 6);
    ellipse(this.myX, this.myY, 15, 15); 
   
};
    
    this.moveSlider = function(){
       if (mouseX > x+5  && mouseX < x + w + 10 && mouseY         > y && mouseY < y + h + 30){
            this.theta = round(((mouseX - x ) / w) * this.max* 10)/10; 
            thetaPlay = this.theta ; 
            this.myX = (w-30)*(this.theta/this.max) + x + 15;
            this.draw();  

            count = 0 ; 
            maxLength = 0; 
            for (var i = 0; i < arrowsinRow; i++){
            for (var j = 0; j < arrowsinCol; j++){
                arrows[count].calculate();  /*maxLength is to scale everything, boxHeight is the */
               
                if (maxLength < arrows[count].length) {
                maxLength = arrows[count].length; 
            }
             count++; 
            }
        }
             nullClines[0].calculate();
             nullClines[1].calculate();

       }
    };
};

var slider = new boxSlider(uiBoxX, uiBoxY, uiWidth, uiHeight, heading, thetaPlay, thetaMax, thetaInterval);


var draw = function(){

     background(248, 252, 253);
    
    /*UI Theta Box*/


    textAlign(LEFT, CENTER);
    /*E. Coli Concentration Box*/
    drawHeader(graphxMin + 10, eHeaderY, eHeading);  


     //textAlign(RIGHT, CENTER);
    /*Yeast Concentration Box */    
     drawHeader(graphxMin + 10 , yHeaderY, yHeading);  

     makeAxis('Time', 'Concentration', graph2yMin);
     makeAxis('Yeast', 'E. Coli', graphyMin);


    if (mouseOverSlider){

        slider.moveSlider(); 
        if (mouseX > graphxMin && mouseX < graphxMax && mouseY < graphyMin && mouseY > graphyMax){                      
            ballY = mouseY;
            ballX = mouseX;
            icX =  ((ballX - graphxMin)/graphWidth)*xLength + xMin;
            icY =  ((graphyMin - ballY)/graphHeight)*yLength+ yMin;
            eHeading = "Initial E. Coli Concentration: " + round(icY*100)/100;
            yHeading = "Initial Yeast Concentration: " + round(100*icX)/100;           
        }
    }
        count = 0; 

        /*This is for drawing the arrows on the graph*/
        for (var i = 0; i < arrowsinRow; i++){
            for (var j = 0; j < arrowsinCol; j++){
                arrows[count].drawOn(maxLength, boxHeight);  /*maxLength is to scale everything, boxHeight is the */
                count++; 
            }
        }

         slider.draw(); 

        nullClines[0].plot();
        nullClines[1].plot();

        if (icX < 1 + tol & icX > 1 - tol && icY > 1 - tol && icY < 1 + tol){
            icX = 1+tol; 
            icY = 1+tol; 

        }
        interactiveSolver(icX, icY);

         stroke(56, 79, 224);
         fill(56, 79, 224);
         ellipse(ballX, ballY, 10, 10);
};
}
};
