import { faArrowRight, faClose } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useEffect, useState, useRef } from "react";
import { Button } from "react-bootstrap";
import { toast } from "react-toastify";
const Chat = (props) => {
  const { socket, showChat, closeChat } = props;
  const [messageInput, setMessageInput] = useState("");

  useEffect(() => {
    const handleMessages = (message) => {
      outputMessage(message);
    };
    socket.on("message", handleMessages);
    const chatMessages = document.querySelector(".chat-messages");
    chatMessages.scrollTop = chatMessages.scrollHeight;
    return () => {
      socket.off("message", handleMessages);
    };
  }, [socket, showChat]);

  const outputMessage = (message) => {
    if (!message || !message.username || !message.time || !message.text) {
      return;
    }
    if (message.userId !== socket.id && showChat === false) {
      const ChatMessage = () => {
        return (
          <div>
            <p>
              <strong>{message.username}</strong>
            </p>
            <p>{message.text}</p>
          </div>
        );
      };
      if(message.text){
        toast(<ChatMessage />);
      }
    }
    const div = document.createElement("div");
    div.classList.add("message");
    if(message.userId === socket.id){
      div.classList.add("my-message");
    }else{
      div.classList.add("peer-message");
    }
    const p = document.createElement("p");
    p.classList.add("meta");
    p.innerText = message.username;
    p.innerHTML += `<span> ${message.time}</span>`;
    div.appendChild(p);
    const para = document.createElement("p");
    para.classList.add("text");
    para.innerText = message.text;
    div.appendChild(para);
    document.querySelector(".chat-messages").appendChild(div);
  };

  const sendMessage = (e) => {
    e.preventDefault();
    const msg = messageInput.trim();
    if (!msg) {
      return;
    }
    socket.emit("chatMessage", msg);
    setMessageInput("");
  };

  return (
    <div>
      <div className={`chat-window ${!showChat && "chat-hidden"}`}>
        <div className="d-flex justify-content-between align-items-center ">
          <h2>Confera Chat</h2>
          <FontAwesomeIcon icon={faClose} onClick={closeChat} />
        </div>
        <div className="chatbox">
          <div className="chat-messages"></div>
          <div className="chat-form-container">
            <form id="chat-form" onSubmit={sendMessage}>
              <input
                type="text"
                placeholder="Enter your Message"
                id="msg"
                value={messageInput}
                onChange={(e) => setMessageInput(e.target.value)}
              />
              <Button variant="success" type="submit">
                <FontAwesomeIcon icon={faArrowRight} />
              </Button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Chat;
