// playing with images and canvas

var canvas = document.querySelector("#main-canvas");
var ctx = canvas.getContext("2d");
var sourceImage = new Image();
var sourceImagePath = "images/cow.jpg";

var originalImage;
var imageBuffer;

var rangeElements = Array.prototype.slice.call(document.querySelectorAll(".color-range"));
var outputElements = Array.prototype.slice.call(document.querySelectorAll(".color-output"));

var imageDim = [858,559];

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
    elem.addEventListener("change", function(event){
        var color = event.currentTarget.dataset.color;
        var value = event.currentTarget.value;
        outputs[color].value = value;
        makeImageAdjustment(getRangeValues());
        drawFromBuffer();
    });
});

document.querySelector("#reset").addEventListener("click", function(){
    rangeElements.forEach(function(elem){
        elem.value = 0;
        elem.dispatchEvent(new Event("change"));
    });
    makeImageAdjustment(getRangeValues());
    drawFromBuffer();
});

// load an image
sourceImage.addEventListener("load", function(e) {
    ctx.drawImage(sourceImage,0,0);
    originalImage = ctx.getImageData(0,0,imageDim[0],imageDim[1]);
    imageBuffer = ctx.getImageData(0,0,imageDim[0],imageDim[1]);
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

var drawFromBuffer = function(){
    ctx.putImageData(imageBuffer, 0, 0);
};