import { faArrowRight } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React,{ useEffect, useState, useRef } from "react"
import { Button } from "react-bootstrap";
const Chat = (props) => {
    const { socket, showChat } = props
    const [messageInput,setMessageInput] = useState("");

    useEffect(()=>{
        const handleMessages = (message) => {
            console.log(message);
            outputMessage(message);
        }
    socket.on('message', handleMessages);
    const chatMessages      = document.querySelector('.chat-messages');
    chatMessages.scrollTop  = chatMessages.scrollHeight;
    return()=>{
        socket.off('message', handleMessages);
    }
    },[socket]);

    const outputMessage = (message)=> {
        if(!message || !message.username || !message.time || !message.text){
            return;
        }
        const div = document.createElement('div');
        div.classList.add('message');
        const p = document.createElement('p');
        p.classList.add('meta');
        p.innerText = message.username;
        p.innerHTML += `<span> ${message.time}</span>`;
        div.appendChild(p);
        const para = document.createElement('p');
        para.classList.add('text');
        para.innerText = message.text;
        div.appendChild(para);
        document.querySelector('.chat-messages').appendChild(div);
    };

    const sendMessage = (e) =>{
        e.preventDefault();
        const msg = messageInput.trim();
        if(!msg){
            return;
        }
        console.log(msg);
        socket.emit('chatMessage',msg);
        setMessageInput("");        
    };
   
    return <div>
        <div className={`chat-window ${!showChat && "chat-hidden"}`}>
            <h1>Confera Chat</h1>
            <div className="chatbox">
                <div class="chat-messages"></div>
                <div class="chat-form-container">
                    <form id="chat-form" onSubmit={sendMessage}>
                        <input type="text" placeholder="Enter your Message" id="msg" value={messageInput} onChange={(e) => setMessageInput(e.target.value)}/>
                        <Button variant="primary" type="submit">
                            <FontAwesomeIcon icon={faArrowRight} />
                        </Button>
                    </form>
                </div>
            </div>
        </div>
    </div>
}
export default Chat;