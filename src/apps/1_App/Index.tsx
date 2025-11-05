import { Groq } from "groq-sdk";
import { useState } from "react";

interface IConversation {
  id: string;
  sender: string;
  message: string;
}

const groq = new Groq({
  apiKey: import.meta.env.VITE_GROQ_API_KEY,
  dangerouslyAllowBrowser: true,
});

function App() {
  const [conversation, setConversation] = useState<IConversation[]>([]);
  const [prompt, setPrompt] = useState("");

  const handleAddingToConversation = async (userMessage: string) => {
    try {
      const newUserMessage: IConversation = {
        id: crypto.randomUUID(),
        sender: "user",
        message: userMessage,
      };

      setConversation((prev) => [...prev, newUserMessage]);
      await handleChatResponse(userMessage);
      setPrompt("");
    } catch (error) {
      console.log(error);
    }
  };

  const handleChatResponse = async (userMessage: string) => {
    try {
      const chatCompletion = await groq.chat.completions.create({
        messages: [
          {
            role: "user",
            content: userMessage,
          },
        ],
        model: "openai/gpt-oss-20b",
        temperature: 1,
        max_completion_tokens: 8192,
        top_p: 1,
        stream: false,
        reasoning_effort: "low",
        stop: null,
      });

      const response = chatCompletion.choices[0].message.content;
      const newBotResponse: IConversation = {
        id: crypto.randomUUID(),
        sender: "bot",
        message: `${response}`,
      };

      setConversation((prev) => [...prev, newBotResponse]);
    } catch (error) {
      console.log(error);
    }
  };

  const handleUserPrompt = () => {
    handleAddingToConversation(prompt);
  };

  return (
    <div className="w-screen h-screen flex justify-center items-center bg-gray-100">
      <div className="container mx-auto h-3/4 bg-black rounded-xl flex flex-col gap-4 p-5">
        <div className="flex-1 flex-col space-y-4 text-white px-5 overflow-y-auto">
          {conversation.map((convo) => {
            return convo.sender === "user" ? (
              <div key={convo.id} className="flex justify-end ">
                <div className="w-3/5 text-right bg-blue-600 p-2 rounded-lg">
                  {convo.message}
                </div>
              </div>
            ) : (
              <div key={convo.id} className="flex justify-start">
                <div className="w-3/4 text-left bg-gray-900 p-2 rounded-lg">
                  {convo.message}
                </div>
              </div>
            );
          })}
        </div>
        <div className="flex gap-4 item-center">
          <input
            type="text"
            className="flex-1 bg-gray-700 text-white rounded-xl p-2 text-xs"
            value={prompt}
            onChange={(event) => {
              setPrompt(event.target.value);
            }}
            placeholder="Enter your prompt"
          />
          <button
            className="bg-white text-black p-2 text-xs rounded-lg"
            onClick={handleUserPrompt}
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}

export default App;
