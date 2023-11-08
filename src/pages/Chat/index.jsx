import clsx from "clsx";
import useChatService from "../../services/useChatService";
import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Icon } from "@iconify/react";
import autoAnimate from "@formkit/auto-animate";
import Lottie from "lottie-react";
import chatbot from "../../assets/lottie/fmHK8Q4x31.json";
import DHSVU_LOGO from "../../assets/images/dabchatlogo.png";
import useSession from "../../hooks/useSession";

function Chat() {
  const [conversations, setConversations] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [query, setQuery] = useState("");
  const { sendQuestion, getConversation, addMessage } = useChatService();
  const { id } = useParams();
  const nav = useNavigate();
  const messageRef = useRef(null);
  const animateMessage = useRef(null);
  const { signOut } = useSession();

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
        setConversations(conversation?.conversation_history);
      })();
    }
  }, []);

  const handleSend = async e => {
    e.preventDefault();
    if (!query) return;
    setIsLoading(true);
    setConversations(prev => [...prev, query]);
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

    setConversations(prevConversations => [
      ...prevConversations,
      conversationResponse,
    ]);

    setIsLoading(false);
  };
  const messageElements = conversations?.map((message, key) => (
    <div
      className={clsx(
        key % 2 === 0
          ? "ml-auto max-w-[60%] rounded-[1.5rem] rounded-br-none bg-[#8C6A71] px-6 py-[13px] text-left text-white"
          : "mr-auto max-w-[75%] rounded-[1.5rem] rounded-bl-none bg-[#585C68] px-6 py-[13px] text-left text-white",
        "w-fit p-2"
      )}
      key={key}
    >
      <span className={"text-white"}>{message}</span>
    </div>
  ));

  return (
    <div className="relative flex h-screen w-full flex-col overflow-hidden bg-[#2D354B] xl:flex-row xl:gap-5 xl:p-10">
      <div className="xl:flex xl:w-[30%] xl:flex-col">
        <div className="flex w-full items-center justify-between p-5">
          <Icon
            className="h-[32px] w-[32px] text-[#ADAEB3] lg:pointer-events-none xl:hidden"
            icon={"solar:logout-2-bold"}
            onClick={() => signOut()}
          />
          <div className="flex w-full items-center justify-center gap-3">
            <div className="h-[63px] w-[63px] overflow-hidden rounded-full">
              <img
                src={DHSVU_LOGO}
                alt="dhvsu"
                className="h-full w-full object-cover object-center"
              />
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-white">DHVChat</span>
              <span className="text-sm text-[#ADAEB3]">AI Chat Assistant</span>
            </div>
          </div>
          {/* <Icon
            icon={"material-symbols:light-mode"}
            className="h-[32px] w-[32px] text-[#ADAEB3]"
          /> */}
        </div>
        {/* Side */}
        <div className="hidden h-full w-full flex-col items-center justify-between rounded-md bg-[#202533] p-5 xl:flex">
          <div className="flex w-full flex-col gap-3">
            {["Facebook", "Twitter", "DHVSU Website"].map((item, key) => (
              <button
                key={key}
                className="w-full rounded-md bg-slate-300 px-3 py-1"
              >
                {item}
              </button>
            ))}
          </div>
          <button
            onClick={() => signOut()}
            className="w-full rounded-md bg-white/80 px-3 py-1"
          >
            Sign out
          </button>
        </div>
      </div>
      {/* <div className="absolute bottom-0 right-[-100px] h-80 w-80 rounded-full bg-[#35243D] "></div> */}
      <div className="relative mt-auto flex h-[85%] flex-col overflow-hidden rounded-t-[46px] bg-[#202533] bg-opacity-60 backdrop-blur-3xl backdrop-filter xl:h-full xl:flex-1 xl:rounded-md">
        <div
          ref={animateMessage}
          className="flex h-full flex-1 flex-col gap-5 overflow-y-auto p-5 pb-[10px]"
        >
          {messageElements}
          {isLoading ? (
            <div className="mr-auto w-fit max-w-[75%] rounded-[1.5rem] rounded-bl-none bg-[#585C68] p-2 px-6 py-[13px]  text-left text-white">
              <Lottie
                animationData={chatbot}
                className="h-14 w-14 text-white "
              />
            </div>
          ) : null}
          <div ref={messageRef} />
        </div>
        <form
          className="flex w-full bg-gradient-to-t from-[#202535] p-4"
          onSubmit={handleSend}
        >
          <div className="flex h-[69px] w-full overflow-hidden rounded-[35px] bg-[#585C68]">
            <input
              onChange={e => setQuery(e.target.value)}
              value={query}
              type="text"
              className="flex-1 bg-[#585C68] p-5 text-white outline-none"
            />
            <button
              disabled={isLoading}
              type="submit"
              className="flex w-[100px] flex-col items-center justify-center rounded-[35px] bg-[#8C6A71] p-1 text-white"
            >
              <Icon
                icon={"mingcute:send-line"}
                className="h-[35px] w-[35px] text-white"
              />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Chat;
