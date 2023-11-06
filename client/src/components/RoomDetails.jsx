import React from "react";
import Popup from "reactjs-popup";
import "../../src/assets/css/roomDetails.css";
import { connect } from "react-redux";
import { Button } from "react-bootstrap";
import "../assets/css/popup.css";
const RoomDetailsMenu = (props) => {
  const { userData, isPopupOpen, setIsPopOpen } = props;
  const { roomId, joinLink } = userData;

  return (
    <div className="room-details-menu">
      <table className="room-details">
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
              <a target="_blank" href={joinLink}>
                {joinLink}
              </a>
            )}
          </td>
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
      </table>
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
