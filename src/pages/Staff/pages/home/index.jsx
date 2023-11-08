import { Icon } from "@iconify/react";
import React from "react";

const Home = () => {
  return (
    <div className="flex h-full w-full flex-col gap-5 p-10">
      <div className=" flex flex-col text-4xl text-white">
        <h1>
          Hello, <span className="font-productSansBlack">Kerby Sarcia!</span>
        </h1>
        <h2>Welcome to your Staff Dashboard.</h2>
      </div>
      <div className="flex items-center gap-5">
        <div className="flex h-full w-full items-center justify-center gap-5 rounded-lg bg-black/30 p-5 text-white">
          <Icon icon={"uil:brain"} className="text-9xl" />
          <div className="flex flex-col ">
            <span className="font-productSansBlack text-7xl">1533</span>
            <span className="text-2xl">Registered Information</span>
          </div>
        </div>
        <div className="flex h-full w-full items-center justify-center gap-5 rounded-lg bg-black/30 p-5 text-white">
          <Icon icon={"tabler:message-question"} className="text-9xl" />
          <div className="flex flex-col ">
            <span className="font-productSansBlack text-7xl">17</span>
            <span className="text-2xl">Unanswered Inquiry</span>
          </div>
        </div>
      </div>
      <div className="flex h-full w-full items-center justify-center gap-5 rounded-lg bg-black/30 p-5 text-white">
        <Icon icon={"solar:chart-outline"} className="text-9xl" />
        <div className="flex flex-col ">
          <span className="font-productSansBlack text-9xl">1137</span>
          <span className="text-2xl">
            Received inquiries by the DHVChat AI Chat Assistant
          </span>
        </div>
      </div>
    </div>
  );
};

export default Home;
