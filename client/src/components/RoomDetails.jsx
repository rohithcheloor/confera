import React from "react";
import Popup from "reactjs-popup";
import "../../src/assets/css/roomDetails.css"
import { connect } from "react-redux";


const RoomDetailsMenu = (props) =>{
    const {userData, isPopupOpen, setIsPopOpen} = props;
    const {roomId} = userData;


    return(
        <div className="room-details-menu" style={{background:"white"}}>
            {isPopupOpen && (
                <Popup 
                open={isPopupOpen} 
                closeOnDocumentClick 
                contentStyle={{
                    background:"white"
                }}
                onClose={() => setIsPopOpen(false)}>
                    <p>{roomId}</p>
                    <h3>Participants</h3>
                </Popup>
            )}
        </div>
    )

}
const mapStateToProps = (state) => {
    const { roomId } = state.login;
    return {
        userData: {
          roomId,
        }
    };    
};
export default connect(mapStateToProps)(RoomDetailsMenu);