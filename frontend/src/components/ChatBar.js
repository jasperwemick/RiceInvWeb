import { useState } from "react";

export default function ChatBar({ sendMessage }) {
  function onSubmit(e) {
    e.preventDefault();
    if (e.target.chat.value) {
      sendMessage(e.target.chat.value);
      e.target.chat.value = "";
    }
  }

  return (
    <>
      <div className="chat-bar">
        <form onSubmit={onSubmit} autoComplete="off">
          <input type="text" name="chat"></input>
          <input type="submit" value="Send"></input>
        </form>
      </div>
    </>
  );
}
