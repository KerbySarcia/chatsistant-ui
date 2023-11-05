import React, { useEffect, useRef, useState } from "react";
import TextBox from "../../../../components/staff/forms/TextBox";
import Dropdown from "../../../../components/staff/forms/Dropdown";
import TextArea from "../../../../components/staff/forms/TextArea";
import { Icon } from "@iconify/react";
import useKnowledege from "../../../../services/useKnowledge";
import { isEmpty } from "lodash";
import clsx from "clsx";
import autoAnimate from "@formkit/auto-animate";

const KnowledgeFeeder = () => {
  const [dropdownValue, setDropdownValue] = useState("target");
  const [knowledges, setKnowledges] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [knowledgePayload, setknowledgePayload] = useState({
    subject: "",
    target: "",
    information: "",
  });
  const { getKnowledges, addKnowledge } = useKnowledege();
  const parentAnimate = useRef(null);

  const isFeedButtonDisabled =
    !knowledgePayload.subject ||
    !knowledgePayload.target ||
    !knowledgePayload.information;

  useEffect(() => {
    if (!searchValue) {
      (async () => {
        setIsLoading(true);
        const knowledges = await getKnowledges({ limit: 5 });
        setKnowledges(knowledges?.items);
        setIsLoading(false);
      })();
    }
  }, [searchValue]);

  useEffect(() => {
    parentAnimate.current && autoAnimate(parentAnimate.current);
  }, [parentAnimate]);

  const handleChange = e => {
    setknowledgePayload(prevValues => ({
      ...prevValues,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSearch = async () => {
    setIsLoading(true);
    const results = await getKnowledges({
      limit: 10,
      page: 1,
      search: searchValue,
      options: dropdownValue,
    });
    setKnowledges(results.items);
    setIsLoading(false);
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    const newKnowledge = await addKnowledge(knowledgePayload);
    setKnowledges([...knowledges, newKnowledge.data]);
    setknowledgePayload({
      subject: "",
      target: "",
      information: "",
    });
    setIsLoading(false);
  };

  const tableElemets = knowledges.map((knowledge, key) => (
    <tr
      key={key}
      className={clsx(
        "flex w-full justify-between gap-5 rounded-b-md rounded-t-lg p-5 text-left",
        key % 2 !== 0 && "bg-[#323745]"
      )}
    >
      <td className="flex-1">{knowledge?.subject}</td>
      <td className="flex-1">{knowledge?.target}</td>
      <td className="flex-1">{knowledge?.information}</td>
      <td>
        <button>Edit</button>
        <button>Delete</button>
      </td>
    </tr>
  ));

  return (
    <div className="flex h-full w-full flex-col gap-5">
      <h1
        className="w-full rounded-b-md rounded-t-lg bg-black/50 p-5 text-center 
        font-productSansBlack text-xl text-white "
      >
        Knowledge Feeder
      </h1>
      <div className="flex h-full w-full items-center gap-5">
        <div className="h-full w-[70%] rounded-md bg-black/50 p-5">
          <table
            ref={parentAnimate}
            className="flex h-full w-full flex-col  gap-4 text-white"
          >
            <tr className="flex w-full items-center justify-between gap-5 rounded-b-md rounded-t-lg bg-[#3D4250] p-5 text-left font-productSansBlack">
              <th className="flex-1">Subject</th>
              <th className="flex-1">Target</th>
              <th className="flex-1">Value</th>
              <th className="">Actions</th>
            </tr>
            <div className="">
              {!isEmpty(knowledges) ? (
                tableElemets
              ) : isLoading ? (
                <span className="w-full text-center">Loading...</span>
              ) : (
                <span className="w-full text-center">Knowledge is empty</span>
              )}
            </div>
          </table>
        </div>
        <div className="flex h-full w-[30%] flex-col gap-5">
          <div className="flex h-fit w-full flex-col gap-5 rounded-md bg-black/50 p-5 ">
            <TextBox
              value={searchValue}
              onChange={e => setSearchValue(e.target.value)}
              isDisabled={isLoading}
              label={"Search"}
            />
            <div className="flex items-end gap-5">
              <Dropdown
                label={"Search in"}
                selectedValue={dropdownValue}
                setSelectedValue={setDropdownValue}
                options={["target", "subject", "information"]}
              />
              <button
                onClick={handleSearch}
                disabled={isLoading || !searchValue}
                className={clsx(
                  "flex h-[44px] items-center justify-center rounded-md bg-[#4A5168] p-4 text-xl text-white duration-150 hover:opacity-50",
                  isLoading || !searchValue ? "opacity-50" : "opacity-100"
                )}
              >
                <Icon icon={"iconamoon:search-bold"} />
              </button>
            </div>
          </div>
          <div className="flex h-full w-full flex-col gap-5 rounded-md bg-black/50 p-5">
            <TextBox
              value={knowledgePayload.subject}
              onChange={handleChange}
              label={"Subject"}
              name={"subject"}
              isDisabled={isLoading}
            />
            <TextArea
              value={knowledgePayload.target}
              onChange={handleChange}
              label={"Target"}
              name={"target"}
              isDisabled={isLoading}
            />
            <TextArea
              value={knowledgePayload.information}
              onChange={handleChange}
              label={"Value"}
              name={"information"}
              isDisabled={isLoading}
            />
            <button
              disabled={isFeedButtonDisabled || isLoading}
              onClick={handleSubmit}
              className={clsx(
                "rounded-md bg-[#4A5168] p-3 text-white",
                isFeedButtonDisabled || isLoading ? "opacity-50" : "opacity-100"
              )}
            >
              Feed
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default KnowledgeFeeder;
