import clsx from "clsx";
import React from "react";

const TextArea = ({ label, onChange, value, name, isDisabled = false }) => {
  return (
    <label
      htmlFor={label}
      className="flex h-full w-full flex-col gap-2 text-black/60 dark:text-white"
    >
      <span className="font-productSansBlack">{label}</span>
      <textarea
        disabled={isDisabled}
        name={name}
        value={value}
        onChange={onChange}
        className={clsx(
          "h-full w-full resize-none rounded-md border-2 border-white/20 bg-[#E8E8E8] p-2 focus:outline-[#323745] dark:bg-[#4A5168]",
          isDisabled && "opacity-50"
        )}
        id={label}
      />
    </label>
  );
};

export default TextArea;
