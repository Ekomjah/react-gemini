import { useState } from "react";
// Using a web image for chat illustration
import "./App.css";
import { GoogleGenerativeAI } from "@google/generative-ai";

function App() {
  const [mainOutput, setMainOutput] = useState("");
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]); // 🧠 store chat history
  const [loading, setLoading] = useState(false);

  const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
  const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
  const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-001" });

  async function handleChat() {
    if (!input.trim()) return;

    // Add the user's new message to history
    const newMessages = [
      ...messages,
      { role: "user", parts: [{ text: input }] },
    ];
    setMessages(newMessages);
    setInput("");
    setLoading(true);
    setMainOutput("");

    try {
      // Generate response using full history
      const chat = model.startChat({ history: newMessages });
      const result = await chat.sendMessage(input);

      const text = result.response.text();
      setMainOutput(text);
      setLoading(false);

      // Add the model's reply to history too
      setMessages([...newMessages, { role: "model", parts: [{ text }] }]);
    } catch (err) {
      console.error(err);
      setMainOutput("❌ Error: " + err.message);
      setLoading(false);
    }
  }

  return (
    <>
      <div className="chat-logo-container">
        <img
          src="https://cdn.mos.cms.futurecdn.net/VFLt5vHV7aCoLrLGjP9Qwm.jpg"
          className="chat-logo"
          alt="Chat AI"
        />
      </div>

      <h1>Gemini + React Chat</h1>
      <div className="userInput">
        <input
          type="text"
          className="fancy-input"
          placeholder="Type your message..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              handleChat();
            }
          }}
        />
        <button className="fancy-btn" onClick={handleChat}>
          <span role="img" aria-label="send">
            💬
          </span>{" "}
          Send
        </button>
      </div>

      <div className="output">
        {loading ? (
          <div className="loader">
            <div className="spinner"></div>
            <span>Thinking...</span>
          </div>
        ) : (
          mainOutput
        )}
      </div>
    </>
  );
}

export default App;
