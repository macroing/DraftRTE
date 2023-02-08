import importedStyles from "./Button.module.css";

export default function Button(props) {
  let { active, children, isGroupFirst, isGroupLast, styles, ...rest } = props;

  //If no styles property has been assigned, the imported CSS module will be used for styling.
  if (styles === null || styles === undefined) {
    styles = importedStyles;
  }

  return (
    <button className={styles.button + (active ? " " + styles.active : "") + (isGroupFirst ? " " + styles.button_border_left : "") + (isGroupLast ? " " + styles.button_border_right : "")} {...rest}>
      {children}
    </button>
  );
}
