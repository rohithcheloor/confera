import React, { Component } from 'react';
import { Container, Row, Col, Form, Button, Tabs, Tab } from 'react-bootstrap';
import axios from 'axios';
import '../assets/css/login.css';

class Login extends Component {
    constructor(props) {
        super(props);
        this.state = {
            roomId: '',
            password: '',
            username: '',
            enableSecureRoom: false,
            userId: '',
            tabState: "join"
        };
    }

    componentDidMount() {

    };

    componentDidUpdate(prevProps, prevState) {
        if (this.state.tabState !== prevState.tabState) {
            if (this.state.tabState === "join") {
                this.setState({ roomId: '' });
            } else {
                axios.post("https://localhost:3010/api/generate-room-id").then((res) => {
                    if (res.data) {
                        this.setState({ roomId: res.data.roomId });
                    }
                });
            }
        }
        if (this.state.roomId !== prevState.roomId) {
            const sanitizedRoomId = this.sanitizeRoomIdInput(this.state.roomId);
            this.setState({ roomId: sanitizedRoomId });
        }
    }

    handleRoomPrivacyChange = (enableSecureRoom = false) => {
        if (this.state.tabState === "create") {
            axios.post("https://localhost:3010/api/generate-room-id", { enableSecureRoom }).then((res) => {
                if (res.data) {
                    this.setState({ roomId: res.data.roomId });
                }
            });
        }
    }

    handleInputChange = (e) => {
        const { name, value, type } = e.target;
        this.setState({
            [name]: type === 'checkbox' ? e.target.checked : value,
        });
        if (type === 'checkbox') {
            this.handleRoomPrivacyChange(e.target.checked);
        }
    }

    handleCreateRoom = async () => {
        const createRoom = await axios.post('https://localhost:3010/api/create-room', { roomId: this.state.roomId, password: this.state.password, enableSecureRoom: this.state.enableSecureRoom });
        if (createRoom.data && createRoom.data.roomId) {
            this.props.setUserData({ roomId: this.state.roomId, username: this.state.username, secureRoom: this.state.enableSecureRoom, password: this.state.password });
            this.props.setLoggedIn();
        }
    }

    handleJoinRoom = async () => {
        const authenticateRoom = await axios.post('https://localhost:3010/api/room/authenticate', { roomId: this.state.roomId, password: this.state.password, secureRoom: this.state.enableSecureRoom });
        if(authenticateRoom.data && authenticateRoom.data.success){
            this.props.setUserData({ roomId: this.state.roomId, username: this.state.username, secureRoom: this.state.enableSecureRoom, password: this.state.password });
            this.props.setLoggedIn();
        }
    }

    sanitizeRoomIdInput = (roomId) => {
        let sanitizedInput = roomId.replace(/[^\d]/g, '');
        let formattedInput = '';
        for (let i = 0; i < sanitizedInput.length; i += 4) {
            formattedInput += sanitizedInput.slice(i, i + 4) + '-';
        }
        formattedInput = formattedInput.slice(0, -1);
        return formattedInput;
    }

    render() {
        return (
            <Container className="d-grid align-items-center justify-content-center" style={{ height: '100vh' }}>
                <Row>
                    <h1 className='text-center text-white'>CONFERA</h1>
                </Row>
                <Row className='uname-container'>
                    <Col>
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
                <Row>
                    <Tabs
                        id="room-tabs"
                        activeKey={this.state.tabState}
                        onSelect={(e) => this.setState({ tabState: e })}
                    >
                        <Tab eventKey="join" title="Join Room">
                            <Col>
                                <Form>
                                    <Form.Group controlId="roomId">
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

                                    <Form.Group controlId="enableSecureRoom">
                                        <Form.Check
                                            type="checkbox"
                                            label="Have a Password?"
                                            name="enableSecureRoom"
                                            checked={this.state.enableSecureRoom}
                                            onChange={this.handleInputChange}
                                        />
                                    </Form.Group>
                                </Form>

                                <Button onClick={() => this.handleJoinRoom()} variant="primary" className="mt-3" disabled={this.state.roomId.length !== 14}>
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

                                    <Form.Group controlId="enableSecureRoom">
                                        <Form.Check
                                            type="checkbox"
                                            label="Enable Secure Room"
                                            name="enableSecureRoom"
                                            checked={this.state.enableSecureRoom}
                                            onChange={this.handleInputChange}
                                        />
                                    </Form.Group>
                                </Form>

                                <Button onClick={() => this.handleCreateRoom()} variant="primary" className="mt-3">
                                    Create Room
                                </Button>
                            </Col>
                        </Tab>
                    </Tabs>

                </Row>
            </Container>
        );
    }
}

export default Login;
