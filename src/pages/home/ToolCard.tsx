// @ts-nocheck
import { Icon } from '@/components/Icon';

export function ToolCard({ icon, title, desc, items, onClick }) {
  return (
    <div className="tool-card col-4" onClick={onClick}>
      <div className="tool-arrow"><Icon name="arrow" size={16} /></div>
      <div className="tool-icon"><Icon name={icon} size={18} /></div>
      <h3>{title}</h3>
      <p>{desc}</p>
      {items && (
        <ul>
          {items.map((it, i) => <li key={i}>{it}</li>)}
        </ul>
      )}
    </div>
  );
}
