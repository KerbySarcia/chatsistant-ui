import React, { useState } from "react";

const useDarkMode = () => {
  const [isDark, setIsDark] = useState(
    localStorage.getItem("color-theme") === "dark"
  );

  // Change the icons inside the button based on previous settings
  if (localStorage.getItem("color-theme")) {
    if (
      localStorage.getItem("color-theme") === "dark" ||
      (!("color-theme" in localStorage) &&
        window.matchMedia("(prefers-color-scheme: dark)").matches)
    ) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  } else {
    localStorage.setItem("color-theme", "light");
  }

  const handleToggle = () => {
    // if set via local storage previously
    if (localStorage.getItem("color-theme")) {
      if (localStorage.getItem("color-theme") === "light") {
        document.documentElement.classList.add("dark");
        setIsDark(true);
        localStorage.setItem("color-theme", "dark");
      } else {
        setIsDark(false);
        document.documentElement.classList.remove("dark");
        localStorage.setItem("color-theme", "light");
      }

      // if NOT set via local storage previously
    } else {
      if (document.documentElement.classList.contains("dark")) {
        document.documentElement.classList.remove("dark");
        localStorage.setItem("color-theme", "light");
        setIsDark(true);
      } else {
        document.documentElement.classList.add("dark");
        localStorage.setItem("color-theme", "dark");
        setIsDark(false);
      }
    }
  };

  return { handleToggle, isDark };
};

export default useDarkMode;
