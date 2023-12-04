import { ErrorMessage, Field } from "formik";
import React from "react";

const TextAreaFormik = ({ name, placeholder, label }) => {
  return (
    <div className="flex flex-col gap-2">
      <label
        className="text-xs text-black/60 dark:text-white lg:text-base"
        htmlFor={name}
      >
        {label}
      </label>
      <Field
        type="text"
        className="rounded-md border-2 border-white/20 bg-[#E8E8E8] p-2 text-xs text-black duration-200 focus:outline-[#323745] dark:bg-[#4A5168] dark:text-white lg:text-base"
        placeholder={placeholder}
        name={name}
      />
      <ErrorMessage name={name}>
        {message => <div className="text-xs text-red-400">{message}</div>}
      </ErrorMessage>
    </div>
  );
};

export default TextAreaFormik;
