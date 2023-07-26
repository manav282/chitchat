import React, { useContext, useEffect, useRef } from "react";
import { AuthContext } from "../context/AuthContext";
import { ChatContext } from "../context/ChatContext";

const Message = ({ message }) => {
  const { currentUser } = useContext(AuthContext);
  const { data } = useContext(ChatContext);

  const ref = useRef();

  useEffect(() => {
    ref.current?.scrollIntoView({ behavior: "smooth" });
  }, [message]);

  return (
    <div
      ref={ref}
      className={`message ${message.senderId === currentUser.uid && "owner"}`}
    >
      <div className="messageInfo">
        <img
          src={
            message.senderId === currentUser.uid
              ? currentUser.photoURL
              : data.user.photoURL
          }
          alt=""
        />
      </div>
      <div className="messageContent">
        {message.text!=="" && <p>{message.text}</p>}
        {message.img && <img src={message.img} alt="" />}
        {message.audio && <audio controls><source src={message.audio} type="audio/mp3" /></audio>}
        {message.video && <video width="280" height="200" controls><source src={message.video} type="video/mp4" /></video>}
        {message.f && <p><a href={message.f} style={{color: "whitesmoke"}}>{message.fileName}</a></p>}
      </div>
    </div>
  );
};

export default Message;
