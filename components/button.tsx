import classNames from "classnames";
import * as styles from "../styles/button.css";

interface Props {
  disabled?: boolean;
  fullWidth?: boolean;
  minimal?: boolean;
  onClick: () => void;
  text: string;
}

export default function Button(props: Props) {
  const {
    disabled = false,
    fullWidth = false,
    minimal = false,
    onClick,
    text,
  } = props;

  return (
    <button
      disabled={disabled}
      onClick={onClick}
      className={classNames(styles.button, {
        [styles.fullWidth]: fullWidth,
        [styles.minimal]: minimal,
      })}
      type="button"
    >
      {text}
    </button>
  );
}
