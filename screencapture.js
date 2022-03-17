//Global objects
const frames = [];
const start = document.getElementById("start");
const stop = document.getElementById("stop");
const a = document.createElement("a");
let video = document.createElement("video");

let recorder, stream;


async function startRecording() {
  try {
    stream = await navigator.mediaDevices.getDisplayMedia();
    recorder = new MediaRecorder(stream);

    const chunks = [];
    //push video in chunks to array (callback funtion whenever recorder stops, pauses, time slice)
    if (recorder) {
      recorder.ondataavailable = e => {
        chunks.push(e.data);
      };

      //callback function when recorder.stop is called.
      recorder.onstop = e => {
        downloadVideo(chunks);
        console.log(chunks);
        stopStream(stream);
      };
      recorder.onstart = e => {
        setTimeout(() => {
          recorder.stop();
        }, 200);

      };
      recorder.start();
    }
  } catch (e) {
    setButtonDisplay('stop');
    window.alert("An Error has occurred! You need to provide permission for screen capture or Maybe your browser doesn't support this API?");
    //console.error(e);
  }
}
 //stop streams to stop recording
function stopStream(stream){
  stream.getTracks().forEach( track => track.stop() );
}

////take frame from video
function downloadVideo(chunks) {
   //blob of video
  const completeBlob = new Blob(chunks, {type: chunks[0].type});
  //url from blob
  video.src = URL.createObjectURL(completeBlob);
  video.id = "video";
  video.controls = true;

  video.src = video.src + '#t=0.1';
  const canvas1 = document.getElementById('canvas');
  video.onloadeddata = (ev) =>{
    console.log("Video data");
    console.log(video.videoWidth);
    canvas1.width = video.videoWidth;
    canvas1.height = video.videoHeight;
    canvas1.getContext('2d').drawImage(video, 0, 0, canvas1.width, canvas1.height);
    const playImage = new Image();
    playImage.onload = () => {
      const startX = (video.videoWidth / 2) - (playImage.width / 2);
      const startY = (video.videoHeight / 2) - (playImage.height / 2);
      canvas1.getContext('2d').drawImage(playImage, startX, startY, playImage.width, playImage.height);
    };

    let image = canvas.toDataURL("image/png", 1.0).replace("image/png", "image/octet-stream");
    a.download = "screenshot.png";
    a.href = image;
    a.click();
  }

  setButtonDisplay('stop');
}


//start recording clicked
start.addEventListener("click", () => {
  setButtonDisplay('start');
  startRecording();
});

//stop recording clicked
stop.addEventListener("click", () => {
  setButtonDisplay('stop');
  recorder.stop();
  stream.getVideoTracks()[0].stop();
});

//manage button display
function setButtonDisplay(event){
  if(event === 'start')
  {
    start.setAttribute("disabled", true);
    stop.removeAttribute("disabled");
  }
  else{
    stop.setAttribute("disabled", true);
    start.removeAttribute("disabled");
  }
}
