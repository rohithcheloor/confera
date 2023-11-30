import React, { Component } from "react";
import { Container, Row, Col, Form, Button, Tabs, Tab } from "react-bootstrap";
import "../assets/css/login.css";
import { api_post } from "../utilities/apiRequest";
import { LoginUser, setLoggedIn } from "../redux/action/loginActions";
import { connect } from "react-redux";
import { toast } from "react-toastify";
import Checkout from "./Checkout";

class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      orglogo: null,
      orgName: null,
      roomId: "",
      password: "",
      username: "",
      enableSecureRoom: false,
      userId: "",
      tabState: "join",
    };
  }
  componentDidMount() {
    let orglogo = process.env.REACT_APP_COMPANY_LOGO;
    let orgName = process.env.REACT_APP_COMPANY_NAME;
    if (this.state.orgName === null) {
      if (
        String(orgName).trim() !== "" &&
        String(orgName).toLowerCase().trim() !== "confera"
      ) {
        orgName = "Confera for " + orgName;
      } else {
        if (!orgName || String(orgName).trim() === "") {
          orgName = "Confera";
        }
      }
      if (!orglogo || String(orglogo).trim() === "") {
        orglogo = null;
      }
      this.setState({
        orgName: String(orgName).toUpperCase(),
        orglogo: orglogo,
      });
    }
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.state.tabState !== prevState.tabState) {
      if (this.state.tabState === "join") {
        this.setState({ roomId: "" });
      } else {
        api_post("api/generate-room-id").then((res) => {
          if (res.data) {
            this.setState({ roomId: res.data.roomId });
          } else {
            if (res.message) {
              toast.error(res.message, {
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
        });
      }
    }
    if (this.state.roomId !== prevState.roomId) {
      const sanitizedRoomId = this.sanitizeRoomIdInput(this.state.roomId);
      this.setState({ roomId: sanitizedRoomId });
    }
  }

  handleRoomPrivacyChange = async (enableSecureRoom = false) => {
    if (this.state.tabState === "create") {
      await api_post("api/generate-room-id", { enableSecureRoom }).then(
        (res) => {
          if (res.data) {
            this.setState({ roomId: res.data.roomId });
          } else {
            if (res.message) {
              toast.error(res.message, {
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
        }
      );
    }
  };

  handleInputChange = (e) => {
    const { name, value, type } = e.target;
    this.setState({
      [name]: type === "checkbox" ? e.target.checked : value,
    });
    if (type === "checkbox") {
      this.handleRoomPrivacyChange(e.target.checked);
    }
  };

  handleDisplayNameValidation = () => {
    if (!this.state.username || String(this.state.username).trim() === "") {
      toast.error("Please Enter a display name", { theme: "colored" });
      return false;
    } else {
      return true;
    }
  };

  handleCreateRoom = async () => {
    if (this.handleDisplayNameValidation()) {
      const createRoom = await api_post("api/create-room", {
        roomId: this.state.roomId,
        password: this.state.password,
        enableSecureRoom: this.state.enableSecureRoom,
      });
      if (createRoom.data && createRoom.data.roomId) {
        this.props.loginUser(
          createRoom.data.roomId,
          this.state.username,
          createRoom.data.isPrivateRoom,
          createRoom.data.joinLink,
          true
        );
      } else {
        if (createRoom.data && createRoom.data.message) {
          toast.error(createRoom.data.message, {
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
    }
  };

  handleJoinRoom = async () => {
    if (this.handleDisplayNameValidation()) {
      const authenticateRoom = await api_post("api/room/authenticate", {
        roomId: this.state.roomId,
        password: this.state.password,
        secureRoom: this.state.enableSecureRoom,
      });
      if (authenticateRoom.data && authenticateRoom.data.success) {
        this.props.loginUser(
          this.state.roomId,
          this.state.username,
          this.state.enableSecureRoom,
          authenticateRoom.data.joinLink,
          true
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
    }
  };

  handleJoinRoomWithLink = () => {
    if (this.handleDisplayNameValidation()) {
      const joinLink = String(this.props.joinLink).split("/").reverse().at(0);
      this.props.loginUser(
        this.props.roomId,
        this.state.username,
        this.props.enableSecureRoom,
        joinLink,
        true
      );
    }
  };

  sanitizeRoomIdInput = (roomId) => {
    let sanitizedInput = roomId.replace(/[^\d]/g, "");
    let formattedInput = "";
    for (let i = 0; i < sanitizedInput.length; i += 4) {
      formattedInput += sanitizedInput.slice(i, i + 4) + "-";
    }
    formattedInput = formattedInput.slice(0, -1);
    return formattedInput;
  };
  render() {
    return (
      <Container
        className="d-grid align-items-center justify-content-center"
        style={{ height: "100vh" }}
      >
        {this.state.orglogo && (
          <Row>
            <div className="company-logo-container">
              <img
                src={this.state.orglogo}
                alt="Company Logo"
                className="company-logo"
              />
            </div>
          </Row>
        )}
        <Row>
          <h1 className="text-center text-white">{this.state.orgName}</h1>
        </Row>
        <Row style={{ padding: "1em" }}>
          <Col className="uname-container">
            <Form>
              <Form.Group controlId="userName">
                <Form.Label>Display Name:</Form.Label>
                <Form.Control
                  type="text"
                  name="username"
                  value={this.state.username}
                  onChange={this.handleInputChange}
                  required
                />
              </Form.Group>
            </Form>
          </Col>
        </Row>
        {!this.props.isLoggedIn && this.props.joinLink && (
          <Row>
            <Button
              onClick={() => this.handleJoinRoomWithLink()}
              variant="primary"
              className="mt-3"
            >
              Join Room
            </Button>
          </Row>
        )}
        {!this.props.isLoggedIn && !this.props.joinLink && (
          <Row style={{ padding: "1em" }}>
            <Tabs
              id="room-tabs"
              activeKey={this.state.tabState}
              onSelect={(e) => this.setState({ tabState: e })}
            >
              <Tab eventKey="join" title="Join Room">
                <Col>
                  <Form>
                    <Form.Group controlId="roomIdJoin">
                      <Form.Label>Room ID:</Form.Label>
                      <Form.Control
                        type="text"
                        name="roomId"
                        value={this.state.roomId}
                        onChange={this.handleInputChange}
                        maxLength="14"
                        pattern="\d{4}-\d{4}-\d{4}"
                        placeholder="1234-5678-9012"
                      />
                    </Form.Group>

                    <Form.Group controlId="passwordJoin">
                      <Form.Label>Password:</Form.Label>
                      <Form.Control
                        type="password"
                        name="password"
                        value={this.state.password}
                        onChange={this.handleInputChange}
                        disabled={!this.state.enableSecureRoom}
                      />
                    </Form.Group>

                    <Form.Group
                      controlId="enableSecureRoomJoin"
                      style={{ paddingTop: "1em" }}
                    >
                      <Form.Check
                        type="checkbox"
                        label="Have a Password?"
                        name="enableSecureRoom"
                        checked={this.state.enableSecureRoom}
                        onChange={this.handleInputChange}
                      />
                    </Form.Group>
                  </Form>

                  <Button
                    onClick={() => this.handleJoinRoom()}
                    variant="primary"
                    className="mt-3"
                    disabled={this.state.roomId.length !== 14}
                  >
                    Join Room
                  </Button>
                </Col>
              </Tab>
              <Tab eventKey="create" title="Create Room">
                <Col>
                  <Form>
                    <Form.Group controlId="roomId">
                      <Form.Label>Room ID:</Form.Label>
                      <Form.Control
                        type="text"
                        name="roomId"
                        value={this.state.roomId}
                        disabled
                      />
                    </Form.Group>

                    <Form.Group controlId="password">
                      <Form.Label>Password:</Form.Label>
                      <Form.Control
                        type="password"
                        name="password"
                        value={this.state.password}
                        onChange={this.handleInputChange}
                        disabled={!this.state.enableSecureRoom}
                      />
                    </Form.Group>

                    <Form.Group
                      controlId="enableSecureRoom"
                      style={{ paddingTop: "1em" }}
                    >
                      <Form.Check
                        type="checkbox"
                        label="Enable Secure Room"
                        name="enableSecureRoom"
                        checked={this.state.enableSecureRoom}
                        onChange={this.handleInputChange}
                      />
                    </Form.Group>
                  </Form>

                  <Button
                    onClick={() => this.handleCreateRoom()}
                    variant="primary"
                    className="mt-3"
                  >
                    Create Room
                  </Button>
                </Col>
              </Tab>
            </Tabs>
          </Row>
        )}
        <Checkout />
      </Container>
    );
  }
}
const mapStateToProps = (state) => {
  const { roomId, username, secureRoom, joinLink, isLoggedIn } = state.login;
  return {
    roomId,
    username,
    secureRoom,
    joinLink,
    isLoggedIn,
  };
};
const mapDispatchToProps = (dispatch) => {
  return {
    loginUser: (roomId, username, secureRoom, joinLink, isLoggedIn) =>
      dispatch(LoginUser(roomId, username, secureRoom, joinLink, isLoggedIn)),
    setUserLoggedIn: () => dispatch(setLoggedIn()),
  };
};
export default connect(mapStateToProps, mapDispatchToProps)(Login);
