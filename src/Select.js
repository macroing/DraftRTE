import { useEffect, useRef } from "react";

import importedStyles from "./Select.module.css";

export default function Select(props) {
  let { children, selectedOptionText, styles, ...rest } = props;

  //If no styles property has been assigned, the imported CSS module will be used for styling.
  if (styles === null || styles === undefined) {
    styles = importedStyles;
  }

  const optionsRef = useRef();
  const selectedOptionRef = useRef();

  function onClickSelectedOption(e) {
    optionsRef.current.classList.toggle(styles.hide);
    selectedOptionRef.current.classList.toggle(styles.arrow_active);
  }

  useEffect(() => {
    optionsRef.current.classList.toggle(styles.hide, true);
    selectedOptionRef.current.classList.toggle(styles.arrow_active, false);
  }, [selectedOptionText]);

  return (
    <div className={styles.select} {...rest}>
      <div className={styles.selected_option} onClick={onClickSelectedOption} ref={selectedOptionRef}>
        {selectedOptionText}
      </div>
      <div className={styles.options + " " + styles.hide} ref={optionsRef}>
        {children}
      </div>
    </div>
  );
}
