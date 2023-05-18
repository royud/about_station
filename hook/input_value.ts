import { useState } from "react";

export default function useInputValue() {
  const [inputValue, setInputValue] = useState("");

  const changeValue = (value: string) => {
    setInputValue(value);
  };

  return { inputValue, changeValue };
}
