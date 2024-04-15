import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";

function Modal({ children, open, className = "", onClose }) {
  const dialog = useRef();

  useEffect(() => {
    const modal = dialog.current;

    if (open) {
      modal.showModal();
    }

    return () => modal.close();
  }, [open]);

  return createPortal(
    <dialog
      ref={dialog}
      open={open}
      className={`modal ${className}`}
      onClose={onClose}
    >
      {children}
    </dialog>,
    document.getElementById("modal")
  );
}

export default Modal;
