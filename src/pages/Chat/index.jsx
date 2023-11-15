import clsx from "clsx";
import useChatService from "../../services/useChatService";
import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Icon } from "@iconify/react";
import autoAnimate from "@formkit/auto-animate";
import useSession from "../../hooks/useSession";
import { isEmpty } from "lodash";
import LoadingSpinner from "../../components/LoadingSpinner";
import DHSVU_LOGO from "../../assets/images/dabchatlogo.png";
import LOGO from "../../assets/images/dhvsu-logo.png";
import Menu from "../../components/chat/Menu";
import getThreeRandomElements from "../../../utils/GetRandomElements";
import useDarkMode from "../../hooks/useDarkMode";
import DHVSU_TRANSPARENT from "../../assets/images/dhvsu_logo_new.webp";

const RANDOM_QUESTION = [
  "When is the admission period for senior high school (grade 11)?",
  "When is the admission period for laboratory high school or junior high school (grade 7)?",
  "When is the admission period for 1st year college?",
  "When is the admission period for graduate studies (masterate and doctorate) that are applicants for 1st trimester?",
  "When is the admission period for transferees?",
  "When is the admission test schedule for senior high school (grade 11)?",
  "When is the admission test schedule for laboratory high school or junior high school (grade 7)?",
  "When is the admission test schedule for 1st year college?",
  "When is the admission test schedule for graduate studies (masterate and doctorate) that are applicants for 1st trimester?",
  "When is the admission test schedule for shifters for incoming 2nd and 3rd year college for 1st semester, academic year 2023-2024?",
];

