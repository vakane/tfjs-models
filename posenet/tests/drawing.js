const threshold = 0.6

export function drawCoordinates(point, color="#ff2626"){
    if (point.score > threshold){
        const ctx = document.getElementById('canvas').getContext('2d');
        ctx.globalCompositeOperation = "destination-over";
        ctx.fillStyle = color; // Red color
        ctx.beginPath();
        ctx.arc(point.position.x, point.position.y, 3, 0, Math.PI * 2);
        ctx.fill();
    }
}

export function drawLines(point0, point1, color="#ff2626", markers=true){	
    if ((point0.score > threshold) && (point1.score > threshold)){
        if (markers){
            drawCoordinates(point0, color)
            drawCoordinates(point1, color)
        }
        const ctx = document.getElementById('canvas').getContext('2d');
        ctx.globalCompositeOperation = "destination-over";
        ctx.strokeStyle = color; // Red color
        ctx.moveTo(point0.position.x, point0.position.y);
        ctx.lineTo(point1.position.x, point1.position.y);
        ctx.stroke();
    }
    
}

export function drawPose(pose){
    const points = pose.keypoints
    /*
    0	nose
    1	leftEye
    2	rightEye
    3	leftEar
    4	rightEar
    5	leftShoulder
    6	rightShoulder
    7	leftElbow
    8	rightElbow
    9	leftWrist
    10	rightWrist
    11	leftHip
    12	rightHip
    13	leftKnee
    14	rightKnee
    15	leftAnkle
    16	rightAnkle
    */
    //face
    drawCoordinates(points[0])
    //shoulders
    drawLines(points[5], points[6])
    //left arm
    drawLines(points[5], points[7])
    drawLines(points[7], points[9])
    //right arm
    drawLines(points[6], points[8])
    drawLines(points[8], points[10])
    //torso
    drawLines(points[5], points[11])
    drawLines(points[11], points[12])
    drawLines(points[12], points[6])
    //left leg
    drawLines(points[11], points[13])
    drawLines(points[13], points[15])
    //right leg
    drawLines(points[12], points[14])
    drawLines(points[14], points[16])
}

export function findFloor(pose){
    const points = pose.keypoints
    //if ankles are on the image
    if ((points[15].score > threshold) && (points[16].score > threshold)){
        const x1 = points[15].position.x
        const y1 = points[15].position.y

        const x2 = points[16].position.x
        const y2 = points[16].position.y

        //y = y1 + (y2 - y1) / (x2 - x1) * (x - x1)

        const point0 = {'position': {'x': 0, 'y': y1 + (y2 - y1) / (x2 - x1) * ( - x1)}, 'score': 1}
        const point1 = {'position': {'x': 640, 'y': y1 + (y2 - y1) / (x2 - x1) * (640 - x1)}, 'score': 1}

        drawLines(point0, point1, "#00FFFF", false)
    }
}

export function armLine(pose){
    const points = pose.keypoints
    //if ankles and shoulders are on the image
    if ((points[15].score > threshold) 
        && (points[16].score > threshold)
        && (points[5].score > threshold)
        && (points[6].score > threshold)
        ){
            const x1 = points[15].position.x
            const y1 = points[15].position.y

            const x2 = points[16].position.x
            const y2 = points[16].position.y

            //mid collarbone
            const x0 = (points[5].position.x + points[6].position.x) / 2
            const y0 = (points[5].position.y + points[6].position.y) / 2

            //y = y0 + (y2 - y1) / (x2 - x1) * (x - x0)

            const point0 = {'position': {'x': 0, 'y': y0 + (y2 - y1) / (x2 - x1) * ( - x0)}, 'score': 1}
            const point1 = {'position': {'x': 640, 'y': y0 + (y2 - y1) / (x2 - x1) * (640 - x0)}, 'score': 1}

            drawLines(point0, point1, "#00FFFF", false)
    }   
}

export function dominantLeg(pose){
    const points = pose.keypoints
    //if hips, knees and ankles are on the image
    if ((points[11].score > threshold) 
        && (points[12].score > threshold)
        && (points[13].score > threshold)
        && (points[14].score > threshold)
        && (points[15].score > threshold)
        && (points[16].score > threshold)
        ){
        
            const x1 = points[15].position.x
            const y1 = points[15].position.y
    
            const x2 = points[16].position.x
            const y2 = points[16].position.y

            //mid pelvis
            const x0 = (points[11].position.x + points[12].position.x) / 2
            const y0 = (points[11].position.y + points[12].position.y) / 2

            //knee coordinat if parallel to the floor
            const y3 = points[13].position.y
            const y4 = points[14].position.y

            const y3_hat = y0 + (y2 - y1) / (x2 - x1) * (x1 - x0)
            const y4_hat = y0 + (y2 - y1) / (x2 - x1) * (x2 - x0)

            const point0 = {'position': {'x': x0, 'y': y0 }, 'score': 1};
            let point1;
            
            if (Math.abs(y3 - y3_hat) < Math.abs(y4 - y4_hat)){
                point1 = {'position': {'x': x1, 'y': y3_hat}, 'score': 1}

                //intercept with floor line
                //y = y1 + (y2 - y1) / (x2 - x1) * (x - x1)
                let point2;
                if (y1 == y2){
                    point2 = {'position': {'x': x1, 'y': y1}, 'score': 1}
                }
                else{
                    //y = y3_hat + 1/k (x - x1)
                    //y = y1 + k * (x - x1)

                    //x = (y3_hat - y1) / (k + 1/k) + x1 
                    const k = (y2 - y1) / (x2 - x1)
                    const x = (y3_hat - y1) / (k + 1/k) + x1 
                    const y = y1 + k * (x - x1)
                    point2 = {'position': {'x': x, 'y': y}, 'score': 1}
                }
                drawLines(point1, point2, "#00FFFF")

            }
            else{
                point1 = {'position': {'x': x2, 'y': y4_hat}, 'score': 1}

                //intercept with floor line
                //y = y1 + (y2 - y1) / (x2 - x1) * (x - x1)
                let point2;
                if (y1 == y2){
                    point2 = {'position': {'x': x2, 'y': y2}, 'score': 1}
                }
                else{
                    //y = y3_hat + 1/k (x - x1)
                    //y = y1 + k * (x - x1)

                    //x = (y3_hat - y1) / (k + 1/k) + x1 
                    const k = (y2 - y1) / (x2 - x1)
                    const x = (y4_hat - y2) / (k + 1/k) + x2 
                    const y = y2 + k * (x - x2)
                    point2 = {'position': {'x': x, 'y': y}, 'score': 1}
                }
                drawLines(point1, point2, "#00FFFF")
            }

            drawLines(point0, point1, "#00FFFF", false)

    }
}