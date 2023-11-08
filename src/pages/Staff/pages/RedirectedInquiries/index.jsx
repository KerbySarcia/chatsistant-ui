import { Tab } from "@headlessui/react";
import { Icon } from "@iconify/react";
import clsx from "clsx";
import React, { useState } from "react";

const Button = ({ onClick, label = "", icon = "", className }) => {
  return (
    <button
      onClick={onClick}
      className={clsx(
        "flex w-full items-center justify-center gap-2 rounded-md bg-[#312E3F] p-3 text-xs text-white/60 2xl:text-base ",
        className
      )}
    >
      <Icon icon={icon} className="text-lg" />
      <span>{label}</span>
    </button>
  );
};

const RedirectedInquiries = () => {
  const [tabValue, setTabValue] = useState(0);
  return (
    <div className="flex h-full w-full flex-col gap-5">
      <h1
        className="w-full rounded-b-md rounded-t-lg bg-black/50 p-5 text-center 
        font-productSansBlack text-xl text-white "
      >
        Redirected Inquiries
      </h1>
      <Tab.Group onChange={setTabValue}>
        <Tab.List className={"flex items-center justify-between gap-5"}>
          <div className="flex items-center gap-5">
            {["Pending", "Responded", "Ignored"].map((item, key) => (
              <Tab
                key={key}
                className={clsx(
                  "rounded-md bg-black/50 p-2 px-5 text-white duration-150",
                  tabValue === key ? "opacity-100" : "opacity-50"
                )}
              >
                <span>
                  {item} {key === 0 && "(10)"}
                </span>
              </Tab>
            ))}
          </div>
          <button className="rounded-md bg-black/50 p-2 px-5 text-white">
            Sort By: Date
          </button>
        </Tab.List>
        <Tab.Panels
          className={
            " flex h-full w-full justify-center  overflow-y-auto rounded-md bg-black/50 p-5"
          }
        >
          <Tab.Panel
            className={
              "grid h-full max-h-[400px] w-full max-w-[1200px] grid-cols-1 gap-5 lg:grid-cols-2"
            }
          >
            <div className="flex w-full max-w-[600px] flex-col gap-5 rounded-md bg-black/30 p-5">
              <div className="flex w-full flex-col rounded-md bg-[#2C2A37] p-3">
                <span className="font-productSansBlack text-white">
                  From: Kerby
                </span>
                <div className="flex items-center justify-between text-sm text-white/60">
                  <span>Email: kerby@gmail.com</span>
                  <span>October 27, 2020 | 12:00pm</span>
                </div>
              </div>
              <div className="flex h-full w-full flex-col rounded-md bg-[#2C2E3C] p-3 text-white/80">
                <span>Sarcia</span>
                <span>Sarcia</span>
                <span>Sarcia</span>
                <span>Sarcia</span>
                <span>Sarcia</span>
              </div>
              <div className="flex w-full flex-col items-center gap-5 xl:flex-row">
                <Button
                  label="Ignore"
                  icon={"simple-line-icons:minus"}
                  onClick={() => {}}
                  className={"!bg-[#3D2E3F]"}
                />
                <Button
                  label="Respond Directly"
                  icon={"icon-park-outline:send-email"}
                  onClick={() => {}}
                />
                <Button
                  label="Add Feed"
                  icon={"ic:round-playlist-add"}
                  onClick={() => {}}
                />
              </div>
            </div>
            <div className="flex h-full max-h-[400px] w-full max-w-[600px] flex-col gap-5 rounded-md bg-black/30 p-5">
              <div className="flex w-full flex-col rounded-md bg-[#2C2A37] p-3">
                <span className="font-productSansBlack text-white">
                  From: Kerby
                </span>
                <div className="flex items-center justify-between text-sm text-white/60">
                  <span>Email: kerby@gmail.com</span>
                  <span>October 27, 2020 | 12:00pm</span>
                </div>
              </div>
              <div className="flex h-full w-full flex-col rounded-md bg-[#2C2E3C] p-3 text-white/80">
                <span>Sarcia</span>
                <span>Sarcia</span>
                <span>Sarcia</span>
              </div>
              <div className="flex w-full flex-col items-center gap-5 xl:flex-row">
                <Button
                  label="Ignore"
                  icon={"simple-line-icons:minus"}
                  onClick={() => {}}
                  className={"!bg-[#3D2E3F]"}
                />
                <Button
                  label="Respond Directly"
                  icon={"icon-park-outline:send-email"}
                  onClick={() => {}}
                />
                <Button
                  label="Add Feed"
                  icon={"ic:round-playlist-add"}
                  onClick={() => {}}
                />
              </div>
            </div>
          </Tab.Panel>
          <Tab.Panel>Content 2</Tab.Panel>
          <Tab.Panel>Content 3</Tab.Panel>
        </Tab.Panels>
      </Tab.Group>
    </div>
  );
};

export default RedirectedInquiries;
