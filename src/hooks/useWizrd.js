import React, { useState } from "react";

const useWizrd = max => {
  const [index, setIndex] = useState(0);

  const next = () => {
    if (index < max) {
      setIndex(prev => prev + 1);
    } else setIndex(0);
  };

  const prev = () => {
    if (index !== 0) {
      setIndex(prev => prev - 1);
    } else setIndex(max);
  };

  return {
    index,
    prev,
    next,
  };
};

export default useWizrd;
