import { Listbox } from "@headlessui/react";
import { Icon } from "@iconify/react";
import clsx from "clsx";
import React from "react";

const Dropdown = ({ selectedValue, options = [], setSelectedValue, label }) => {
  return (
    <Listbox
      value={selectedValue}
      onChange={setSelectedValue}
      as={"div"}
      className={"relative w-full"}
    >
      <div className="flex flex-col gap-2">
        <Listbox.Label
          className={"font-productSansBlack text-black/60 dark:text-white"}
        >
          {label}
        </Listbox.Label>
        <Listbox.Button className="flex w-full items-center justify-between rounded-md border-2 border-white/20 bg-[#E8E8E8] p-2 capitalize dark:bg-[#4A5168]">
          <span className="text-black/60 dark:text-white">{selectedValue}</span>
          <Icon
            className="text-gray-500 dark:text-white/20"
            icon={"ph:caret-up-down-bold"}
          />
        </Listbox.Button>
      </div>
      <Listbox.Options
        className={
          "absolute z-10 mt-2 w-full overflow-hidden rounded-md border-2 border-white/50 bg-[#8EABF2] text-white dark:bg-[#4A5168]"
        }
      >
        {options.map((option, key) => (
          <Listbox.Option
            className={clsx(
              "z-10 cursor-pointer p-2 capitalize hover:bg-black/30",
              option === selectedValue && "bg-black/50"
            )}
            value={option}
            key={key}
          >
            {option}
          </Listbox.Option>
        ))}
      </Listbox.Options>
    </Listbox>
  );
};

export default Dropdown;
