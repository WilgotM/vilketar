import { AnimatePresence, motion } from "motion/react";
import React from "react";
import Button from "./button";
import * as styles from "../styles/quit-game-modal.css";

interface Props {
  body?: string;
  cancelText?: string;
  confirmText?: string;
  onCancel: () => void;
  onConfirm: () => void;
  open: boolean;
  title?: string;
}

export default function QuitGameModal(props: Props) {
  const {
    body = "Du förlorar framstegen i den här rundan.",
    cancelText = "Stanna kvar",
    confirmText = "Lämna",
    onCancel,
    onConfirm,
    open,
    title = "Lämna matchen?",
  } = props;
  const dialogRef = React.useRef<HTMLDivElement | null>(null);

  React.useEffect(() => {
    if (!open) {
      return;
    }

    const previouslyFocused = document.activeElement as HTMLElement | null;
    const dialog = dialogRef.current;
    const buttons = Array.from(
      dialog?.querySelectorAll<HTMLButtonElement>("button:not(:disabled)") ??
        [],
    );
    buttons[0]?.focus();

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        onCancel();
        return;
      }

      if (event.key !== "Tab" || buttons.length === 0) {
        return;
      }

      const firstButton = buttons[0];
      const lastButton = buttons[buttons.length - 1];
      if (
        (event.shiftKey && document.activeElement === firstButton) ||
        (!event.shiftKey && document.activeElement === lastButton)
      ) {
        event.preventDefault();
        (event.shiftKey ? lastButton : firstButton)?.focus();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      if (previouslyFocused && document.contains(previouslyFocused)) {
        previouslyFocused.focus();
      }
    };
  }, [onCancel, open]);

  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          animate={{ opacity: 1 }}
          aria-labelledby="quit-game-modal-title"
          aria-modal="true"
          className={styles.overlay}
          exit={{ opacity: 0 }}
          initial={{ opacity: 0 }}
          onClick={onCancel}
          ref={dialogRef}
          role="dialog"
          transition={{ duration: 0.18, ease: "easeOut" }}
        >
          <motion.div
            animate={{ opacity: 1, scale: 1, y: 0 }}
            className={styles.modal}
            exit={{ opacity: 0, scale: 0.96, y: 10 }}
            initial={{ opacity: 0, scale: 0.96, y: 10 }}
            onClick={(event) => {
              event.stopPropagation();
            }}
            transition={{ duration: 0.2, ease: "easeOut" }}
          >
            <h2 className={styles.title} id="quit-game-modal-title">
              {title}
            </h2>
            <p className={styles.body}>{body}</p>
            <div className={styles.actions}>
              <Button fullWidth onClick={onConfirm} text={confirmText} />
              <Button fullWidth minimal onClick={onCancel} text={cancelText} />
            </div>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
