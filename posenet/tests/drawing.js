const threshold = 0.6

export function drawCoordinates(point){
    if (point.score > threshold){
        const ctx = document.getElementById('canvas').getContext('2d');
        ctx.globalCompositeOperation = "destination-over";
        ctx.fillStyle = "#ff2626"; // Red color
        ctx.beginPath();
        ctx.arc(point.position.x, point.position.y, 3, 0, Math.PI * 2);
        ctx.fill();
    }
}

export function drawLines(point0, point1){	
    if ((point0.score > threshold) && (point1.score > threshold)){
        drawCoordinates(point0)
        drawCoordinates(point1)

        const ctx = document.getElementById('canvas').getContext('2d');
        ctx.globalCompositeOperation = "destination-over";
        ctx.strokeStyle = "#ff2626"; // Red color
        ctx.moveTo(point0.position.x, point0.position.y);
        ctx.lineTo(point1.position.x, point1.position.y);
        ctx.stroke();
    }
    
}

export function drawPose(pose){
    const points = pose.keypoints
    const arrayLength = points.length;
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