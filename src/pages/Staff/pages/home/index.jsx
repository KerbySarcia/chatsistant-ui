import { Icon } from "@iconify/react";
import React, { useEffect, useState } from "react";
import useKnowledege from "../../../../services/useKnowledge";
import LoadingSpinner from "../../../../components/LoadingSpinner";
import useInquiryService from "../../../../services/useInquiryService";
import useSession from "../../../../hooks/useSession";
import useUserService from "../../../../services/useUserService";

const Home = ({ handleNav }) => {
  const [knowledges, setKnowledges] = useState(null);
  const [numberOfPending, setNumberOfPending] = useState(null);
  const [users, setUsers] = useState(null);
  const [questions, setQuestions] = useState(null);
  const knowldegeService = useKnowledege();
  const inquiryService = useInquiryService();
  const userService = useUserService();
  const { session } = useSession();

  useEffect(() => {
    (async () => {
      const responseKnowledge = await knowldegeService.getKnowledges();
      const responseInquiry = await inquiryService.getAll();
      const responseQuestions = await inquiryService.getAllQuestionsCount();
      const responseUser = await userService.getUsers();
      setQuestions(responseQuestions.length);
      setUsers(responseUser.filter(user => user.role === "USER").length);
      setKnowledges(responseKnowledge.items);
      setNumberOfPending(
        responseInquiry.items.filter(inquiry => inquiry.status === "PENDING")
          .length
      );
    })();
  }, []);

  if (!knowledges && !numberOfPending && !users && !questions)
    return (
      <div className="flex h-full w-full items-center justify-center">
        <LoadingSpinner />
      </div>
    );

  return (
    <div className="flex h-full w-full flex-col gap-5 p-10 ">
      <div className=" flex flex-col text-4xl text-black/60 dark:text-white">
        <h1>
          Hello,{" "}
          <span className="font-productSansBlack">
            {session?.first_name + " " + session?.last_name}!
          </span>
        </h1>
        <h2>Welcome to your Staff Dashboard.</h2>
      </div>
      <div className="flex items-center gap-5">
        <div
          onClick={() => handleNav("knowledge-feeder")}
          className="flex h-full w-full cursor-pointer items-center justify-center gap-5 rounded-lg bg-[#8EABF2] p-5 text-white duration-300 dark:bg-black/30"
        >
          <Icon icon={"uil:brain"} className="text-9xl" />
          <div className="flex flex-col ">
            <span className="font-productSansBlack text-7xl">
              {knowledges.length}
            </span>
            <span className="text-2xl">Registered Information</span>
          </div>
        </div>
        <div
          onClick={() => handleNav("redirected-inquiries")}
          className="flex h-full w-full cursor-pointer items-center justify-center gap-5 rounded-lg bg-[#F28E8E] p-5 text-white duration-300 dark:bg-black/30"
        >
          <Icon icon={"tabler:message-question"} className="text-9xl" />
          <div className="flex flex-col ">
            <span className="font-productSansBlack text-7xl">
              {numberOfPending}
            </span>
            <span className="text-2xl">Unanswered Inquiry</span>
          </div>
        </div>
      </div>
      <div className="flex h-full gap-5">
        <div className="flex h-full w-full items-center justify-center gap-5 rounded-lg bg-[#908EF2] p-5 text-white duration-300 dark:bg-black/30">
          <Icon icon={"solar:chart-outline"} className="text-[200px]" />
          <div className="flex flex-col ">
            <span className="font-productSansBlack text-9xl">{questions}</span>
            <span className="text-2xl">
              Received inquiries by the DHVChat AI Chat Assistant
            </span>
          </div>
        </div>
        <div className="flex h-full w-full items-center justify-center gap-3 rounded-lg bg-black/30 p-5 text-white duration-300">
          <Icon icon={"tabler:user-filled"} className="text-[200px]" />
          <div className="flex flex-col ">
            <span className="font-productSansBlack text-8xl">{users}</span>
            <span className="text-2xl">Registered Users</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
