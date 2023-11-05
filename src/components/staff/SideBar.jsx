import { RadioGroup } from "@headlessui/react";
import { Icon } from "@iconify/react";
import clsx from "clsx";
import React from "react";

const SIDEBAR_VALUES = [
  { value: "home", icon: "iconoir:home" },
  { value: "knowledge-feeder", icon: "uil:brain" },
  { value: "redirected-inquiries", icon: "tabler:message-question" },
  { value: "analytics", icon: "solar:chart-outline" },
  {
    value: "account-settings",
    icon: "material-symbols:settings-account-box-outline-rounded",
  },
];

const SideBar = ({ value, setValue }) => {
  const radioGroupElements = SIDEBAR_VALUES.map((item, key) => (
    <RadioGroup.Option
      key={key}
      value={item.value}
      className={clsx(
        "flex cursor-pointer items-center justify-center rounded-lg bg-white p-5 text-3xl text-black duration-150",
        item.value === value ? "opacity-100" : "opacity-50"
      )}
    >
      <Icon className="text-center" icon={item.icon} />
    </RadioGroup.Option>
  ));
  return (
    <div className="flex h-full w-20 flex-col justify-between">
      <RadioGroup
        value={value}
        onChange={setValue}
        className="flex flex-col gap-5"
      >
        {radioGroupElements}
      </RadioGroup>

      <div className="flex flex-col gap-5">
        <button className="flex items-center justify-center rounded-lg bg-white p-5 text-3xl">
          <Icon icon={"iconamoon:mode-light-fill"} />
        </button>
        <button className="flex items-center justify-center rounded-lg bg-white p-5 text-3xl">
          <Icon icon={"majesticons:logout"} />
        </button>
      </div>
    </div>
  );
};

export default SideBar;
