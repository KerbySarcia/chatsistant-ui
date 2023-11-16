import { Icon } from "@iconify/react";
import React, { useEffect, useRef, useState } from "react";
import useKnowledege from "../../services/useKnowledge";
import autoAnimate from "@formkit/auto-animate";
import LoadingAnimation from "../../assets/lottie/animation_lnkk9t58.json";
import Lottie from "lottie-react";
import SideBar from "../../components/staff/SideBar";
import { Route, Routes } from "react-router-dom";
import Home from "./pages/home";
import KnowledgeFeeder from "./pages/KnowledgeFeeder";
import RedirectedInquiries from "./pages/RedirectedInquiries";
import Analytics from "./pages/Analytics";
import AccountSettings from "./pages/AccountSettings";
import useSession from "../../hooks/useSession";

function Staff() {
  const [value, setValue] = useState("home");
  const { signOut } = useSession();
  let renderComponent = <Home />;

  switch (value) {
    case "home":
      renderComponent = <Home />;
      break;
    case "knowledge-feeder":
      renderComponent = <KnowledgeFeeder />;
      break;
    case "redirected-inquiries":
      renderComponent = <RedirectedInquiries />;
      break;
    case "analytics":
      renderComponent = <Analytics />;
      break;
    case "account-settings":
      renderComponent = <AccountSettings />;
      break;
    default:
      renderComponent = <Home />;
  }

  return (
    <>
      <div className="flex h-screen w-full flex-col items-center justify-center gap-5 bg-[#3F4B69]  text-white lg:hidden">
        <span>Mobile View is not available 🫠</span>
        <button
          className="w-[100px] rounded-md bg-white p-2 text-[#3F4B69]"
          onClick={() => signOut()}
        >
          Sign out
        </button>
      </div>
      <div className="h-screen bg-blue-500 duration-200 dark:bg-gradient-to-t dark:from-[#37243E]  dark:to-[#3F4B69] ">
        <div className=" hidden h-full items-center gap-5 bg-white/50 p-5 dark:bg-transparent lg:flex">
          <SideBar value={value} setValue={setValue} />
          <div className="flex h-full w-full rounded-xl bg-white/40  p-5 backdrop-blur-sm dark:bg-white/10">
            {renderComponent}
          </div>
        </div>
      </div>
    </>
  );
}

export default Staff;
