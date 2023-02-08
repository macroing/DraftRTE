import importedStyles from "./Option.module.css";

export default function Option(props) {
  let { children, selected, styles, ...rest } = props;

  //If no styles property has been assigned, the imported CSS module will be used for styling.
  if (styles === null || styles === undefined) {
    styles = importedStyles;
  }

  return (
    <div className={styles.option + (selected ? " " + styles.selected : "")} {...rest}>
      {children}
    </div>
  );
}
