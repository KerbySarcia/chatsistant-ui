import clsx from "clsx";
import React from "react";

const TextBox = ({ label, onChange, value, name, isDisabled = false }) => {
  return (
    <label
      htmlFor={label}
      className="flex flex-col gap-2 text-black/60 dark:text-white"
    >
      <span className="font-productSansBlack">{label}</span>
      <input
        autoComplete="off"
        name={name}
        disabled={isDisabled}
        onChange={onChange}
        value={value}
        className={clsx(
          "rounded-md border-2 border-white/20 bg-[#E8E8E8] p-2 focus:outline-[#323745] dark:bg-[#4A5168]",
          isDisabled && "opacity-50"
        )}
        id={label}
        type="text"
      />
    </label>
  );
};

export default TextBox;
