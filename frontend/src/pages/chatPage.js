import { useState } from "react";
import ChatBar from "../components/ChatBar";
import ChatBubble from "../components/ChatBubble";
import "../style/chat.css";

export default function ChatPage() {
  const [messages, setMessages] = useState([]);

  function handleMessage(data) {
    setMessages((messages) => [...messages, data]);
  }

  return (
    <>
      <div className="chat-page">
        <div className="main-chat-box">
          <h1>Hello!</h1>
          {messages.map((message) => (
            <ChatBubble key={message}>{message}</ChatBubble>
          ))}
        </div>
        <ChatBar sendMessage={handleMessage} />
      </div>
    </>
  );
}
