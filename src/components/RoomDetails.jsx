import React, { useState } from "react";
import Popup from "reactjs-popup";
import { connect } from "react-redux";
import { Button } from "react-bootstrap";
import "../assets/css/popup.css";
const RoomDetailsMenu = (props) => {
  const { userData, isPopupOpen, setIsPopOpen } = props;
  const { roomId, joinLink } = userData;
  const [copiedMessage, setCopiedMessage] = useState("");

  const copyLink = () => {
    if (joinLink) {
      navigator.clipboard.writeText(joinLink).then(() => {
        setCopiedMessage("Link copied to clipboard");
        setTimeout(() => {
          setCopiedMessage("");
        }, 1500);
      });
    }
  };
  const showCopyMessage = () => {
    setCopiedMessage("Click to copy");
  };
  const hideCopyMessage = () => {
    setCopiedMessage("");
  };

  return (
    <div className="room-details-menu">
      <div className="Heading">Room Information</div>
      <table className="room-details">
        <tbody>
          <tr>
            <td>Room id: </td>
            <td>{roomId}</td>
          </tr>
          <tr>
            <td>Join link: </td>
            <td>
              {!joinLink ? (
                "Unavailable"
              ) : (
                <div title="Click to copy">
                  <a onClick={copyLink} style={{ cursor: "pointer" }}>
                    {joinLink}
                  </a>
                </div>
              )}
            </td>
          </tr>
          <tr>
            <td></td>
            <td></td>
          </tr>
          <tr>
            <td colSpan={2}>
              <Button
                className="float-right"
                variant="danger"
                onClick={() => setIsPopOpen(false)}
              >
                Close
              </Button>
            </td>
          </tr>
        </tbody>
      </table>
      {copiedMessage && <p className="copy-message">{copiedMessage}</p>}
    </div>
  );
};
const mapStateToProps = (state) => {
  const { roomId, joinLink } = state.login;
  return {
    userData: {
      roomId,
      joinLink,
    },
  };
};
export default connect(mapStateToProps)(RoomDetailsMenu);
