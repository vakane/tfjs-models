import {drawPose} from './drawing.js'
import {LoadModel} from './model.js'

//const webcamElement = document.getElementById('webcam');
const config = {
    resizeWidth: 224,
    resizeHeight: 224
};

let net;

async function run(architecture = 'MobileNet'){
    // Load model 
    net = await LoadModel(architecture)

    const img = new Image()
    img.src = './img/IMG_3783.png'

    img.onload = function() {
        const ctx = document.getElementById('canvas').getContext('2d');
        ctx.drawImage(img, 0, 0);
    }

    //Estimate simgle pose
    const pose = await net.estimateSinglePose(img, {
        flipHorizontal: false
    });

    console.log(pose)
    //plot points on canvas
    drawPose(pose)
}

run();