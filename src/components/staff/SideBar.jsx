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
import Tippy from "@tippyjs/react";
import "tippy.js/dist/tippy.css";

const SideBar = ({ value, setValue }) => {
  const { signOut, session } = useSession();
  const { handleToggle, isDark } = useDarkMode();

  const SIDEBAR_VALUES = [
    { value: "home", icon: LOGO, title: "Home" },
    { value: "knowledge-feeder", icon: BRAIN, title: "Knowledge Feeder" },
    {
      value: "redirected-inquiries",
      icon: QUERY,
      title: "Redirected Inquiries",
    },
    session?.role === "ADMIN" && {
      value: "account-settings",
      icon: SETTINGS,
      title: "Account Settings",
    },
  ];

  const radioGroupElements = SIDEBAR_VALUES.map((item, key) =>
    item ? (
      <Tippy key={key} content={item.title} placement="right">
        <RadioGroup.Option
          value={item.value}
          className={clsx(
            "flex w-full cursor-pointer items-center justify-center rounded-lg bg-white p-5 text-3xl text-black duration-150",
            item.value === value ? "opacity-100" : "opacity-50"
          )}
        >
          <img src={item.icon} alt={key} className="h-full w-full" />
        </RadioGroup.Option>
      </Tippy>
    ) : null
  );
  return (
    <div className="hidden h-full w-20 flex-col justify-between lg:flex">
      <RadioGroup
        value={value}
        onChange={setValue}
        className="flex flex-col gap-5"
      >
        {radioGroupElements}
      </RadioGroup>

      <div className="flex flex-col gap-5">
        <Tippy placement="right" content={isDark ? "Light Mode" : "Dark Mode"}>
          <button
            onClick={() => handleToggle()}
            className="flex items-center justify-center rounded-lg bg-white p-5 text-3xl"
          >
            <Icon
              icon={isDark ? "entypo:light-up" : "ic:round-dark-mode"}
              className={clsx("cursor-pointer text-2xl text-black")}
            />
          </button>
        </Tippy>
        <Tippy content="Sign Out" placement="right">
          <button
            onClick={() => signOut()}
            className="flex items-center justify-center rounded-lg bg-white p-5 text-3xl"
          >
            <img src={LOGOUT} alt="logout" className="h-[30px] w-[30px]" />
          </button>
        </Tippy>
      </div>
    </div>
  );
};

export default SideBar;
