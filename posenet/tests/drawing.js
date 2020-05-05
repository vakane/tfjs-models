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
        const point1 = {'position': {'x': 480, 'y': y1 + (y2 - y1) / (x2 - x1) * (480 - x1)}, 'score': 1}

        drawLines(point0, point1, "#00FFFF", false)
    }
}