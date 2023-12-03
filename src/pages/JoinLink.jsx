import { useEffect } from "react";
import { connect } from "react-redux";
import { Navigate, useParams } from "react-router-dom";
import { LoginUser } from "../redux/action/loginActions";
import { toast } from "react-toastify";
import { api_post } from "../utilities/apiRequest";

const JoinLink = (props) => {
  const { joinLink } = props;
  const { id } = useParams();
  useEffect(() => {
    const handleJoinWithLink = async () => {
      const authenticateRoom = await api_post("api/join-with-link", {
        joinLink: id,
      });
      if (authenticateRoom.data && authenticateRoom.data.success) {
        props.loginUser(
          authenticateRoom.data.roomId,
          null,
          authenticateRoom.data.isPrivateRoom ? authenticateRoom.data.password : null,
          authenticateRoom.data.isPrivateRoom,
          authenticateRoom.data.joinLink,
          false
        );
      } else {
        if (authenticateRoom.data && authenticateRoom.data.message) {
          toast.error(authenticateRoom.data.message, {
            position: "bottom-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "colored",
          });
        }
      }
    };
    if (id.trim() !== "") {
      handleJoinWithLink();
    }
  }, [id]);
  return (
    <>
      <p>Please wait while you are being redirected...</p>
      {joinLink !== null ||
        (joinLink !== "" && <Navigate to="/" replace={true} />)}
    </>
  );
};
const mapStateToProps = (state) => {
  const { joinLink } = state.login;
  return {
    joinLink,
  };
};
const mapDispatchToProps = (dispatch) => {
  return {
    loginUser: (
      roomId,
      username,
      password,
      secureRoom,
      joinLink,
      isLoggedIn
    ) =>
      dispatch(
        LoginUser(roomId, username, password, secureRoom, joinLink, isLoggedIn)
      ),
  };
};
export default connect(mapStateToProps, mapDispatchToProps)(JoinLink);
