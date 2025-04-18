import React, { useState } from "react";
import Picker from "emoji-picker-react";
import "bootstrap/dist/css/bootstrap.min.css";

interface Message {
  id: number;
  user: string;
  text: string;
}

export default function ChatWithEmoji() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [currentMessage, setCurrentMessage] = useState("");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  const handleSend = () => {
    if (currentMessage.trim()) {
      const newMessage: Message = {
        id: Date.now(),
        user: "user123",
        text: currentMessage,
      };
      setMessages([...messages, newMessage]);
      setCurrentMessage("");
    }
  };

  const onEmojiClick = (emojiData: any) => {
    setCurrentMessage(prev => prev + emojiData.emoji);
  };

  return (
    <div className="bg-light text-dark rounded p-3" style={{ height: "500px", display: "flex", flexDirection: "column" }}>
      <h5 className="border-bottom pb-2">ЧАТ</h5>
      <div style={{ flex: 1, overflowY: "auto" }}>
        {messages.map((msg) => (
          <p key={msg.id}><strong>{msg.user}:</strong> {msg.text}</p>
        ))}
      </div>
      {showEmojiPicker && (
        <div className="border rounded mt-2">
          <Picker onEmojiClick={onEmojiClick} height={300} width="100%" />
        </div>
      )}
      <div className="d-flex align-items-center mt-2">
        <input
          className="form-control me-2"
          placeholder="Введите сообщение..."
          value={currentMessage}
          onChange={(e) => setCurrentMessage(e.target.value)}
        />
        <button className="btn btn-secondary me-2" onClick={() => setShowEmojiPicker(!showEmojiPicker)}>
          😊
        </button>
        <button className="btn btn-primary" onClick={handleSend}>
          Отправить
        </button>
      </div>
    </div>
  );
}
