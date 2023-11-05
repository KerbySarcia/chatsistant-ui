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

function Staff() {
  const [value, setValue] = useState("home");
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
    <div className=" flex h-screen items-center gap-5 bg-gradient-to-t from-[#37243E]  to-[#3F4B69] p-5">
      <SideBar value={value} setValue={setValue} />
      <div className="flex h-full w-full rounded-xl  bg-white/10 p-5 backdrop-blur-sm">
        {renderComponent}
      </div>
    </div>
  );
}

export default Staff;