function Chat() {
  const [conversations, setConversations] = useState([]);
  const [randomQuestion, setRandomQuestion] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isOpenMenu, setIsOpenMenu] = useState(false);
  const [messageLoading, setMessageLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState(null);
  const [query, setQuery] = useState("");
  const { handleToggle, isDark } = useDarkMode();
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
  }, [animateMessage.current]);

  useEffect(() => {
    scrollToBottom();
    if (
      (isEmpty(conversations) ||
        (conversations.length === 1 &&
          conversations[0].role === "assistant")) &&
      isEmpty(randomQuestion)
    ) {
      setRandomQuestion(getThreeRandomElements(RANDOM_QUESTION));
    }
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
    <div className="flex items-end gap-2">
      {message.role === "assistant" && (
        <img
          src={DHSVU_LOGO}
          className="h-10 w-10 rounded-full object-contain object-center"
        />
      )}
      <div
        className={clsx(
          message.role === "assistant"
            ? "mr-auto max-w-[75%] break-words rounded-[1.5rem] rounded-bl-none bg-white px-6 py-[13px] text-left text-black/60 dark:bg-[#585C68] dark:text-white"
            : "ml-auto max-w-[60%] break-words rounded-[1.5rem] rounded-br-none bg-[#DC8B8B] px-6 py-[13px] text-left text-white dark:bg-[#8C6A71]",
          "w-fit p-2"
        )}
        key={key}
      >
        <span>{message.message}</span>
      </div>
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
      <div className="relative flex h-screen w-full flex-col overflow-hidden bg-blue-800/50 duration-200  dark:bg-[#2D354B] xl:flex-row xl:gap-5 xl:p-10">
        <div className="xl:flex xl:w-[30%] xl:flex-col">
          <div className="flex w-full items-center justify-between p-5">
            <Icon
              className="h-[32px] w-[32px] text-white/80 dark:text-[#ADAEB3] xl:pointer-events-none xl:hidden"
              icon={"entypo:dots-three-horizontal"}
              onClick={() => setIsOpenMenu(true)}
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
                <span className="text-sm text-white/70 dark:text-[#ADAEB3]">
                  AI Chat Assistant
                </span>
              </div>
            </div>
            <Icon
              onClick={() => handleToggle()}
              icon={isDark ? "entypo:light-up" : "ic:round-dark-mode"}
              className={clsx(
                isDark ? "text-white" : "text-black/60",
                "cursor-pointer text-center text-3xl xl:hidden"
              )}
            />
          </div>
          {/* Side */}
          <div className=" hidden h-full w-full flex-col items-center justify-between rounded-md bg-white/50 p-5 dark:bg-[#202533] xl:flex">
            <div className="flex w-full flex-col gap-3">
              <a
                href="https://www.facebook.com/dhvsuofficeofadmissions"
                target="_blank"
                rel="noreferrer"
              >
                <button className="flex w-full items-center justify-center rounded-md bg-blue-500 p-5 duration-200 hover:opacity-50">
                  <Icon icon={"bi:facebook"} className="text-2xl text-white" />
                </button>
              </a>
              <a href="https://dhvsu.edu.ph/" target="_blank" rel="noreferrer">
                <button className="flex w-full items-center justify-center rounded-md bg-[#a6304d] p-5 duration-200 hover:opacity-50">
                  <img
                    src={LOGO}
                    alt="logo"
                    className="h-[24px] w-[24px] object-cover object-center"
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
                    setRandomQuestion([]);
                    setMessageLoading(false);
                  }}
                  className="w-full rounded-md bg-white/50 p-4 text-[#9A94D9] shadow duration-200 hover:bg-red-700/50 hover:text-white dark:bg-[#2D354B] dark:text-white"
                >
                  Clear Conversation
                </button>
              ) : null}
              <div className="flex gap-2">
                <button
                  onClick={() => signOut()}
                  className="w-full rounded-md bg-white/50 p-4 text-[#9A94D9] shadow duration-200 hover:opacity-50 dark:bg-[#2D354B] dark:text-white"
                >
                  Sign out
                </button>
                <button
                  onClick={() => handleToggle()}
                  className="w-full rounded-md bg-white/50 p-4 text-[#9A94D9] shadow duration-200 hover:opacity-50 dark:bg-[#2D354B] dark:text-white"
                >
                  <Icon
                    icon={isDark ? "entypo:light-up" : "ic:round-dark-mode"}
                    className={clsx(
                      isDark ? "text-white" : "text-black/60",
                      "w-full cursor-pointer text-center text-2xl"
                    )}
                  />
                </button>
              </div>
            </div>
          </div>
        </div>
        {/* <div className="absolute bottom-0 right-[-100px] h-80 w-80 rounded-full bg-[#35243D] "></div> */}
        <div className="relative mt-auto flex h-[85%] flex-col overflow-hidden rounded-t-[46px] bg-white/50  bg-opacity-60 backdrop-blur-3xl backdrop-filter dark:bg-[#202533] xl:h-full xl:flex-1 xl:rounded-md">
          <div className="absolute left-0 top-0 -z-10 flex h-full w-full items-center justify-center opacity-10">
            <img
              src={DHVSU_TRANSPARENT}
              alt="logo-chat-transparent"
              className="h-96 w-96 object-cover object-center"
            />
          </div>
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
                <div className="flex items-end gap-2">
                  <img
                    src={DHSVU_LOGO}
                    className=" h-10 w-10 rounded-full object-contain object-center"
                  />

                  <div className="mr-auto w-fit max-w-[75%] rounded-[1.5rem] rounded-bl-none bg-white p-2 px-6 py-[13px]  text-left text-black/60 dark:bg-[#585C68] dark:text-white">
                    <Icon
                      icon={"eos-icons:three-dots-loading"}
                      className="text-4xl"
                    />
                  </div>
                </div>
              ) : null}
              <div ref={messageRef} />
              {isEmpty(conversations) ||
              (conversations.length === 1 &&
                conversations[0].role === "assistant") ? (
                <div className="mt-auto flex flex-col gap-2 md:flex-row">
                  {randomQuestion.map((m, key) => (
                    <button
                      key={key}
                      onClick={() => handleClickFirstTime(m)}
                      className="flex-1 cursor-pointer rounded-md border bg-white p-5 text-center text-sm text-black/60 duration-200 hover:opacity-50 disabled:bg-white dark:border-[#4f535d] 
                       dark:bg-[#373c4b] dark:text-white dark:hover:bg-[#686c78]"
                    >
                      {m}
                    </button>
                  ))}
                </div>
              ) : null}
            </div>
          )}
          <form
            className="flex w-full  p-4 dark:bg-gradient-to-t dark:from-[#202535]"
            onSubmit={handleSend}
          >
            <div className="flex w-full overflow-hidden rounded-full bg-white p-2 pl-8 dark:bg-[#585C68]">
              <input
                onChange={e => setQuery(e.target.value)}
                value={query}
                disabled={isLoading || errorMessage}
                type="text"
                className="w-full bg-none pr-3  text-black outline-none dark:bg-[#585C68] dark:text-white"
              />
              <button
                disabled={isLoading || errorMessage}
                type="submit"
                className={clsx(
                  errorMessage ? "opacity-50" : "hover:cursor-pointer",
                  "group flex flex-col items-center justify-center rounded-full bg-[#DC8B8B] p-4 text-white dark:bg-[#8C6A71] lg:p-2 lg:px-5 "
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
