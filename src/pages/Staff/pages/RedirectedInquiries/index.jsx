import { Listbox, Tab } from "@headlessui/react";
import { Icon } from "@iconify/react";
import clsx from "clsx";
import React, { createContext, useContext, useEffect, useState } from "react";
import useInquiryService from "../../../../services/useInquiryService";
import dateFormat from "../../../../../utils/dateFormat";
import FeedModal from "../../../../components/staff/FeedModal";
import RespondDirectly from "../../../../components/staff/RespondDirectly";

const Button = ({ onClick, label = "", icon = "", className }) => {
  return (
    <button
      onClick={onClick}
      className={clsx(
        "flex w-full items-center justify-center gap-2 rounded-md p-3 text-xs dark:bg-[#312E3F] dark:text-white/60 2xl:text-sm ",
        className
      )}
    >
      <Icon icon={icon} className="text-lg" />
      <span>{label}</span>
    </button>
  );
};

const DateSort = ({ dateSort, setDateSort }) => {
  return (
    <Listbox
      as={"div"}
      onChange={setDateSort}
      className={"flex w-full flex-col items-center gap-1 p-1 lg:p-0"}
    >
      <Listbox.Button
        className={
          "w-full rounded-md bg-white p-1 text-black/60 dark:bg-[#2C2E3C] dark:text-white lg:w-[200px]"
        }
      >
        {dateSort ? dateSort : "Sort By Date"}
      </Listbox.Button>
      <div className="relative flex justify-center">
        <Listbox.Options
          className={
            "absolute flex w-[200px] flex-col rounded-md border bg-white dark:bg-gray-600 "
          }
        >
          {["Ascending", "Descending"].map((option, key) => (
            <Listbox.Option
              value={option}
              className={
                "cursor-pointer p-3 text-center text-black/60 hover:bg-gray-100 dark:text-white dark:hover:text-black/60"
              }
              key={key}
            >
              {option}
            </Listbox.Option>
          ))}
        </Listbox.Options>
      </div>
    </Listbox>
  );
};

const Card = ({
  id,
  user_email,
  date,
  question,
  user_name,
  status,
  answer,
}) => {
  const inquiryService = useInquiryService();
  const [isOpenModal, setIsOpenModal] = useState(false);
  const [isOpenModalDirect, setIsOpenModalDirect] = useState(false);
  const { inquiries, setInquiries } = useContext(InquiriesContext);

  const handleAddFeed = () => {
    setIsOpenModal(true);
  };

  const handleDirectSend = () => {
    setIsOpenModalDirect(true);
  };

  return (
    <>
      <FeedModal
        id={id}
        question={question}
        isOpen={isOpenModal}
        setIsOpen={setIsOpenModal}
        user={user_email}
      />
      <RespondDirectly
        question={question}
        isOpen={isOpenModalDirect}
        setIsOpen={setIsOpenModalDirect}
        user={user_email}
        id={id}
      />
      <div className="flex w-full max-w-[600px] flex-col gap-5 rounded-md bg-[#C7D3EE] p-5 dark:bg-black/30">
        <div className="flex w-full flex-col rounded-md bg-[#E8E3F8] p-3 dark:bg-[#2C2A37]">
          <span className="overflow-hidden text-ellipsis font-productSansBlack text-black/60 dark:text-white">
            From: {user_name}
          </span>
          <div className="flex flex-col justify-between text-sm text-black/40 dark:text-white/60 md:flex-row md:items-center">
            <span className="overflow-hidden text-ellipsis">
              Email: {user_email}
            </span>
            <span className="overflow-hidden text-ellipsis">
              {dateFormat(date)}
            </span>
          </div>
        </div>
        <div className="flex h-full w-full flex-col break-words rounded-md bg-[#DFE8FD] p-3 text-black/60 dark:bg-[#2C2E3C] dark:text-white/80">
          <span>{question}</span>{" "}
        </div>
        {answer ? (
          <div className="flex h-full w-full flex-col break-words rounded-md bg-[#8C6A71] p-3 text-white/80">
            <span>{answer}</span>{" "}
          </div>
        ) : null}
        {!status ? (
          <div className="flex w-full flex-col items-center gap-5 xl:flex-row">
            <Button
              label="Ignore"
              icon={"simple-line-icons:minus"}
              onClick={async () => {
                await inquiryService.updateStatus(id, { status: "IGNORED" });
                setInquiries([
                  ...inquiries.map(inquiry =>
                    inquiry._id === id
                      ? { ...inquiry, status: "IGNORED" }
                      : inquiry
                  ),
                ]);
              }}
              className={"!bg-[#F28E8E] !text-white dark:!bg-[#3D2E3F]"}
            />
            <Button
              label="Respond Directly"
              icon={"icon-park-outline:send-email"}
              onClick={handleDirectSend}
              className={"!bg-[#8EABF2] !text-white dark:!bg-[#3D2E3F]"}
            />
            <Button
              label="Add Feed"
              icon={"ic:round-playlist-add"}
              onClick={handleAddFeed}
              className={"!bg-[#8EABF2] !text-white dark:!bg-[#3D2E3F]"}
            />
          </div>
        ) : null}
      </div>
    </>
  );
};

