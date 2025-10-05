import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import { GoogleGenerativeAI } from "@google/generative-ai";

function App() {
  const [mainOutput, setMainOutput] = useState("");
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]); // 🧠 store chat history

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

    try {
      // Generate response using full history
      const chat = model.startChat({ history: newMessages });
      const result = await chat.sendMessage(input);

      const text = result.response.text();
      setMainOutput(text);

      // Add the model's reply to history too
      setMessages([...newMessages, { role: "model", parts: [{ text }] }]);
    } catch (err) {
      console.error(err);
      setMainOutput("❌ Error: " + err.message);
    }
  }

  return (
    <>
      <div>
        <a href="https://vite.dev" target="_blank" rel="noreferrer">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank" rel="noreferrer">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>

      <h1>Gemini + React Chat</h1>
      <div className="userInput">
        <input
          type="text"
          placeholder="Type something..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        <button onClick={handleChat}>Send</button>
      </div>

      <div className="output">{mainOutput}</div>
    </>
  );
}

export default App;
