var prevPos = {'X' : 0 , 'Y' : 0};
var CustomRandom = function(nseed) {
  
  var seed,    
    constant = Math.pow(2, 13)+1,    
    prime = 1987,    
//any prime number, needed for calculations, 1987 is my favorite:)  
    maximum = 1000;    
//maximum number needed for calculation the float precision of the numbers (10^n where n is number of digits after dot)  
    if (nseed) {    
      seed = nseed;    
    }    
    
    if (seed == null) {    
//before you will correct me in this comparison, read Andrea Giammarchi's text about coercion http://goo.gl/N4jCB  
      
      seed = (new Date()).getTime();   
//if there is no seed, use timestamp     
    }     
    
    return {    
      next : function(min, max) {    
        seed *= constant;    
        seed += prime;    
           
      
        return min && max ? min+seed%maximum/maximum*(max-min) : seed%maximum/maximum;  
// if 'min' and 'max' are not provided, return random number between 0 & 1  
      }    
    }    
}  

// define a pencil brush for drawing free-hand lines
var PencilBrush = new Class({
    initialize: function (lineWidth, drawingCxt) {
        this.lineWidth = lineWidth;
		this.colour = "";
        // get the cursor associated with the pencil brush
        this.getCursor = function () {
            return "url(/whiteboard/static/cursors/pencil_cursor.cur), crosshair";
        };

        this.setColour = function (colour) {
			/*var lx = x2 - x1;
			var ly = y2 - y1;
			var lineLength = Math.sqrt(lx*lx + ly*ly);
			var wy = lx / lineLength * lineWidth;
			var wx = ly / lineLength * lineWidth;*/
			
			this.colour = colour;
            drawingCxt.lineWidth = this.lineWidth;
            drawingCxt.lineCap = "round";
            drawingCxt.lineJoin = "round";
        };

        // draws a line to the x and y coordinates of the specified position
        this.drawLine = function(position) {
// 			console.log("In func POs :",position);
// 			console.log("In func prevPos :",prevPos);
			var lx = position.X - prevPos.X;
			var ly = position.Y - prevPos.Y;
			var lineLength = Math.sqrt(lx*lx + ly*ly);
			
			if(!lineLength) return;
			
			var wy = lx / lineLength * this.lineWidth;
			var wx = ly / lineLength * this.lineWidth;
			console.log("WX = ",wx);
			console.log("Wy = ",wy);
			
			console.log(prevPos.X-wx/2, prevPos.Y+wy/2, prevPos.X+wx/2, prevPos.Y-wy/2);
			var gradient = drawingCxt.createLinearGradient(prevPos.X-wx/2, prevPos.Y+wy/2, prevPos.X+wx/2, prevPos.Y-wy/2);
			console.log("Color :",this.colour);
			gradient.addColorStop(0,    "rgba(0,0,0,0)");
			gradient.addColorStop(0.43, "rgba(0,0,0,0.8)");
			gradient.addColorStop(0.57, "rgba(0,0,0,0.8)");
			gradient.addColorStop(1,    "rgba(0,0,0,0)");
			
			drawingCxt.strokeStyle = gradient;
			
            drawingCxt.lineTo(position.X, position.Y);
            drawingCxt.stroke();
        }

        this.startDrawing = function (position) {
            // start drawing by moving to the specified x and y coordinates
            drawingCxt.beginPath();
			prevPos.X = position.X - 1;
			prevPos.Y = position.Y - 1;

            drawingCxt.moveTo(prevPos.X, prevPos.Y);
            this.drawLine(position);

        };

        this.draw = function (position) {
            this.drawLine(position);
			prevPos.X = position.X;
			prevPos.Y = position.Y;
        };

        this.finishDrawing = function (position) {
            // draw the line to the finishing coordinates
            this.drawLine(position);
            drawingCxt.closePath();
        };
    }
});

