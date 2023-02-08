import Button from "./Button";

export default function TextAlignButtons(props) {
  const editorState = props.editorState;
  const onToggleTextAlign = props.onToggleTextAlign;
  const styleButton = props.styleButton;

  const currentInlineStyle = editorState.getCurrentInlineStyle();
  const selection = editorState.getSelection();

  return (
    <>
      {TEXT_ALIGNS.map((type, typeIndex) => (
        <Button active={currentInlineStyle.has(type.style)} disabled={!selection.isCollapsed()} key={type.style} onClick={(e) => onToggleTextAlign(type.style)} style={styleButton} type="button">
          {type.code}
        </Button>
      ))}
    </>
  );
}

const TEXT_ALIGNS = [
  { code: <span className="fa fa-align-left"></span>, style: "left" },
  { code: <span className="fa fa-align-center"></span>, style: "center" },
  { code: <span className="fa fa-align-right"></span>, style: "right" },
  { code: <span className="fa fa-align-justify"></span>, style: "justify" },
];
