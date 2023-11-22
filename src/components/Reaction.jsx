import React, { useEffect, useState } from 'react';
import { toast } from "react-toastify";
import EmojiPicker from 'emoji-picker-react';


const Reaction = (props) => {
    const {socket, showReaction, setShowReaction} = props;
    
    useEffect(()=>{
      const handleNewEmoji = (data) =>{
        if(data.userId != socket.id){
          toast(
          <span>
            <span>{`${data.username} : `}</span>
            <span style={{ fontSize: '24px' }}>{data.emoji.emoji}</span>
          </span>,
          {
            autoClose: false,
          });
        }
      }

      socket.on('new-emoji', handleNewEmoji);
      return () =>{
        socket.off('new-emoji',handleNewEmoji);
      };
    },[socket]);  
   
    const handleEmojiClick = (emojiObject) =>{
      if(emojiObject){
        const emoji = emojiObject.emoji;
        socket.emit('emoji',{emoji});
        toast(
          <span>
            <span>You reacted with:</span>
            <span style={{ fontSize: '24px' }}>{`${emoji}`}</span>
          </span>
        );
        setShowReaction(false);
      }
    }
  return (
    <div className={`reaction-window ${!showReaction && "reaction-hidden"}`}>
        <div className="d-flex justify-content-between align-items-center ">
          <EmojiPicker onEmojiClick={handleEmojiClick} />
        </div>
    </div>
  )
};

export default Reaction;