// define a spray brush for spraying on the canvas
var SprayBrush = new Class({
    initialize: function (radius, density, drawingCxt) {
        // the radius of the spray circle
        this.radius = radius;

        // how many dots are sprayed in the circle per interval
        this.density = density;

        var temp,_intervalId,    // used to track the current interval ID
            _center;        // the current center to spray

        function getRandomOffset(temp) {
            var rng = CustomRandom(temp);  
            
            rng.next()
            var randomAngle = rng.next() * 360;
            var randomRadius = rng.next() * radius;

            return {
                x: Math.cos(randomAngle) * randomRadius,
                y: Math.sin(randomAngle) * randomRadius
            };
        }

        // get the cursor associated with the pencil brush
        this.getCursor = function () {
            return "url(/whiteboard/static/cursors/spray_cursor.cur), crosshair";
        };

        this.setColour = function (colour) {
            drawingCxt.fillStyle = colour;
        };

        this.startDrawing = function (position) {
            _center = position;

            // spray once every 200 milliseconds
            temp = Math.random()*1000;
            _intervalId = setInterval(this.spray, 25);
        };

        this.draw = function (position) {
            // change the center of the spray
            _center = position;
        };

        this.finishDrawing = function (position) {
            clearInterval(_intervalId);
        };

        this.spray = function () {
            var centerX = _center.X, centerY = _center.Y, i;

            for (i = 0; i < density; i++) {
                
                var offset = getRandomOffset(temp);
                var x = centerX + offset.x, y = centerY + offset.y;

                drawingCxt.fillRect(x, y, 1, 1);
                temp=(temp*2);
                if(temp==Infinity) temp=1;
            }
            console.log(temp);
        };
    }
});

// define an eraser brush which clears part of the canvas with rectangles
var EraserBrush = new Class({
    Extends: PencilBrush,
    initialize: function (lineWidth, drawingCxt) {
        // invoke the base constructor
        this.parent(lineWidth, drawingCxt);

        // get the cursor associated with the pencil brush
        this.getCursor = function () {
            return "url(/whiteboard/static/cursors/eraser_cursor.cur), crosshair";
        };

        this.setColour = function (colour) {
            drawingCxt.fillStyle = drawingCxt.strokeStyle = backgroundColour;
            drawingCxt.lineWidth = this.lineWidth;
            drawingCxt.lineCap = "round";
            drawingCxt.lineJoin = "round";
        };
    }
});

// define a brush like the one you use to paint the wall
var PaintBrush = new Class({
    Extends: PencilBrush,
    initialize: function (lineWidth, drawingCxt) {
        // invoke the base constructor
        this.parent(lineWidth, drawingCxt);

        // get the cursor associated with the pencil brush
        this.getCursor = function () {
            return "url(/whiteboard/static/cursors/paint_cursor.cur), crosshair";
        };

        this.setColour = function (colour) {
            drawingCxt.fillStyle = drawingCxt.strokeStyle = colour;
            drawingCxt.lineWidth = this.lineWidth;
            drawingCxt.lineCap = "butt";
            drawingCxt.lineJoin = "bevel";
        };

        this.startDrawing = function (position) {
            // start drawing by moving to the specified x and y coordinates
            drawingCxt.beginPath();
            drawingCxt.moveTo(position.X, position.Y);
        };
    }
});

//define a rectangle

var RectangleBrush = new Class({
    Extends: PencilBrush,
    initialize: function(lineWidth, drawingCxt, overlayCxt) {
        // invoke the base constructor

        this.parent(lineWidth, drawingCxt);

        //get the cursor associated with the rectangle
        this.getCursor = function(){
            return "url(/whiteboard/static/cursors/paint_cursor.cur), crosshair";
        };
        startpnt={};
        this.startDrawing = function(position){
            overlayCxt.strokeStyle="#FF0000";
            startpnt = position;
//             drawingCxt.strokeRect(startpnt.X,startpnt.Y,startpnt.X+10,startpnt.Y+10);
            //drawingCxt.fillRect(position1.X,position1.Y,position2.X,position2.Y);
        };
        this.draw = function(position){
            overlayCxt.clearRect(0,0,700,450);
            overlayCxt.strokeRect(startpnt.X,startpnt.Y,position.X-startpnt.X,position.Y-startpnt.Y);
        }
        this.finishDrawing = function(position){
            overlayCxt.clearRect(0,0,700,450);
            drawingCxt.strokeRect(startpnt.X,startpnt.Y,position.X-startpnt.X,position.Y-startpnt.Y);
        }
        
    }
});



