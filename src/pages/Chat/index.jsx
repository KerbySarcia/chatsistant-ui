import clsx from "clsx";
import useChatService from "../../services/useChatService";
import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Icon } from "@iconify/react";
import autoAnimate from "@formkit/auto-animate";
import Lottie from "lottie-react";
import chatbot from "../../assets/lottie/fmHK8Q4x31.json";
import useSession from "../../hooks/useSession";
import { isEmpty } from "lodash";
import LoadingSpinner from "../../components/LoadingSpinner";
import DHSVU_LOGO from "../../assets/images/dabchatlogo.png";
import LOGO from "../../assets/images/dhvsu-logo.png";
import Menu from "../../components/chat/Menu";

function Chat() {
  const [conversations, setConversations] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isOpenMenu, setIsOpenMenu] = useState(false);
  const [messageLoading, setMessageLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState(null);
  const [query, setQuery] = useState("");
  const {
    sendQuestion,
    getConversation,
    addMessage,
    updateConversationHistory,
  } = useChatService();
  const { id } = useParams();
  const nav = useNavigate();
  const messageRef = useRef(null);
  const animateMessage = useRef(null);
  const { signOut, session } = useSession();

  const scrollToBottom = () => {
    messageRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    animateMessage.current && autoAnimate(animateMessage.current);
  }, [animateMessage]);

  useEffect(() => {
    scrollToBottom();
  }, [conversations, messageRef.current]);

  useEffect(() => {
    if (id !== "try-now") {
      (async () => {
        const conversation = await getConversation(id);

        setConversations(conversation?.conversation_history);

        setMessageLoading(false);
      })();
    }
  }, []);

  const handleClickFirstTime = async userClicked => {
    setIsLoading(true);
    setConversations(prev => [...prev, { message: userClicked, role: "user" }]);
    setQuery("");
    let conversationResponse = [];

    const aiResponse = await addMessage({ message: userClicked });

    if (!isEmpty(aiResponse?.error)) {
      setConversations(prevConversations => [
        ...prevConversations,
        {
          message:
            "Everybody gets tired at some point. Please slow down and come back after a minute",
          role: "assistant",
        },
      ]);
      setIsLoading(false);

      return;
    }
    conversationResponse = aiResponse?.data;

    setConversations(prevConversations => [
      ...prevConversations,
      conversationResponse,
    ]);

    setIsLoading(false);
  };

  const handleSend = async e => {
    e.preventDefault();
    if (!query) return;
    setIsLoading(true);
    setConversations(prev => [...prev, { message: query, role: "user" }]);
    setQuery("");
    let conversationResponse = [];

    if (id === "try-now") {
      const { data, error } = await sendQuestion({
        question: query,
      });
      console.log("chat =>", error);
      conversationResponse = data;
    } else {
      const aiResponse = await addMessage({ message: query });

      if (!isEmpty(aiResponse?.error)) {
        setConversations(prevConversations => [
          ...prevConversations,
          {
            message:
              "Everybody gets tired at some point. Please slow down and come back after a minute",
            role: "assistant",
          },
        ]);
        setIsLoading(false);

        return;
      }
      conversationResponse = aiResponse?.data;
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
        message.role === "assistant"
          ? "mr-auto max-w-[75%] rounded-[1.5rem] rounded-bl-none bg-[#585C68] px-6 py-[13px] text-left text-white"
          : "ml-auto max-w-[60%] rounded-[1.5rem] rounded-br-none bg-[#8C6A71] px-6 py-[13px] text-left text-white",
        "w-fit p-2"
      )}
      key={key}
    >
      <span className={"text-white"}>{message.message}</span>
    </div>
  ));

  return (
    <>
      <Menu
        isOpen={isOpenMenu}
        setIsOpen={setIsOpenMenu}
        conversations={conversations}
        setConversations={setConversations}
        signOut={signOut}
        id={id}
        updateConversationHistory={updateConversationHistory}
        setMessageLoading={setMessageLoading}
      />
      <div className="relative flex h-screen w-full flex-col overflow-hidden bg-[#2D354B] xl:flex-row xl:gap-5 xl:p-10">
        <div className="xl:flex xl:w-[30%] xl:flex-col">
          <div className="flex w-full items-center justify-between p-5">
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
                <span className="text-sm text-[#ADAEB3]">
                  AI Chat Assistant
                </span>
              </div>
            </div>
            <Icon
              className="h-[32px] w-[32px] text-[#ADAEB3] lg:pointer-events-none xl:hidden"
              icon={"entypo:dots-three-horizontal"}
              onClick={() => setIsOpenMenu(true)}
            />
          </div>
          {/* Side */}
          <div className="font-productSansBlack hidden h-full w-full flex-col items-center justify-between rounded-md bg-[#202533] p-5 text-white xl:flex">
            <div className="flex w-full flex-col gap-3">
              <a
                href="https://www.facebook.com/dhvsuofficeofadmissions"
                target="_blank"
                rel="noreferrer"
              >
                <button className="flex w-full items-center justify-center rounded-md bg-blue-500 p-2">
                  <Icon icon={"bi:facebook"} className="text-lg" />
                </button>
              </a>
              <a href="https://dhvsu.edu.ph/" target="_blank" rel="noreferrer">
                <button className="flex w-full items-center justify-center rounded-md bg-[#a6304d] p-2">
                  <img
                    src={LOGO}
                    alt="logo"
                    className="h-5 w-5 object-cover object-center"
                  />
                </button>
              </a>
            </div>
            <div className="flex w-full flex-col gap-5">
              {conversations?.length > 0 ? (
                <button
                  onClick={async () => {
                    setMessageLoading(true);
                    await updateConversationHistory(id, {
                      conversation_history: [],
                    });
                    setConversations([]);
                    setMessageLoading(false);
                  }}
                  className="w-full rounded-md bg-[#2D354B] px-3 py-1 duration-200 hover:bg-red-700/50"
                >
                  Clear Conversation
                </button>
              ) : null}
              <button
                onClick={() => signOut()}
                className="w-full rounded-md bg-[#2D354B] px-3 py-1 duration-200 hover:opacity-50"
              >
                Sign out
              </button>
            </div>
          </div>
        </div>
        {/* <div className="absolute bottom-0 right-[-100px] h-80 w-80 rounded-full bg-[#35243D] "></div> */}
        <div className="relative mt-auto flex h-[85%] flex-col overflow-hidden rounded-t-[46px] bg-[#202533] bg-opacity-60 backdrop-blur-3xl backdrop-filter xl:h-full xl:flex-1 xl:rounded-md">
          {messageLoading ? (
            <div className="flex h-full items-center justify-center">
              <LoadingSpinner />
            </div>
          ) : (
            <div
              ref={animateMessage}
              className="flex h-full flex-1 flex-col gap-5 overflow-y-auto p-5 pb-[10px]"
            >
              {messageElements}
              {errorMessage && (
                <span className="rounded-md border border-red-400 px-3 py-1 text-red-400">
                  {errorMessage}
                </span>
              )}
              {isLoading ? (
                <div className="mr-auto w-fit max-w-[75%] rounded-[1.5rem] rounded-bl-none bg-[#585C68] p-2 px-6 py-[13px]  text-left text-white">
                  <Icon
                    icon={"eos-icons:three-dots-loading"}
                    className="text-4xl"
                  />
                </div>
              ) : null}
              <div ref={messageRef} />
              {conversations.length < 2 ? (
                <div className="mt-auto flex flex-col gap-2 md:flex-row">
                  {[
                    "When is the enrollment?",
                    "Saan ang location ni DHVSU?",
                    "When is the examination?",
                  ].map((m, key) => (
                    <button
                      key={key}
                      onClick={() => handleClickFirstTime(m)}
                      className="flex-1 cursor-pointer rounded-md border border-[#4f535d] bg-[#373c4b] p-5 text-center text-sm text-white duration-200 hover:bg-[#686c78]"
                    >
                      {m}
                    </button>
                  ))}
                </div>
              ) : null}
            </div>
          )}
          <form
            className="flex w-full bg-gradient-to-t from-[#202535] p-4"
            onSubmit={handleSend}
          >
            <div className="flex w-full overflow-hidden rounded-full bg-[#585C68] p-2 pl-8">
              <input
                onChange={e => setQuery(e.target.value)}
                value={query}
                disabled={isLoading || errorMessage}
                type="text"
                className="flex-1 bg-[#585C68] text-white outline-none"
              />
              <button
                disabled={isLoading || errorMessage}
                type="submit"
                className={clsx(
                  errorMessage ? "opacity-50" : "hover:cursor-pointer",
                  "group flex flex-col items-center justify-center rounded-full bg-[#8C6A71] p-4 text-white lg:p-2 "
                )}
              >
                <Icon
                  icon={"mingcute:send-line"}
                  className={clsx(
                    !errorMessage && "group-hover:scale-110",
                    "text-2xl text-white transition-all lg:text-xl"
                  )}
                />
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}

export default Chat;
