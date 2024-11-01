"use client";

import { useState, useEffect, useRef } from "react";

type Message = {
  id: string;
  type: "user" | "bot";
  text: string;
  options?: string[];
};

interface IUserSession {
  id: string;
  name: string;
}



export default function ChatComponent() {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [responses, setResponses] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [user, setUser] = useState<IUserSession | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const userSession = localStorage.getItem('userSession')
    if (userSession) {
      setUser(JSON.parse(userSession))
    }
  }, []);

  const handleSendMessage = async (text: string = message) => {

if(!user){
  alert('por favor inicia sesion para sar las funcionalidades de chatbot')
  return;
}

    if (!text.trim()) return;

    setIsLoading(true);
    const newUserMessage: Message = {
      id: Date.now().toString(),
      type: "user",
      text,
    };
    setResponses((prev) => [...prev, newUserMessage]);

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/chat`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message: text, userId: user?.id || "" }),
      });

      if (!response.ok) {
        throw new Error(`Error del servidor: ${response.status}`);
      }

      const data = await response.json();
      console.log('data response',data.response);
      

      const newBotMessage: Message = {
        id: Date.now().toString(),
        type: "bot",
        text: data.response,
        options: data.options,
      };

      setResponses((prev) => [...prev, newBotMessage]);
    } catch (error) {
      console.error("Error:", error);
      const errorMessage: Message = {
        id: Date.now().toString(),
        type: "bot",
        text: "Lo siento, hubo un error procesando tu mensaje. Por favor, intenta de nuevo.",
      };
      setResponses((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
      setMessage("");
    }
  };

  return (
    <div className="fixed bottom-4 right-4">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="mb-4 bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
        aria-expanded={isOpen}
        aria-controls="chat-window"
      >
        {isOpen ? "Cerrar Chat" : "Abrir Chat"}
      </button>
      {isOpen && (
        <div id="chat-window" className="w-full max-w-md bg-white shadow-lg rounded-lg overflow-hidden">
          <div className="bg-gray-100 p-4 border-b">
            <h2 className="text-xl font-semibold text-gray-800">Chat con IA</h2>
          </div>
          <div className="flex flex-col h-[500px]">
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {responses.map((response) => (
                <div key={response.id}>
                  <div
                    className={`flex ${
                      response.type === "user" ? "justify-end" : "justify-start"
                    }`}
                  >
                    <div
                      className={`max-w-[70%] p-3 rounded-lg ${
                        response.type === "user"
                          ? "bg-blue-500 text-white"
                          : "bg-gray-200 text-gray-800"
                      }`}
                    >
                      <p className="text-sm whitespace-pre-wrap break-words">
                        {response.text}
                      </p>
                    </div>
                  </div>
                  {response.type === "bot" && response.options && (
                    <div className="mt-4 space-y-2">
                      {response.options.map((option, optionIndex) => (
                        <button
                          key={optionIndex}
                          onClick={() => handleSendMessage(option)}
                          className="w-full text-left p-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors duration-200"
                        >
                          {`${optionIndex + 1}: ${option}`}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>
            <div className="border-t p-4">
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyUp={(e) =>
                    e.key === "Enter" && !isLoading && handleSendMessage()
                  }
                  placeholder="Escribe un mensaje..."
                  className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  disabled={isLoading}
                />
                <button
                  onClick={() => handleSendMessage()}
                  disabled={isLoading || !message.trim()}
                  className={`px-4 py-2 bg-blue-500 text-white rounded-lg transition-colors ${
                    isLoading || !message.trim()
                      ? "opacity-50 cursor-not-allowed"
                      : "hover:bg-blue-600"
                  } focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50`}
                  aria-label="Enviar mensaje"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}