var CircleBrush = new Class({
  Extends: PencilBrush,
    initialize: function(lineWidth, drawingCxt, overlayCxt) {
        // invoke the base constructor

        this.parent(lineWidth, drawingCxt);
    //get the cursor associated with the circle
        this.getCursor = function(){
            return "url(/whiteboard/static/cursors/paint_cursor.cur), crosshair";
        };
        startpnt={};
    this.startDrawing = function(position){
            overlayCxt.strokeStyle="#FF0000";
            startpnt = position;
        
        };
    this.draw = function(position){
        overlayCxt.beginPath();
        overlayCxt.clearRect(0,0,700,450);
        overlayCxt.closePath();
            overlayCxt.arc(startpnt.X,startpnt.Y,Math.sqrt((position.X-startpnt.X)*(position.X-startpnt.X) + (position.Y-startpnt.Y)*(position.Y-startpnt.Y)),0,2*Math.PI,true);
        overlayCxt.stroke();
        }
        
        this.finishDrawing = function(position){
        overlayCxt.clearRect(0,0,700,450);
        overlayCxt.closePath();
        drawingCxt.beginPath();
            drawingCxt.arc(startpnt.X,startpnt.Y,Math.sqrt((position.X-startpnt.X)*(position.X-startpnt.X) + (position.Y-startpnt.Y)*(position.Y-startpnt.Y)),0,2*Math.PI,true);
        drawingCxt.stroke();
        }
    }
});


//line tool

var LineBrush = new Class({
  Extends: PencilBrush,
    initialize: function(lineWidth, drawingCxt, overlayCxt) {
        // invoke the base constructor

        this.parent(lineWidth, drawingCxt);
    //get the cursor associated with the circle
        this.getCursor = function(){
            return "url(/whiteboard/static/cursors/paint_cursor.cur), crosshair";
        };
        startpnt={};
    this.startDrawing = function(position){
        
            overlayCxt.strokeStyle="#FF0000";
            startpnt = position;
        overlayCxt.moveTo(startpnt.X, startpnt.Y);
        };
    this.draw = function(position){
        overlayCxt.beginPath();
        overlayCxt.clearRect(0,0,700,450);
        overlayCxt.closePath();
        overlayCxt.moveTo(startpnt.X, startpnt.Y);
            overlayCxt.lineTo(position.X, position.Y);
        overlayCxt.stroke();
        }
        
        this.finishDrawing = function(position){
        overlayCxt.clearRect(0,0,700,450);
        overlayCxt.closePath();
        drawingCxt.beginPath();
        drawingCxt.moveTo(startpnt.X, startpnt.Y);
        drawingCxt.lineTo(position.X, position.Y);
            drawingCxt.stroke();
        }
    }
});


// define a colour pick
var ColourPicker = new Class({
    initialize: function (drawingCxt, onFinish) {
        // get the cursor associated with the pencil brush
        this.getCursor = function () {
            return "url(/whiteboard/static/cursors/colour_picker_cursor.cur), crosshair";
        };

        var _colour;

        function colourToHex(colourValue) {
            var colourMap = "0123456789abcdef";
            var multiplier = Math.floor(colourValue / 16), rem = colourValue % 16;

            return colourMap[multiplier] + colourMap[rem];
        }

        this.setColour = function (colour) {
        };

        this.startDrawing = function (position) {
        };

        this.draw = function (position) {
        };

        this.finishDrawing = function (position) {
            // get the image data for the pixel
            var rgba = drawingCxt.getImageData(position.X, position.Y, 1, 1).data;

            var r = rgba[0], g = rgba[1], b = rgba[2];
            _colour = colourToHex(r) + colourToHex(g) + colourToHex(b);

            onFinish("#" + _colour);
        };
    }
});