// playing with images and canvas

var canvas = document.querySelector("#main-canvas");
var ctx = canvas.getContext("2d");
var sourceImage = new Image();
var sourceImagePath = "images/cow.jpg";

var originalImage;
var imageBuffer;

var outputs = {};
var outputElements = document.querySelectorAll(".color-output");
Array.prototype.slice.call(outputElements).forEach(function(elem){
    outputs[elem.dataset.color] = elem;
});

var getRangeValues = function(){
    return ["red", "green", "blue"].map(function(color){
        return outputs[color].value;
    });
};

// set controll event listeners
var rangeElements = document.querySelectorAll(".color-range");
Array.prototype.slice.call(rangeElements).forEach(function(elem) {
    elem.addEventListener("change", function(event){
        var color = event.currentTarget.dataset.color;
        var value = event.currentTarget.value;
        outputs[color].value = value;
        makeImageAdjustment(getRangeValues);
        drawFromBuffer();
    });
});

// load an image
sourceImage.addEventListener("load", function(e) {
    ctx.drawImage(sourceImage,0,0);
    originalImage = ctx.getImageData(0,0,400,400);
    ctx.putImageData(imageBuffer, 0, 0);
});

sourceImage.src=sourceImagePath;

// image manipulation
var makeImageAdjustment = function(rgb) {
    // move through the original image, sum rgb values, put result in imageBuffer
    for (var i = 0; i < originalImage.length; i++) {
        var mod = i%4;
        if (mod === 3) {
            imageBuffer[i] = originalImage[i];
        } else {
            imageBuffer[i] = originalImage[i] + rgb[mod];
        }
    }
};

var drawFromBuffer = function(){
    ctx.setImageData(imageBuffer,0,0,400,400);
};