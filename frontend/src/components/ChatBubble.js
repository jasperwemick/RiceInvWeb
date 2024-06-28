import React from "react";
import "../style/chat.css";

const ChatBubble = ({ children }) => {
  return <div className="bubble">{children}</div>;
};

export default ChatBubble;