export const InquiriesContext = createContext(null);

const RedirectedInquiries = () => {
  const [tabValue, setTabValue] = useState(0);
  const [inquiries, setInquiries] = useState(null);
  const inquiryService = useInquiryService();
  const [dateSort, setDateSort] = useState(null);

  useEffect(() => {
    (async () => {
      const allInquiries = await inquiryService.getAll();
      setInquiries(allInquiries.items);
    })();
  }, []);

  useEffect(() => {
    if (inquiries && dateSort === "Ascending") {
      setInquiries([
        ...inquiries.sort((a, b) => new Date(b.date) - new Date(a.date)),
      ]);
    }

    if (inquiries && dateSort === "Descending") {
      setInquiries([
        ...inquiries.sort((a, b) => new Date(a.date) - new Date(b.date)),
      ]);
    }
  }, [dateSort]);

  return (
    <InquiriesContext.Provider value={{ inquiries, setInquiries }}>
      <div className="flex h-screen w-full flex-col gap-5 lg:h-full">
        <h1
          className="w-full rounded-b-md rounded-t-lg bg-white p-5 text-center font-productSansBlack 
        text-xl text-black/60 dark:bg-black/50 dark:text-white "
        >
          Redirected Inquiries
        </h1>
        <Tab.Group onChange={setTabValue}>
          <Tab.List
            className={
              "flex flex-col items-center justify-between gap-5 lg:flex-row"
            }
          >
            <div className="flex w-full flex-col items-center gap-1 lg:flex-row  lg:gap-5">
              {[
                { name: "Pending", id: "PENDING" },
                { name: "Responded", id: "DONE" },
                { name: "Ignored", id: "IGNORED" },
              ].map((item, key) => (
                <Tab
                  key={key}
                  className={clsx(
                    "darktext-white w-full rounded-md p-2 px-5 duration-150 dark:bg-black/50 lg:w-fit",
                    tabValue === key
                      ? " bg-[#8EABF2] text-white dark:opacity-100"
                      : "bg-white/50 text-black/60 dark:text-white dark:opacity-50"
                  )}
                >
                  <span>
                    {item.name} (
                    {inquiries?.filter(v => item.id === v.status).length})
                  </span>
                </Tab>
              ))}
            </div>
            <DateSort dateSort={dateSort} setDateSort={setDateSort} />
          </Tab.List>
          <Tab.Panels
            className={
              " flex h-full w-full justify-center  overflow-y-auto rounded-md bg-white p-5 dark:bg-black/50"
            }
          >
            <Tab.Panel
              className={
                "grid h-full max-h-[400px] w-full max-w-[1200px] grid-cols-1 gap-5 lg:grid-cols-2"
              }
            >
              {inquiries
                ?.filter(item => item.status === "PENDING")
                ?.map((inquiry, key) => (
                  <Card
                    user_email={inquiry.user_email}
                    date={inquiry.date}
                    question={inquiry.question}
                    user_name={inquiry.user_name}
                    id={inquiry._id}
                    key={key}
                  />
                ))}
            </Tab.Panel>
            <Tab.Panel
              className={
                "grid h-full max-h-[400px] w-full max-w-[1200px] grid-cols-1 gap-5 lg:grid-cols-2"
              }
            >
              {" "}
              {inquiries
                ?.filter(item => item.status === "DONE")
                ?.map((inquiry, key) => (
                  <Card
                    status={"DONE"}
                    answer={inquiry?.answer}
                    user_email={inquiry.user_email}
                    date={inquiry.date}
                    question={inquiry.question}
                    user_name={inquiry.user_name}
                    key={key}
                  />
                ))}
            </Tab.Panel>
            <Tab.Panel
              className={
                "grid h-full max-h-[400px] w-full max-w-[1200px] grid-cols-1 gap-5 lg:grid-cols-2"
              }
            >
              {inquiries
                ?.filter(item => item.status === "IGNORED")
                ?.map((inquiry, key) => (
                  <Card
                    status={"IGNORED"}
                    user_email={inquiry.user_email}
                    date={inquiry.date}
                    question={inquiry.question}
                    user_name={inquiry.user_name}
                    key={key}
                  />
                ))}
            </Tab.Panel>
          </Tab.Panels>
        </Tab.Group>
      </div>
    </InquiriesContext.Provider>
  );
};

export default RedirectedInquiries;
