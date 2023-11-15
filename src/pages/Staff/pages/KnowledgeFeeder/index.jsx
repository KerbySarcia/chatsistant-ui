import React, { createContext, useEffect, useRef, useState } from "react";
import TextBox from "../../../../components/staff/forms/TextBox";
import Dropdown from "../../../../components/staff/forms/Dropdown";
import TextArea from "../../../../components/staff/forms/TextArea";
import { Icon } from "@iconify/react";
import useKnowledege from "../../../../services/useKnowledge";
import { isEmpty } from "lodash";
import clsx from "clsx";
import autoAnimate from "@formkit/auto-animate";
import LoadingSpinner from "../../../../components/LoadingSpinner";
import { ToastContainer, toast } from "react-toastify";
import useDarkMode from "../../../../hooks/useDarkMode";
import "react-toastify/dist/ReactToastify.css";
import DropdownSearch from "../../../../components/staff/knowledge-feeder/DropdownSearch";

const KnowledgeFeeder = () => {
  const [dropdownValue, setDropdownValue] = useState("target");
  const [knowledges, setKnowledges] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [isDeleteLoading, setIsDeleteLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const [subjects, setSubjects] = useState(null);
  const [targets, setTargets] = useState(null);
  const { isDark } = useDarkMode();

  const [knowledgePayload, setknowledgePayload] = useState({
    subject: "",
    target: "",
    value: "",
  });
  const {
    getKnowledges,
    addKnowledge,
    deleteKnowledge,
    updateKnowledge,
    getSubjects,
    getTargets,
  } = useKnowledege();
  const parentAnimate = useRef(null);

  const isFeedButtonDisabled =
    !knowledgePayload.subject ||
    !knowledgePayload.target ||
    !knowledgePayload.value;

  useEffect(() => {
    if (!searchValue) {
      (async () => {
        setIsLoading(true);
        const knowledges = await getKnowledges({ limit: 20 });
        setKnowledges(knowledges?.items);
        setIsLoading(false);
      })();
    }
  }, [searchValue]);

  useEffect(() => {
    parentAnimate.current && autoAnimate(parentAnimate.current);
  }, [parentAnimate]);

  useEffect(() => {
    (async () => {
      const subjectsReponse = await getSubjects();
      const targetResponse = await getTargets();
      setSubjects(
        Array.from(new Set(subjectsReponse.map(item => item.subject)))
      );
      setTargets(Array.from(new Set(targetResponse.map(item => item.target))));
    })();
  }, []);

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

  const handleDelete = async id => {
    setIsDeleteLoading(true);
    const deletedKnowledge = await deleteKnowledge(id);
    setKnowledges(knowledges.filter(knowledge => knowledge?._id !== id));
    setIsDeleteLoading(false);
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    try {
      if (knowledgePayload?._id) {
        const newKnowledge = await updateKnowledge(knowledgePayload);
        setKnowledges([
          ...knowledges.map(knowledge =>
            knowledge._id === newKnowledge._id ? newKnowledge : knowledge
          ),
        ]);
        toast.success("Successfully Updated!", {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: isDark ? "dark" : "light",
        });
      } else {
        const newKnowledge = await addKnowledge(knowledgePayload);

        if (newKnowledge?.data?.status_code === 409) {
          setIsLoading(false);
          toast.error(newKnowledge?.data?.message, {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: isDark ? "dark" : "light",
          });
          return;
        }

        setKnowledges([newKnowledge.data, ...knowledges]);
        toast.success("Successfully Added!", {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: isDark ? "dark" : "light",
        });
      }

      setknowledgePayload({
        subject: "",
        target: "",
        value: "",
      });
    } catch (err) {
      toast.error("Something went wrong", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: isDark ? "dark" : "light",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const tableElemets = knowledges.map((knowledge, key) => (
    <tr
      key={key}
      className={clsx(
        "flex w-full justify-between gap-5 rounded-b-md rounded-t-lg p-5 text-left text-black/60 dark:text-white",
        key % 2 !== 0 && "bg-[#F7F7F7] dark:bg-[#323745]"
      )}
    >
      <td className="flex-1 break-words">{knowledge?.subject}</td>
      <td className="flex-1 break-words">{knowledge?.target}</td>
      <td className="flex-1 break-words">{knowledge.value}</td>
      <td className="flex w-[100px] flex-col gap-1">
        <button
          onClick={() => {
            setknowledgePayload(knowledge);
          }}
          className="rounded border border-white/30 bg-[#8EABF2] text-white duration-200 hover:bg-blue-400 dark:bg-black/30 dark:text-white/60"
        >
          Edit
        </button>
        <button
          className=" rounded border border-white/30 bg-[#F28E8E] text-white duration-200 hover:bg-red-400 dark:bg-black/30 dark:text-white/60"
          onClick={async () => {
            await handleDelete(knowledge?._id);
            toast.error("Successfully Deleted", {
              position: "top-right",
              autoClose: 5000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
              theme: isDark ? "dark" : "light",
            });
          }}
        >
          Delete
        </button>
      </td>
    </tr>
  ));
  console.log(knowledgePayload);
  return (
    <>
      {isDeleteLoading && (
        <div className="absolute left-0 top-0 z-10 flex h-full w-full items-center justify-center bg-black/50">
          <LoadingSpinner />
        </div>
      )}
      <ToastContainer />
      <div className="relative flex h-full w-full flex-col gap-5">
        <h1
          className="font-productSansBlack w-full rounded-b-md rounded-t-lg bg-white p-5 text-center 
        text-xl text-black/60 dark:bg-black/50 dark:text-white "
        >
          Knowledge Feeder
        </h1>
        <div className="flex h-full w-full items-center gap-5 overflow-y-auto">
          <div className="relative flex h-full w-[70%] overflow-y-auto rounded-md bg-white p-5 pt-0 dark:bg-black/50">
            <table
              ref={parentAnimate}
              className="absolute left-0 top-0 flex h-full w-full flex-col gap-4   text-white"
            >
              <thead className="sticky top-0 bg-white p-5 pb-0 dark:bg-[#3D4250] dark:pt-0">
                <tr className=" font-productSansBlack flex w-full items-center justify-between gap-5 rounded-b-md rounded-t-lg bg-[#E8E8E8] p-5 text-left text-black/60 dark:bg-[#3D4250] dark:text-white">
                  <th className="flex-1">Subject</th>
                  <th className="flex-1">Target</th>
                  <th className="flex-1">Value</th>
                  <th className="">Actions</th>
                </tr>
              </thead>
              <tbody className=" p-5 ">
                {!isEmpty(knowledges) ? (
                  tableElemets
                ) : isLoading ? (
                  <tr className="flex h-full w-full justify-center">
                    <td>
                      <LoadingSpinner />
                    </td>
                  </tr>
                ) : (
                  <tr className="flex w-full justify-center">
                    <td>Knowledge is empty</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          <div className="flex h-full w-[30%] flex-col gap-5">
            {errorMessage ? (
              <h1 className="rounded-md bg-red-300 p-5 text-center text-sm text-red-800">
                {errorMessage}
              </h1>
            ) : null}
            <div className="flex h-fit w-full flex-col gap-5 rounded-md bg-white p-5 dark:bg-black/50  ">
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
                  options={["target", "subject", "value"]}
                />
                <button
                  onClick={handleSearch}
                  disabled={isLoading || !searchValue}
                  className={clsx(
                    "flex h-[44px] items-center justify-center rounded-md bg-[#8EABF2] p-4 text-xl text-white duration-150 hover:opacity-50 dark:bg-[#4A5168]",
                    isLoading || !searchValue ? "opacity-50" : "opacity-100"
                  )}
                >
                  <Icon icon={"iconamoon:search-bold"} />
                </button>
              </div>
            </div>
            <div className="flex h-full w-full flex-col gap-5 rounded-md bg-white p-5 dark:bg-black/50">
              {/* <TextBox
                value={knowledgePayload.subject}
                onChange={handleChange}
                label={"Subject"}
                name={"subject"}
                isDisabled={isLoading}
              /> */}
              <DropdownSearch
                options={subjects}
                selectedValue={knowledgePayload.subject}
                setSelectedValue={v =>
                  setknowledgePayload(prev => ({ ...prev, subject: v }))
                }
                label="Subject"
              />
              <DropdownSearch
                options={targets}
                selectedValue={knowledgePayload.target}
                setSelectedValue={v =>
                  setknowledgePayload(prev => ({ ...prev, target: v }))
                }
                label="Target"
              />
              {/* <TextArea
                value={knowledgePayload.target}
                onChange={handleChange}
                label={"Target"}
                name={"target"}
                isDisabled={isLoading}
              /> */}
              <TextArea
                value={knowledgePayload.value}
                onChange={handleChange}
                label={"Value"}
                name={"value"}
                isDisabled={isLoading}
              />
              <div className="flex w-full items-center gap-2">
                <button
                  disabled={isFeedButtonDisabled || isLoading}
                  onClick={handleSubmit}
                  className={clsx(
                    "w-full rounded-md bg-[#8EABF2] p-3 text-white dark:bg-[#4A5168]",
                    isFeedButtonDisabled || isLoading
                      ? "opacity-50"
                      : "opacity-100"
                  )}
                >
                  {knowledgePayload?._id ? "Update" : "Feed"}
                </button>
                {knowledgePayload?._id ? (
                  <button
                    disabled={isFeedButtonDisabled || isLoading}
                    onClick={() =>
                      setknowledgePayload({
                        subject: "",
                        target: "",
                        value: "",
                      })
                    }
                    className={clsx(
                      "w-full rounded-md bg-[#4A5168] p-3 text-white",
                      isFeedButtonDisabled || isLoading
                        ? "opacity-50"
                        : "opacity-100"
                    )}
                  >
                    Cancel
                  </button>
                ) : null}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default KnowledgeFeeder;
