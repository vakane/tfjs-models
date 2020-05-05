import {drawPose, findFloor, armLine, dominantLeg} from './drawing.js'
import {LoadModel} from './model.js'

const sleep = sec => { 
    return new Promise(resolve => setTimeout(resolve, sec * 1e3)); 
}; 

let net;

async function run(architecture = 'MobileNet'){
    // Load model 
    net = await LoadModel(architecture)

    const images = ['./img/warrior_2/img1.jpg',
                    './img/warrior_2/img2.jpg',
                    './img/warrior_2/img3.jpg',
                    './img/warrior_2/img4.jpg',
                    './img/warrior_2/img5.jpg',
                    './img/warrior_2/img6.jpg',
                    './img/warrior_2/img7.jpg',
                    './img/warrior_2/img8.jpg'
                    ]
    var i = 0;

    while(true){
        const img = new Image()
        img.src = images[i]

        const canvas = document.getElementById('canvas')
        const ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        img.onload = function() {
            const canvas = document.getElementById('canvas')
            const ctx = canvas.getContext('2d');
            // ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.drawImage(img, 0, 0);
        }

        await sleep(1);
        if (img.naturalWidth > 0){
            //Estimate simgle pose
            const pose = await net.estimateSinglePose(img, {
                flipHorizontal: false
            });

            //console.log(pose)
            //plot points on canvas
            drawPose(pose)
            findFloor(pose)
            armLine(pose)
            dominantLeg(pose)

            await sleep(3);
        }
        

        await sleep(1);
        i = (i + 1) % images.length;

    }
    
}

run('ResNet');
