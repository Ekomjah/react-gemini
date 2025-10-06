import { useState } from "react";
import "./App.css";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { marked } from "marked";

function App() {
  // const [mainOutput, setMainOutput] = useState("");
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]); // 🧠 store chat history
  const [loading, setLoading] = useState(false);
  const [plainText, setPlainText] = useState(""); // Add this line
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
    setPlainText("⏳ Thinking..."); // Update state

    try {
      // Generate response using full history
      const chat = model.startChat({ history: newMessages });
      const result = await chat.sendMessage(input);

      const text = result.response.text();
      setPlainText(marked(text)); // Update state
      setLoading(false);

      // Add the model's reply to history too
      setMessages([...newMessages, { role: "model", parts: [{ text }] }]);
    } catch (err) {
      console.error(err);
      setPlainText("❌ Error: " + err.message); // Update state
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
            <span>Loading...</span>
          </div>
        ) : (
          <div dangerouslySetInnerHTML={{ __html: plainText }} />
        )}
      </div>
    </>
  );
}

export default App;
