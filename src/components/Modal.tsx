import { ReactNode } from "react";
import { useEscapeKey } from "@/lib/useEscapeKey";

interface ModalProps {
  open?: boolean;
  onClose?: () => void;
  children?: ReactNode;
  className?: string;
  overlayClassName?: string;
}

/**
 * Generic modal wrapper used by TxnModal, EventModal, ReceiptUploadModal,
 * SubEditModal, SaveTipModal.
 *
 * - Uses existing `.modal-overlay` + `.modal` CSS classes so visuals stay identical.
 * - Esc key and overlay click both invoke `onClose`.
 * - Inner content is freeform — pages can render their own `.modal-head` / `.modal-foot`.
 */
export function Modal({
  open = true,
  onClose,
  children,
  className = "",
  overlayClassName = "",
}: ModalProps) {
  useEscapeKey(() => onClose?.(), !!open);

  if (!open) return null;

  return (
    <div
      className={("modal-overlay " + overlayClassName).trim()}
      onClick={onClose}
    >
      <div
        className={("modal " + className).trim()}
        onClick={(e) => e.stopPropagation()}
      >
        {children}
      </div>
    </div>
  );
}
