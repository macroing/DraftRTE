import Button from "./Button";

export default function PanelButtons(props) {
  const onTogglePanel = props.onTogglePanel;
  const styleButton = props.styleButton;

  return (
    <>
      <Button onClick={(e) => onTogglePanel()} style={styleButton} type="button">
        <span className="far fa-square"></span>
      </Button>
    </>
  );
}
