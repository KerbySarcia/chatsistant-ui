import { Icon } from "@iconify/react";
import React, { useEffect, useRef, useState } from "react";
import useKnowledege from "../../services/useKnowledge";
import autoAnimate from "@formkit/auto-animate";
import LoadingAnimation from "../../assets/lottie/animation_lnkk9t58.json";
import Lottie from "lottie-react";

function Staff() {
  const [knowledges, setKnowledges] = useState([]);
  const [knowledge, setKnowledge] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const { addKnowledge, getKnowledges } = useKnowledege();
  const knowledgeAnimate = useRef(null);
  const messageRef = useRef(null);

  const scrollToBottom = () => {
    messageRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (messageRef.current) {
      scrollToBottom();
    }
  }, [knowledges]);

  useEffect(() => {
    knowledgeAnimate.current && autoAnimate(knowledgeAnimate.current);
  }, [knowledgeAnimate]);

  useEffect(() => {
    (async () => {
      const knowledgeResponse = await getKnowledges();
      setKnowledges(knowledgeResponse);
      setIsLoading(false);
    })();
  }, []);

  const handleSubmit = async () => {
    const append = await addKnowledge({ information: knowledge });
    setKnowledges((prevKnowledges) => [
      ...prevKnowledges,
      { information: knowledge },
    ]);
    setKnowledge("");
  };

  return (
    <div className="h-screen bg-[#2D354B] flex p-5 ">
      <div className="h-full w-[5%] "></div>
      <div className="bg-white w-full h-full flex flex-col gap-5 rounded-lg p-5">
        <h1 className="font-productSansBlack h-[5%]  text-lg">
          Hello, Kerby Sarcia!
        </h1>

        <div className="bg-[#F5F5F5] h-[17%] flex flex-col gap-3 rounded-lg p-5">
          <h1 className="font-productSansBlack">Add Knowledge</h1>
          <div className="w-full flex gap-2">
            <input
              type="text"
              className="p-3 flex-1 rounded-full"
              value={knowledge}
              onChange={(e) => setKnowledge(e.target.value)}
            />
            <button
              className="bg-[#2D354B] w-[100px] rounded-full text-white flex justify-center items-center"
              onClick={handleSubmit}
            >
              <Icon icon={"mingcute:add-fill"} className="h-5 w-5" />
            </button>
          </div>
        </div>
        {isLoading ? (
          <div className="flex w-full justify-center">
            <Lottie animationData={LoadingAnimation} className="h-20 w-20" />
          </div>
        ) : (
          <div
            className="w-full h-[70%] overflow-y-auto flex flex-col gap-5 items-center"
            ref={knowledgeAnimate}
          >
            {knowledges.map((knowledge, index) => (
              <div
                key={index}
                className="w-[600px] bg-gray-300 p-5 text-justify rounded-md "
              >
                {knowledge.information}
              </div>
            ))}
            <div ref={messageRef} />
          </div>
        )}
      </div>
    </div>
  );
}

export default Staff;
