// playing with images and canvas

var canvas = document.querySelector("#main-canvas");
var ctx = canvas.getContext("2d");
var sourceImage = new Image();
var sourceImagePath = "images/cow2.jpg";

var originalImage;
var imageBuffer;

var rangeElements = Array.prototype.slice.call(document.querySelectorAll(".color-range"));
var outputElements = Array.prototype.slice.call(document.querySelectorAll(".color-output"));
var colorSwitchElements = Array.prototype.slice.call(document.querySelectorAll(".color-switch"));

var imageDim = [640,426];

var outputs = {};
outputElements.forEach(function(elem){
    outputs[elem.dataset.color] = elem;
});

var getRangeValues = function(){
    return ["red", "green", "blue"].map(function(color){
        return outputs[color].value;
    });
};

// set controll event listeners

rangeElements.forEach(function(elem) {
    elem.addEventListener("mousedown", function (event){
        var color = event.target.dataset.color;

        event.target.dragInterval = setInterval(function(){
            outputs[color].value = event.target.value;
            makeImageAdjustment(getRangeValues());
        }, 10);
        
    });
});

rangeElements.forEach(function(elem) {
    elem.addEventListener("mouseup", function (event){
        if (event.target.dragInterval) {
            clearInterval(event.target.dragInterval);
        }
    });
});

colorSwitchElements.forEach(function(elem){
    elem.addEventListener("click", function(event){
        var c1 = event.target.dataset.c1;
        var c2 = event.target.dataset.c2;
        colorSwitch(c1, c2);
    });
});


document.querySelector("#reset").addEventListener("click", function(){
    rangeElements.forEach(function(elem){
        elem.value = 0;
    });
    outputElements.forEach(function(elem){
        elem.value = 0;
    });
    makeImageAdjustment(getRangeValues());
});

// load an image
sourceImage.addEventListener("load", function(e) {
    ctx.drawImage(sourceImage,0,0);
    originalImage = ctx.getImageData(0,0,imageDim[0],imageDim[1]);
    imageBuffer = ctx.getImageData(0,0,imageDim[0],imageDim[1]);
    requestAnimationFrame(drawFromBuffer);
});

sourceImage.src=sourceImagePath;

// image manipulation
var makeImageAdjustment = function(rgb) {
    // move through the original image, sum rgb values, put result in imageBuffer
    for (var i = 0; i < originalImage.data.length; i++) {
        var mod = i%4;
        var value = originalImage.data[i];
        if (mod === 3) {
            imageBuffer.data[i] = originalImage.data[i];
        } else {
            imageBuffer.data[i] = originalImage.data[i] + parseInt(rgb[mod],10);
        }
    }
};

var colorSwitch = function(c1, c2) {
    var colors = ["red", "green", "blue", "alpha"];
    var c1Index = colors.indexOf(c1);
    var c2Index = colors.indexOf(c2);
    for (var i = 0; i < originalImage.data.length; i += 4) {
        imageBuffer.data[i + c1Index] = originalImage.data[i + c2Index];
        imageBuffer.data[i + c2Index] = originalImage.data[i + c1Index];
    }
}

var drawFromBuffer = function drawFromBuffer(){
    ctx.putImageData(imageBuffer, 0, 0);
    requestAnimationFrame(drawFromBuffer);
};
