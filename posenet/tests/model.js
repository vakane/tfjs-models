export async function LoadModel(architecture){
    console.log('loading posenet...')
    let net;

    if (architecture === 'MobileNet'){
        console.log('Loading MobileNet')
        net = await posenet.load({
            architecture: 'MobileNetV1',
            outputStride: 16,
            inputResolution: { width: 640, height: 480 },
            multiplier: 0.75
          });
    }
    else if (architecture === 'ResNet'){
        console.log('Loading ResNet')
        net = await posenet.load({
            architecture: 'ResNet50',
            outputStride: 32,
            inputResolution: { width: 257, height: 200 },
            quantBytes: 2
          });
    }
    else {
        console.log('Unknown architecture ' + architecture)
        console.log('Loading MobileNet')
        net = await posenet.load({
            architecture: 'MobileNetV1',
            outputStride: 16,
            inputResolution: { width: 640, height: 480 },
            multiplier: 0.75
          });
    }

    console.log('model load completed')

    return net
}