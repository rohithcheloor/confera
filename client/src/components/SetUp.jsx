import React from "react";

function SetUp() {
  return (
    <section>
        <div class="swal2-container swal2-center swal2-backdrop-show" style={{overflow: "auto"}}>
        <div class="swal2-popup">
        <h2 class="swal2-title" id="swal2-title" style={{display: "block"}}>Confera</h2>
        <div id="initUser" class="init-user">
            {/* <p>Please allow the camera & microphone access to use this app.</p> */}
            <div class="container">
                <video
                    id="initVideo"
                    playsinline="true"
                    autoplay=""
                    class="mirror"
                    poster="../images/loader.gif"
                    style={{width:"100%"}}
                ></video>
            </div>
            <button id="initVideoButton" class="fas fa-video"></button>
            <button id="initAudioButton" class="fas fa-microphone"></button>
                 
            <select id="initVideoSelect" class="form-select text-light bg-dark">
                <option>📹 HP TrueVision HD Camera </option>
            </select>
            <select id="initMicrophoneSelect" class="form-select text-light bg-dark">
                <option>🎤 Default - Microphone Array (Intel® Smart Sound Technology for Digital Microphones)</option>
                <option>🎤 Communications - Microphone Array (Intel® Smart Sound Technology for Digital Microphones)</option>
                <option>🎤 Microphone Array (Intel® Smart Sound Technology for Digital Microphones)</option>
            </select>
            <select id="initSpeakerSelect" class="form-select text-light bg-dark">
                <option>🔈 Default - Speaker (Realtek(R) Audio)</option>
                <option>🔈 Communications - Speaker (Realtek(R) Audio)</option>
                <option>🔈 Speaker (Realtek(R) Audio)</option>
            </select>
            <input placeholder="Enter your name" class="swal2-input" type="text" maxlength="36" style={{ borderRadius: "6px" ,marginTop: "15px",marginRight: "15px",width:"50%",height:"50px"}}/>
            <button class="button button-primary" style={{width:"150px"}}>Join meeting</button>
        </div>
        </div>
        </div>
    </section>
  
  );
}

export default SetUp;
