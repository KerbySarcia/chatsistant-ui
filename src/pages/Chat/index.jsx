import clsx from "clsx";
import useChatService from "../../services/useChatService";
import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Icon } from "@iconify/react";
import autoAnimate from "@formkit/auto-animate";
import Lottie from "lottie-react";
import chatbot from "../../assets/lottie/fmHK8Q4x31.json";
import DHSVU_LOGO from "../../assets/images/dabchatlogo.png";

function Chat() {
  const [conversations, setConversations] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [query, setQuery] = useState("");
  const { sendQuestion, getConversation, addMessage } = useChatService();
  const { id } = useParams();
  const nav = useNavigate();
  const messageRef = useRef(null);
  const animateMessage = useRef(null);

  const scrollToBottom = () => {
    messageRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    animateMessage.current && autoAnimate(animateMessage.current);
  }, [animateMessage]);

  useEffect(() => {
    if (messageRef.current) {
      scrollToBottom();
    }
  }, [conversations]);

  useEffect(() => {
    if (id !== "try-now") {
      (async () => {
        const conversation = await getConversation(id);
        setConversations(conversation.conversation_history);
      })();
    }
  }, []);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!query) return;
    setIsLoading(true);
    setConversations((prev) => [...prev, query]);
    setQuery("");

    let conversationResponse = [];

    if (id === "try-now") {
      const { data, error } = await sendQuestion({ question: query });
      console.log("chat =>", error);
      conversationResponse = data;
    } else {
      const { data } = await addMessage({ message: query });
      conversationResponse = data;
    }

    setConversations((prevConversations) => [
      ...prevConversations,
      conversationResponse,
    ]);

    setIsLoading(false);
  };
  const messageElements = conversations?.map((message, key) => (
    <div
      className={clsx(
        key % 2 === 0
          ? "text-left bg-[#8C6A71] ml-auto max-w-[60%] px-6 rounded-[1.5rem] rounded-br-none py-[13px] text-white"
          : "text-left bg-[#585C68] mr-auto max-w-[75%] px-6 rounded-[1.5rem] rounded-bl-none py-[13px] text-white",
        "w-fit p-2"
      )}
      key={key}
    >
      <span className={"text-white"}>{message}</span>
    </div>
  ));

  return (
    <div className="h-screen flex flex-col relative overflow-hidden w-full bg-[#2D354B] ">
      <div className="flex justify-between p-5 items-center w-full">
        <Icon
          className="h-[32px] w-[32px] text-[#ADAEB3] lg:opacity-0 lg:pointer-events-none"
          icon={"ion:chevron-back-circle-outline"}
          onClick={() => nav("/")}
        />
        <div className="flex gap-3 items-center">
          <div className="h-[63px] w-[63px] rounded-full overflow-hidden">
            <img
              src={DHSVU_LOGO}
              alt="dhvsu"
              className="w-full h-full object-center object-cover"
            />
          </div>
          <div className="flex flex-col">
            <span className="text-white font-bold">DHVChat</span>
            <span className="text-[#ADAEB3] text-sm">AI Chat Assistant</span>
          </div>
        </div>
        <Icon
          icon={"material-symbols:light-mode"}
          className="h-[32px] w-[32px] text-[#ADAEB3]"
        />
      </div>
      <div className="h-80 w-80 bottom-0 right-[-100px] bg-[#35243D] rounded-full absolute "></div>
      <div className="bg-[#202533] flex flex-col h-[85%] overflow-hidden bg-opacity-60 backdrop-filter relative backdrop-blur-3xl mt-auto rounded-t-[46px]">
        <div
          ref={animateMessage}
          className="flex-1 h-full p-5 overflow-y-auto flex flex-col gap-5 pb-[10px]"
        >
          {messageElements}
          {isLoading ? (
            <div className="text-left bg-[#585C68] mr-auto max-w-[75%] px-6 rounded-[1.5rem] rounded-bl-none py-[13px] text-white  w-fit p-2">
              <Lottie
                animationData={chatbot}
                className="h-14 w-14 text-white "
              />
            </div>
          ) : null}
          <div ref={messageRef} />
        </div>
        <form
          className="flex w-full p-4 bg-gradient-to-t from-[#202535]"
          onSubmit={handleSend}
        >
          <div className="bg-[#585C68] w-full flex h-[69px] rounded-[35px] overflow-hidden">
            <input
              onChange={(e) => setQuery(e.target.value)}
              value={query}
              type="text"
              className="flex-1 bg-[#585C68] outline-none p-5 text-white"
            />
            <button
              disabled={isLoading}
              type="submit"
              className="w-[100px] rounded-[35px] p-1 text-white bg-[#8C6A71] flex flex-col justify-center items-center"
            >
              <Icon
                icon={"mingcute:send-line"}
                className="text-white h-[35px] w-[35px]"
              />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Chat;
