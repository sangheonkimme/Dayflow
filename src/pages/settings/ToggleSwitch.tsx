// @ts-nocheck
// 환경설정용 on/off 스위치 (controlled or uncontrolled)
import { useState } from "react";

export const ToggleSwitch = ({ on, onChange }) => {
  const [val, setVal] = useState(on);
  const v = onChange ? on : val;
  const toggle = () => {
    if (onChange) onChange(!on);
    else setVal(!val);
  };
  return (
    <button className={"switch" + (v ? " on" : "")} onClick={toggle}>
      <span className="switch-thumb" />
    </button>
  );
};
