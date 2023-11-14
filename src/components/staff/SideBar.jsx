import { RadioGroup } from "@headlessui/react";
import { Icon } from "@iconify/react";
import clsx from "clsx";
import React from "react";
import useSession from "../../hooks/useSession";
import useDarkMode from "../../hooks/useDarkMode";
import LOGO from "../../assets/logo.svg";
import BRAIN from "../../assets/Group.svg";
import QUERY from "../../assets/Group (1).svg";
import SETTINGS from "../../assets/Group (2).svg";
import LOGOUT from "../../assets/Group (3).svg";

const SideBar = ({ value, setValue }) => {
  const { signOut } = useSession();
  const { session } = useSession();
  const { handleToggle, isDark } = useDarkMode();

  const SIDEBAR_VALUES = [
    { value: "home", icon: LOGO },
    { value: "knowledge-feeder", icon: BRAIN },
    { value: "redirected-inquiries", icon: QUERY },
    session?.role === "ADMIN" && {
      value: "account-settings",
      icon: SETTINGS,
    },
  ];

  const radioGroupElements = SIDEBAR_VALUES.map((item, key) =>
    item ? (
      <RadioGroup.Option
        key={key}
        value={item.value}
        className={clsx(
          "flex w-full cursor-pointer items-center justify-center rounded-lg bg-white p-5 text-3xl text-black duration-150",
          item.value === value ? "opacity-100" : "opacity-50"
        )}
      >
        <img src={item.icon} alt={key} className="h-full w-full" />
      </RadioGroup.Option>
    ) : null
  );
  return (
    <div className="flex h-full w-20 flex-col justify-between ">
      <RadioGroup
        value={value}
        onChange={setValue}
        className="flex flex-col gap-5"
      >
        {radioGroupElements}
      </RadioGroup>

      <div className="flex flex-col gap-5">
        <button
          onClick={() => handleToggle()}
          className="flex items-center justify-center rounded-lg bg-white p-5 text-3xl"
        >
          <Icon
            icon={isDark ? "entypo:light-up" : "ic:round-dark-mode"}
            className={clsx("cursor-pointer text-2xl text-black")}
          />
        </button>
        <button
          onClick={() => signOut()}
          className="flex items-center justify-center rounded-lg bg-white p-5 text-3xl"
        >
          <img src={LOGOUT} alt="logout" className="h-[30px] w-[30px]" />
        </button>
      </div>
    </div>
  );
};

export default SideBar;
