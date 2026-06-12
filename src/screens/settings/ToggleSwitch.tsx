// 환경설정용 on/off 스위치 (controlled or uncontrolled)
import { useState } from "react";
import styles from "@/screens/settings/SettingsPage.module.css";

export const ToggleSwitch = ({ on, onChange }: any) => {
  const [val, setVal] = useState(on);
  const v = onChange ? on : val;
  const toggle = () => {
    if (onChange) onChange(!on);
    else setVal(!val);
  };
  return (
    <button
      type="button"
      role="switch"
      aria-checked={!!v}
      className={styles.toggle + (v ? " " + styles.on : "")}
      onClick={toggle}
    >
      <span className={styles.toggleThumb} />
    </button>
  );
};
