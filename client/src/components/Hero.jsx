import React from "react";

function Hero() {
  return (
    <section className="hero reveal-from-bottom">
      <div className="container">
        <div className="hero-inner">
          <div className="hero-figure anime-element">
            <div
              className="hero-figure-box hero-figure-box-02"
              data-rotation="-45deg"
            ></div>
            <div
              className="hero-figure-box hero-figure-box-03"
              data-rotation="0deg"
            ></div>
            <div
              className="hero-figure-box hero-figure-box-04"
              data-rotation="-135deg"
            ></div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Hero;
