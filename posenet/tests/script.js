import {drawPose} from './drawing.js'
import {LoadModel} from './model.js'
import {loadVideo} from './video.js'

const videowidth = 480;
const videoheight = 640;
const fps = 25;

const sleep = sec => { 
    return new Promise(resolve => setTimeout(resolve, sec * 1e3)); 
  }; 

let net;

async function run(architecture = 'MobileNet'){
    // Load model 
    net = await LoadModel(architecture)
    const cnvs = document.getElementById('canvas')
    const ctx = cnvs.getContext('2d');

    cnvs.style.left = "0px";
    cnvs.style.top = "0px";
    cnvs.style.position = "absolute";

    let video;
    video = await loadVideo(videowidth, videoheight)


    while(true){
        if (video.readyState === video.HAVE_ENOUGH_DATA){
            ctx.clearRect(0, 0, videowidth, videoheight);
            //ctx.drawImage(video, 0, 0);

            const pose = await net.estimateSinglePose(video, {
                flipHorizontal: false
            });

            //plot points on canvas
            drawPose(pose)

            await sleep(1/fps);

        }
    }
    
 
}

run('ResNet');