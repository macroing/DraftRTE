import Button from "./Button";

export default function RedoAndUndoButtons(props) {
  const editorState = props.editorState;
  const onRedo = props.onRedo;
  const onUndo = props.onUndo;
  const styleButton = props.styleButton;

  const redoStack = editorState.getRedoStack();
  const undoStack = editorState.getUndoStack();

  return (
    <>
      <Button disabled={undoStack.size === 0} onClick={(e) => onUndo()} style={styleButton}>
        <span className="fa fa-undo"></span>
      </Button>
      <Button disabled={redoStack.size === 0} onClick={(e) => onRedo()} style={styleButton}>
        <span className="fa fa-redo"></span>
      </Button>
    </>
  );
}
