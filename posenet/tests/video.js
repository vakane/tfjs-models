export async function setupCamera(videoWidth, videoHeight) {
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      throw new Error(
          'Browser API navigator.mediaDevices.getUserMedia not available');
    }
  
    const video = document.getElementById('webcam');
    video.width = videoWidth;
    video.height = videoHeight;
  
    const stream = await navigator.mediaDevices.getUserMedia({
      'audio': false,
      'video': {
        facingMode: 'user',
        width: videoWidth,
        height: videoHeight,
      },
    });
    video.srcObject = stream;
  
    return new Promise((resolve) => {
      video.onloadedmetadata = () => {
        resolve(video);
      };
    });
  }
  
 export async function loadVideo(videoWidth = 480, videoHeight = 640) {
    const video = await setupCamera(videoWidth, videoHeight);
    video.play();
  
    return video;
  }