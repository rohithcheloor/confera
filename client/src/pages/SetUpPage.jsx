import React from "react";

import Header from "../components/Header";
import Footer from "../components/Footer";
import Hero from "../components/Hero";
import SetUp from "../components/SetUp";

const SetUpPage = () => {
  return (
   
    <html lang="en">
        <head>
            {/* <!-- Title and Icon --> */}
    
            <title>MiroTalk SFU - Room Video Calls, Messaging and Screen Sharing.</title>
            <link rel="shortcut icon" href="../images/logo.svg" />
            <link rel="apple-touch-icon" href="../images/logo.svg" />
    
            {/* <!-- Meta Information --> */}
    
            <meta charset="utf-8" />
            <meta name="viewport" content="width=device-width, initial-scale=1.0" />
            <meta
                name="description"
                content="MiroTalk SFU powered by WebRTC and mediasoup, Real-time Simple Secure Fast video calls, messaging and screen sharing capabilities in the browser."
            />
            <meta
                name="keywords"
                content="webrtc, chatGPT, miro, mediasoup, mediasoup-client, self hosted, voip, sip, real-time communications, chat, messaging, meet, webrtc stun, webrtc turn, webrtc p2p, webrtc sfu, video meeting, video chat, video conference, multi video chat, multi video conference, peer to peer, p2p, sfu, rtc, alternative to, zoom, microsoft teams, google meet, jitsi, meeting"
            />
    
            {/* <!-- https://ogp.me --> */}
            <meta property="og:type" content="app-webrtcnpm" />
            <meta property="og:site_name" content="MiroTalk SFU" />
            <meta property="og:title" content="Click the link to make a call." />
            <meta
                property="og:description"
                content="MiroTalk SFU calling provides real-time video calls, messaging and screen sharing."
            />
            <meta property="og:image" content="https://sfu.mirotalk.com/images/mirotalksfu.png" />
    
            {/* <!-- StyleSheet --> */}
    
            <link rel="stylesheet" href="./css/Room.css" />
            <link rel="stylesheet" href="../css/VideoGrid.css" />
    
            {/* <!-- https://cdnjs.com/libraries/font-awesome --> */}
    
            <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.1.1/css/all.min.css" />
    
            {/* <!-- https://animate.style 4 using for swal fadeIn-Out --> */}
            <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/animate.css/4.1.1/animate.min.css" />
    
            {/* <!-- Bootstrap 5 --> */}
    
            <link rel="stylesheet" href="https://www.w3schools.com/w3css/4/w3.css" />
    
            {/* <!-- flatpickr  https://flatpickr.js.org/themes/ --> */}
    
            <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/flatpickr/dist/flatpickr.min.css" />
            <link rel="stylesheet" href="https://npmcdn.com/flatpickr/dist/themes/airbnb.css" />
    
            {/* <!-- Bootstrap 5 --> */}
    
            <link
                href="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/css/bootstrap.min.css"
                rel="stylesheet"
                integrity="sha384-EVSTQN3/azprG1Anm3QDgpJLIm9Nao0Yz1ztcQTwFspd3yD65VohhpuuCOmLASjC"
                crossorigin="anonymous"
            />
            <script
                src="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/js/bootstrap.bundle.min.js"
                integrity="sha384-MrcW6ZMFYlzcLA8Nl+NtUVF0sA7MsXsP1UyJoMp4YLEuNSfAP+JcXn/tWtIaxVXM"
                crossorigin="anonymous"
            ></script>
    
            <script async src="../js/Umami.js"></script>
    
            {/* <!-- Js scripts https://cdn.jsdelivr.net --> */}
    
            {/* <script defer src="/socket.io/socket.io.js"></script>
            <script defer src="../sfu/MediasoupClient.js"></script>
            <script defer src="https://rawgit.com/leizongmin/js-xss/master/dist/xss.js"></script>
            <script defer src="../js/LocalStorage.js"></script>
            <script defer src="../js/Rules.js"></script>
            <script defer src="../js/Helpers.js"></script>
            <script defer src="../js/Room.js"></script>
            <script defer src="../js/RoomClient.js"></script>
            <script defer src="../js/SpeechRec.js"></script>
            <script defer src="../js/VideoGrid.js"></script>  */}
            <script defer src="https://cdn.jsdelivr.net/npm/marked/marked.min.js"></script>
            <script defer src="https://cdn.jsdelivr.net/npm/detectrtc@1.4.1/DetectRTC.min.js"></script>
            <script defer src="https://cdn.jsdelivr.net/npm/qrious@4.0.2/dist/qrious.min.js"></script>
            <script defer src="https://cdn.jsdelivr.net/npm/fabric@5.3.0-browser/dist/fabric.min.js"></script>
            <script defer src="https://cdn.jsdelivr.net/npm/sweetalert2@11.4.8"></script>
            <script defer src="https://cdn.jsdelivr.net/npm/emoji-mart@latest/dist/browser.js"></script>
            <script defer src="https://unpkg.com/@popperjs/core@2"></script>
            <script defer src="https://unpkg.com/tippy.js@6"></script>
            <script defer src="https://cdn.jsdelivr.net/npm/flatpickr"></script>
            <script defer src="https://cdn.jsdelivr.net/npm/pdfjs-dist@3.11.174/build/pdf.min.js"></script>
        </head>
        <body>

            {/* <div id="loadingDiv" class="center pulsate">
                <h1>Loading</h1>
                <img src="../images/loading.gif" style={{width: "400px"}}/>
                    <pre>
                    Please allow the camera or microphone
                    access to use this app.
                </pre>
            </div> */}
    
            <Hero />
            {/* ... SetUp section ... */}
            <SetUp />
            <script src="https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit"></script>
        </body>
    </html>
    
  );
};

export default SetUpPage;
