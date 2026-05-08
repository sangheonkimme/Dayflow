import { Icon } from "@/components/Icon";
import styles from "./ToolCard.module.css";

export function ToolCard({ icon, title, desc, items, onClick }) {
  return (
    <div className={`${styles.toolCard} col-4`} onClick={onClick}>
      <div className={styles.toolArrow}>
        <Icon name="arrow" size={16} />
      </div>
      <div className={styles.toolIcon}>
        <Icon name={icon} size={18} />
      </div>
      <h3>{title}</h3>
      <p>{desc}</p>
      {items && (
        <ul>
          {items.map((it, i) => (
            <li key={i}>{it}</li>
          ))}
        </ul>
      )}
    </div>
  );
}
