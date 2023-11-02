import React from "react";
import Popup from "reactjs-popup";
import "../../src/assets/css/roomDetails.css";
import { connect } from "react-redux";

const RoomDetailsMenu = (props) => {
  const { userData, isPopupOpen, setIsPopOpen } = props;
  const { roomId, joinlink } = userData;

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
              <td>{!joinlink ? "Unavailable" : joinlink}</td>
            </tr>
          </table>
        </Popup>
      )}
    </div>
  );
};
const mapStateToProps = (state) => {
  const { roomId, joinlink } = state.login;
  return {
    userData: {
      roomId,
      joinlink,
    },
  };
};
export default connect(mapStateToProps)(RoomDetailsMenu);
