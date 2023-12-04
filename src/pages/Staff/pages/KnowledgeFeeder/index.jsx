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
import Options from "../../../../components/staff/knowledge-feeder/Modals/Options";
import EditModal from "../../../../components/staff/knowledge-feeder/Modals/EditModal";
import AddModal from "../../../../components/staff/knowledge-feeder/Modals/AddModal";

const KnowledgeFeeder = () => {
  const [dropdownValue, setDropdownValue] = useState("target");
  const [knowledges, setKnowledges] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [isDeleteLoading, setIsDeleteLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const [subjects, setSubjects] = useState(null);
  const [targets, setTargets] = useState(null);
  const [addModal, setAddModal] = useState(false);
  const [editModal, setEditModal] = useState(false);
  const [optionModal, setOptionModal] = useState(false);
  const [optionValues, setOptionValues] = useState({
    subject: "",
    target: "",
    value: "",
  });
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

  const openEditModal = () => {
    setEditModal(true);
    closeOptionModal();
  };
  const openAddModal = () => setAddModal(true);
  const closeAddModal = () => setAddModal(false);
  const closeEditModal = () => setEditModal(false);
  const openOptionModal = () => setOptionModal(true);
  const closeOptionModal = () => setOptionModal(false);
  const handleClickOption = options => {
    openOptionModal();
    setOptionValues(options);
    setknowledgePayload({ ...options, _id: options.id });
  };

  const handleDeleteKnowledge = async id => {
    await handleDelete(id);
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
    setknowledgePayload({
      subject: "",
      target: "",
      value: "",
    });
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
      onClick={() =>
        handleClickOption({
          value: knowledge?.value,
          subject: knowledge?.subject,
          target: knowledge?.target,
          id: knowledge?._id,
        })
      }
      key={key}
      className={clsx(
        "flex w-full justify-between gap-5 rounded-b-md rounded-t-lg p-5 text-left text-black/60 dark:text-white lg:pointer-events-none",
        key % 2 !== 0 && "bg-[#F7F7F7] dark:bg-[#323745]"
      )}
    >
      <td className="flex-1 overflow-hidden text-ellipsis break-words text-xs lg:text-base">
        {knowledge?.subject}
      </td>
      <td className="flex-1 overflow-hidden text-ellipsis break-words text-xs lg:text-base">
        {knowledge?.target}
      </td>
      <td className="flex-1 overflow-hidden text-ellipsis break-words text-xs lg:text-base">
        {knowledge?.value}
      </td>
      <td className="hidden w-[100px] flex-col gap-1 lg:flex">
        <button
          onClick={() => {
            setknowledgePayload(knowledge);
          }}
          className="rounded border border-white/30 bg-[#8EABF2] text-xs text-white duration-200 hover:bg-blue-400 dark:bg-black/30 dark:text-white/60 lg:text-base"
        >
          Edit
        </button>
        <button
          className=" rounded border border-white/30 bg-[#F28E8E] text-xs text-white duration-200 hover:bg-red-400 dark:bg-black/30 dark:text-white/60 lg:text-base"
          onClick={() => handleDeleteKnowledge(knowledge?._id)}
        >
          Delete
        </button>
      </td>
    </tr>
  ));

  return (
    <>
      {isDeleteLoading && (
        <div className="absolute left-0 top-0 z-10 flex h-full w-full items-center justify-center bg-black/50">
          <LoadingSpinner />
        </div>
      )}
      <ToastContainer />
      <AddModal
        closeModal={closeAddModal}
        isOpen={addModal}
        handleChange={handleChange}
        handleSubmit={handleSubmit}
        isFeedButtonDisabled={isFeedButtonDisabled}
        isLoading={isLoading}
        knowledgePayload={knowledgePayload}
        setknowledgePayload={setknowledgePayload}
        subjects={subjects}
        targets={targets}
      />
      <EditModal
        closeModal={closeEditModal}
        isOpen={editModal}
        handleChange={handleChange}
        handleSubmit={handleSubmit}
        isFeedButtonDisabled={isFeedButtonDisabled}
        isLoading={isLoading}
        knowledgePayload={knowledgePayload}
        setknowledgePayload={setknowledgePayload}
        subjects={subjects}
        targets={targets}
      />
      <Options
        isOpen={optionModal}
        closeModal={closeOptionModal}
        knowledge={optionValues}
        deleteKnowledge={handleDeleteKnowledge}
        openEditModal={openEditModal}
        setknowledgePayload={setknowledgePayload}
      />

      <div className="relative flex h-screen w-full flex-col gap-5 lg:h-full">
        <div className="flex items-center justify-between rounded-b-md  rounded-t-lg bg-white p-5 dark:bg-black/50">
          <h1
            className="w-full text-center
          font-productSansBlack text-xl text-black/60  dark:text-white "
          >
            Knowledge Feeder
          </h1>
          <Icon
            icon={"fluent:add-16-filled"}
            onClick={openAddModal}
            className="rounded-full bg-gray-200 p-1 text-xl dark:bg-white lg:hidden"
          />
        </div>
        <div className="flex h-full w-full items-center gap-5 overflow-y-auto">
          <div className="relative flex h-full w-full overflow-y-auto rounded-md bg-white p-5 pt-0 dark:bg-black/50 lg:w-[70%]">
            <table
              ref={parentAnimate}
              className="absolute left-0 top-0 flex h-full w-full flex-col gap-4   text-white"
            >
              <thead className="sticky top-0 bg-white p-5 pb-0 dark:bg-[#3D4250] dark:pt-0">
                <tr className=" flex w-full items-center justify-between gap-5 rounded-b-md rounded-t-lg bg-[#E8E8E8] p-5 text-left font-productSansBlack text-black/60 dark:bg-[#3D4250] dark:text-white">
                  <th className="flex-1 text-xs lg:text-base">Subject</th>
                  <th className="flex-1 text-xs lg:text-base">Target</th>
                  <th className="flex-1 text-xs lg:text-base">Value</th>
                  <th className="hidden lg:block">Actions</th>
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
                  <tr className="flex w-full justify-center text-xs lg:text-base">
                    <td>Knowledge is empty</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          <div className="hidden h-full w-[30%] flex-col gap-5 lg:flex">
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
