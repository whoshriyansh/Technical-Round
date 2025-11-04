import Groq from "groq-sdk";
import { useState } from "react";

interface IPrompt {
  id: string;
  sender: string;
  message: string;
}

const groq = new Groq({
  apiKey: import.meta.env.VITE_GROQ_API_KEY,
  dangerouslyAllowBrowser: true,
});

const ChatBot = () => {
  const [conversation, setConversation] = useState<IPrompt[]>([]);
  const [userMessage, setUserMessage] = useState("");

  const handleUserMessageAddingtoConversation = (usrmessage: string) => {
    const newMessage: IPrompt = {
      id: crypto.randomUUID(),
      sender: "user",
      message: usrmessage,
    };
    setConversation((prevMessage) => [...prevMessage, newMessage]);
  };

  const handleChatBotRequest = async (userMessage: string) => {
    //Making an API call and then adding that message to the chatBOT

    const chatCompletion = await groq.chat.completions.create({
      messages: [
        {
          role: "user",
          content: userMessage,
        },
      ],
      model: "openai/gpt-oss-120b",
      temperature: 1,
      max_completion_tokens: 8192,
      top_p: 1,
      stream: false,
      reasoning_effort: "low",
      stop: null,
    });
    const response = chatCompletion.choices[0].message.content;

    console.log(
      "this is chat completion",
      chatCompletion.choices[0].message.content
    );

    setTimeout(() => {
      const botResponse: IPrompt = {
        id: crypto.randomUUID(),
        sender: "bot",
        message: `${response}`,
      };
      setConversation((prevMessages) => [...prevMessages, botResponse]);
    }, 1000);
  };

  const handleUserMessageSending = () => {
    //make an API call to the prompt and then add that prompt to the conversation message
    //API CALL FUNCTION

    //Added the user prompt to the conversation
    handleUserMessageAddingtoConversation(userMessage);
    handleChatBotRequest(userMessage);
  };

  return (
    <div className="container mx-auto h-4/5 p-5 bg-black text-white rounded-lg w-3/5 flex flex-col items-center gap-5">
      {/* //We will use map and then we can put a condition for rending side ways
      base on the sender */}
      <div className="flex-1 border w-full h-[80vh] overflow-y-auto flex flex-col space-y-4 p-4 bg-gray-900">
        {conversation.map((convo) => {
          return convo.sender === "user" ? (
            <div key={convo.id} className="flex justify-end">
              <div className="bg-blue-600 text-white px-4 py-2 rounded-lg max-w-[70%] break-words">
                {convo.message}
              </div>
            </div>
          ) : (
            <div key={convo.id} className="flex justify-start">
              <div className="bg-gray-700 text-white px-4 py-2 rounded-lg max-w-[70%] break-words">
                {convo.message}
              </div>
            </div>
          );
        })}
      </div>

      <div className="w-full flex items-center gap-4">
        <input
          type="text"
          value={userMessage}
          onChange={(event) => {
            setUserMessage(event.target.value);
          }}
          placeholder="Enter your prompt"
          className="flex-1 p-2 text-xs bg-gray-700 rounded-lg focus:outline-0"
        />
        <button
          className="bg-purple-500 rounded-lg p-2 text-xs"
          onClick={handleUserMessageSending}
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default ChatBot;
