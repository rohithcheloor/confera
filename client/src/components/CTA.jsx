import React from "react";
import {Link} from "react-router-dom";

function CTA() {
  return (
    <section className="cta section">
      <div class="container">
        <div class="cta-inner section-inner br-12">
          <div>
            <div class="mb-24">
              <label for="roomName"></label>
              <div class="form-group-desktop">
                <input
                  id="roomName"
                  class="form-input"
                  type="text"
                  maxlength="36"
                  value=""
                  style={{ borderRadius: "6px" }}
                />
              </div>
            </div>

            <button id="joinRoomButton" class="button button-primary pulse">
              <Link to="/setup">Join Room</Link>
            </button>
            {"  "}
            <button
              id="genRoomButton"
              class="button button-primary br-6 mr-8 mb-8 fas fa-arrows-rotate"
            ></button>
            <div id="lastRoomContainer" class="last-room">
              <span>Your recent room:</span>
              <a id="lastRoom"></a>
            </div>
          </div>
          <h3 class="section-title mt-0">
            Pick a room name.
            <br />
            How about this one?
          </h3>
        </div>
      </div>
    </section>
  );
}

export default CTA;
