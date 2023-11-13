import { RadioGroup } from "@headlessui/react";
import { Icon } from "@iconify/react";
import clsx from "clsx";
import React from "react";
import useSession from "../../hooks/useSession";

const SideBar = ({ value, setValue }) => {
  const { signOut } = useSession();
  const { session } = useSession();

  const SIDEBAR_VALUES = [
    { value: "home", icon: "iconoir:home" },
    { value: "knowledge-feeder", icon: "uil:brain" },
    { value: "redirected-inquiries", icon: "tabler:message-question" },

    session?.role === "ADMIN" && {
      value: "account-settings",
      icon: "material-symbols:settings-account-box-outline-rounded",
    },
  ];

  const radioGroupElements = SIDEBAR_VALUES.map((item, key) =>
    item ? (
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
    ) : null
  );
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
        <button
          onClick={() => signOut()}
          className="flex items-center justify-center rounded-lg bg-white p-5 text-3xl"
        >
          <Icon icon={"majesticons:logout"} />
        </button>
      </div>
    </div>
  );
};

export default SideBar;
