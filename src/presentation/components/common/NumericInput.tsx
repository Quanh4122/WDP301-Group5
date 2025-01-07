import { Input, Tooltip } from "antd";
import React from "react";

interface props {
  style: React.CSSProperties;
  value: string;
  onChange: (value: string) => void;
}

const NumericInputComponent = ({ style, value, onChange }: props) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value: inputValue } = e.target;
    const reg = /^-?\d*(\.\d*)?$/;
    if (reg.test(inputValue) || inputValue === "" || inputValue === "-") {
      onChange(inputValue);
    }
  };

  // '.' at the end or only '-' in the input box.
  const handleBlur = () => {
    if (!value || value.length === 0) return;
    let valueTemp = value;
    if (value.charAt(value.length - 1) === "." || value === "-") {
      valueTemp = value.slice(0, -1);
    }
    onChange(valueTemp.replace(/(\d+)/, "$1"));
  };

  return (
    <Input
      {...{ style, value, onChange }}
      onChange={handleChange}
      onBlur={handleBlur}
      maxLength={16}
    />
  );
};

export default NumericInputComponent;
