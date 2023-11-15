import { Combobox } from "@headlessui/react";
import { Icon } from "@iconify/react";
import clsx from "clsx";
import React, { useState } from "react";

const DropdownSearch = ({
  selectedValue,
  setSelectedValue,
  options = [],
  isDisabled = false,
  label = "",
}) => {
  const filteredOptions =
    selectedValue === ""
      ? options
      : options.filter(item =>
          item.toLowerCase().includes(selectedValue.toLowerCase())
        ) || [];
  return (
    <Combobox
      value={selectedValue}
      onChange={setSelectedValue}
      as={"div"}
      className={"flex flex-col gap-2"}
    >
      <Combobox.Label
        className={
          "font-productSansBlack flex flex-col gap-2 text-black/60 dark:text-white"
        }
      >
        {label}
      </Combobox.Label>
      <div className="relative flex items-center justify-end">
        <Combobox.Input
          className={clsx(
            "w-full rounded-md border-2 border-white/20 bg-[#E8E8E8] p-2 pr-8 capitalize focus:outline-[#323745] dark:bg-[#4A5168] dark:text-white",
            isDisabled && "opacity-50"
          )}
          onChange={event => setSelectedValue(event.target.value)}
        />
        <Combobox.Button className={"absolute pr-3"}>
          <Icon
            className=" text-gray-500 dark:text-white/20"
            icon={"ph:caret-up-down-bold"}
          />
        </Combobox.Button>
      </div>
      {filteredOptions?.length === 0 && selectedValue !== "" ? null : (
        <div className="relative w-full">
          <Combobox.Options
            className={
              "absolute z-10 flex max-h-48 min-h-fit w-full flex-col gap-2 overflow-y-auto rounded-md border-2 bg-[#8EABF2] text-white dark:border-white/50 dark:bg-[#4A5168]"
            }
          >
            {filteredOptions?.map((item, key) => (
              <Combobox.Option
                className={
                  " cursor-pointer p-3  capitalize text-white hover:bg-black/30 hover:opacity-50"
                }
                key={key}
                value={item}
              >
                {item}
              </Combobox.Option>
            ))}
          </Combobox.Options>
        </div>
      )}
    </Combobox>
  );
};

export default DropdownSearch;
