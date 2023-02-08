import importedStyles from "./GroupSeparator.module.css";

export default function GroupSeparator(props) {
  const styles = props.styles || importedStyles;

  return <div className={styles.group_separator}></div>;
}
