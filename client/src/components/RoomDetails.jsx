import React from "react";
import Popup from "reactjs-popup";
import "../../src/assets/css/roomDetails.css";
import { connect } from "react-redux";

const RoomDetailsMenu = (props) => {
  const { userData, isPopupOpen, setIsPopOpen } = props;
  const { roomId, joinLink } = userData;

  return (
    <div className="room-details-menu" style={{ background: "white" }}>
      {isPopupOpen && (
        <Popup
          open={isPopupOpen}
          contentStyle={{
            background: "black",
            color: "white",
            padding: "120px 120px",
          }}
          closeOnDocumentClick
          onClose={() => setIsPopOpen(false)}
        >
          <table className="room-details">
            <tr>
              <td>Room id: </td>
              <td>{roomId}</td>
            </tr>
            <tr>
              <td>Join link: </td>
              <td>
                {!joinLink ? "Unavailable" : <a target="_blank" href={joinLink}>{joinLink}</a>}
              </td>
            </tr>
          </table>
        </Popup>
      )}
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
