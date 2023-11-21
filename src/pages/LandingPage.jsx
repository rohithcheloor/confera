import React from "react";

import Header from "../components/Header";
import Footer from "../components/Footer";
import Hero from "../components/Hero";
import CTA from "../components/CTA";

const LandingPage = () => {
  return (
    <html lang="en" className="no-js">
      <head>
        {/* Title and Icon  */}

        <title>Confera</title>
        <link rel="shortcut icon" href="../images/logo.svg" />
        <link rel="apple-touch-icon" href="../images/logo.svg" />

        {/* Meta Information  */}

        <meta charset="utf-8" />
        <meta http-equiv="X-UA-Compatible" content="IE=edge" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />

        <meta
          name="description"
          content="MiroTalk SFU powered by WebRTC and mediasoup, Real-time Simple Secure Fast video calls, messaging and screen sharing capabilities in the browser."
        />
        <meta
          name="keywords"
          content="webrtc, miro, mediasoup, mediasoup-client, self hosted, voip, sip, real-time communications, chat, messaging, meet, webrtc stun, webrtc turn, webrtc p2p, webrtc sfu, video meeting, video chat, video conference, multi video chat, multi video conference, peer to peer, p2p, sfu, rtc, alternative to, zoom, microsoft teams, google meet, jitsi, meeting"
        />

        {/* https://ogp.me  */}

        <meta property="og:type" content="app-webrtc" />
        <meta property="og:site_name" content="MiroTalk SFU" />
        <meta property="og:title" content="Click the link to make a call." />
        <meta
          property="og:description"
          content="Confera provides real-time video calls, messaging and screen sharing."
        />
        <meta property="og:image" content="" />

        {/* StyleSheet  */}

        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css?family=IBM+Plex+Sans:400,600"
        />
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.1.1/css/all.min.css"
        />
        <link rel="stylesheet" href="../css/landing.css" />

        {/* Js scripts  */}

        <script async src="../js/Umami.js"></script>
        <script src="https://unpkg.com/animejs@3.0.1/lib/anime.min.js"></script>
        <script src="https://unpkg.com/scrollreveal@4.0.0/dist/scrollreveal.min.js"></script>
        <script src="https://rawgit.com/leizongmin/js-xss/master/dist/xss.js"></script>
      </head>
      <body className="is-boxed has-animations">
        <div className="body-wrap">
          <Header />

          <main>
            <Hero />
            {/* ... CTA section ... */}
            <CTA />
          </main>
        </div>
        <script defer src="../js/landing.js"></script>
        <script defer src="../js/newRoom.js"></script>
        <script async defer src="https://buttons.github.io/buttons.js"></script>
      </body>
    </html>
  );
};

export default LandingPage;
