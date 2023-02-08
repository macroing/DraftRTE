import { AtomicBlockUtils, CompositeDecorator, Editor, EditorState, RichUtils, convertFromRaw, convertToRaw, getDefaultKeyBinding } from "draft-js";
import { React, useEffect, useRef, useState } from "react";
import "draft-js/dist/Draft.css";

import RichTextEditorUtils from "./RichTextEditorUtils";
import Toolbar from "./Toolbar";

export default function RichTextEditor(props) {
  const MEDIA_TYPE_AUDIO = "audio";
  const MEDIA_TYPE_IMAGE = "image";
  const MEDIA_TYPE_VIDEO = "video";

  const contentFactory = props.contentFactory;
  const onEditorStateChange = props.onEditorStateChange;
  const placeholder = props.placeholder;
  const readOnly = props.readOnly;
  const style = props.style;
  const styleButton = props.styleButton;
  const styleEditor = props.styleEditor;
  const styleSelect = props.styleSelect;

  const decorator = new CompositeDecorator([
    {
      strategy: findLinkEntities,
      component: Link,
    },
  ]);

  const [editorState, setEditorState] = useState(() => createEditorState());

  const editorRef = useRef();

  const blockRenderMap = RichTextEditorUtils.getBlockRenderMap();
  const styleMap = RichTextEditorUtils.getStyleMap();

  useEffect(() => {
    if (editorState && onEditorStateChange) {
      onEditorStateChange(editorState, () => convertToRaw(editorState.getCurrentContent()));
    }
  }, [editorState]);

  function createEditorState() {
    if (contentFactory !== null && contentFactory !== undefined) {
      const content = contentFactory();

      if (content !== null && content !== undefined) {
        return EditorState.createWithContent(convertFromRaw(content), decorator);
      }
    }

    return EditorState.createEmpty(decorator);
  }

  function focus() {
    editorRef.current.focus();
  }

  function handleKeyCommand(command, editorState) {
    const newEditorState = RichUtils.handleKeyCommand(editorState, command);

    if (newEditorState) {
      setEditorState(newEditorState);

      return true;
    }

    return false;
  }

  function insertAudio(src) {
    insertMedia(MEDIA_TYPE_AUDIO, { src });
  }

  function insertImage(src, width, height) {
    insertMedia(MEDIA_TYPE_IMAGE, { src, width, height });
  }

  function insertLink(url) {
    setEditorState(RichTextEditorUtils.toggleLink(editorState, url));
  }

  function insertMedia(type, data) {
    const contentState = editorState.getCurrentContent();
    const contentStateWithEntity = contentState.createEntity(type, "IMMUTABLE", data);

    const entityKey = contentStateWithEntity.getLastCreatedEntityKey();

    const newEditorState = EditorState.set(editorState, { currentContent: contentStateWithEntity });

    setEditorState(AtomicBlockUtils.insertAtomicBlock(newEditorState, entityKey, " "));
  }

  function insertVideo(src) {
    insertMedia(MEDIA_TYPE_VIDEO, { src });
  }

  function mapKeyToEditorCommand(e) {
    if (e.keyCode === 9) {
      const newEditorState = RichUtils.onTab(e, editorState, 4);

      if (newEditorState !== editorState) {
        setEditorState(newEditorState);
      }

      return;
    }

    return getDefaultKeyBinding(e);
  }

  function redo() {
    setEditorState(EditorState.redo(editorState));
  }

  function toggleBackgroundColor(backgroundColor) {
    setEditorState(RichTextEditorUtils.toggleBackgroundColor(editorState, backgroundColor));
  }

  function toggleBlockType(blockType) {
    setEditorState(RichUtils.toggleBlockType(editorState, blockType));
  }

  function toggleColor(color) {
    setEditorState(RichTextEditorUtils.toggleColor(editorState, color));
  }

  function toggleFontFamily(fontFamily) {
    setEditorState(RichTextEditorUtils.toggleFontFamily(editorState, fontFamily));
  }

  function toggleFontSize(fontSize) {
    setEditorState(RichTextEditorUtils.toggleFontSize(editorState, fontSize));
  }

  function toggleInlineStyle(inlineStyle) {
    setEditorState(RichUtils.toggleInlineStyle(editorState, inlineStyle));
  }

  function togglePanel() {
    setEditorState(RichTextEditorUtils.togglePanel(editorState));
  }

  function toggleTextAlign(textAlign) {
    setEditorState(RichTextEditorUtils.toggleTextAlign(editorState, textAlign));
  }

  function undo() {
    setEditorState(EditorState.undo(editorState));
  }

  const className = "editor" + (RichTextEditorUtils.isHidingPlaceholder(editorState) ? " hide_placeholder" : "");

  if (readOnly) {
    return (
      <div className={"rich-text-editor rich-text-editor_read-only"} style={style}>
        <div className={className} style={styleEditor}>
          <Editor blockRenderMap={blockRenderMap} blockRendererFn={mediaBlockRenderer} blockStyleFn={RichTextEditorUtils.getBlockStyle} customStyleMap={styleMap} editorState={editorState} readOnly={true} spellCheck={false} />
        </div>
      </div>
    );
  }

  return (
    <div className={"rich-text-editor rich-text-editor_outline"} style={style}>
      <Toolbar editorState={editorState} onInsertAudio={insertAudio} onInsertImage={insertImage} onInsertLink={insertLink} onInsertVideo={insertVideo} onRedo={redo} onToggleBackgroundColor={toggleBackgroundColor} onToggleBlockType={toggleBlockType} onToggleColor={toggleColor} onToggleFontFamily={toggleFontFamily} onToggleFontSize={toggleFontSize} onToggleInlineStyle={toggleInlineStyle} onTogglePanel={togglePanel} onToggleTextAlign={toggleTextAlign} onUndo={undo} styleButton={styleButton} styleSelect={styleSelect} />
      <div className={className} onClick={focus} style={styleEditor}>
        <Editor blockRenderMap={blockRenderMap} blockRendererFn={mediaBlockRenderer} blockStyleFn={RichTextEditorUtils.getBlockStyle} customStyleMap={styleMap} editorState={editorState} handleKeyCommand={handleKeyCommand} keyBindingFn={mapKeyToEditorCommand} onChange={setEditorState} placeholder={placeholder} ref={editorRef} spellCheck={false} />
      </div>
    </div>
  );
}

function findLinkEntities(contentBlock, callback, contentState) {
  contentBlock.findEntityRanges((character) => {
    const entityKey = character.getEntity();

    return entityKey !== null && contentState.getEntity(entityKey).getType() === "LINK";
  }, callback);
}

function mediaBlockRenderer(block) {
  if (block.getType() === "atomic") {
    return {
      component: Media,
      editable: true,
    };
  }

  return null;
}

function Audio(props) {
  return <audio controls src={props.src} />;
}

function Image(props) {
  return <img src={props.src} width={props.width} height={props.height} />;
}

function Link(props) {
  const contentState = props.contentState;

  const url = contentState.getEntity(props.entityKey).getData().url;

  return (
    <a href={url} style={{ color: "blue", cursor: "pointer", textDecoration: "underline" }}>
      {props.children}
    </a>
  );
}

function Video(props) {
  return <video controls src={props.src} />;
}

function Media(props) {
  const MEDIA_TYPE_AUDIO = "audio";
  const MEDIA_TYPE_IMAGE = "image";
  const MEDIA_TYPE_VIDEO = "video";

  const contentState = props.contentState;

  const entityA = props.block.getEntityAt(0);

  if (entityA === null || entityA === undefined) {
    return null;
  }

  const entityB = contentState.getEntity(entityA);

  const type = entityB.getType();

  const src = entityB.getData().src;

  const width = entityB.getData().width;
  const height = entityB.getData().height;

  switch (type) {
    case MEDIA_TYPE_AUDIO:
      return <Audio src={src} style={{ whiteSpace: "initial", width: "100%" }} />;
    case MEDIA_TYPE_IMAGE:
      return <Image src={src} style={{ whiteSpace: "initial" }} width={width} height={height} />;
    case MEDIA_TYPE_VIDEO:
      return <Video src={src} style={{ whiteSpace: "initial", width: "100%" }} />;
    default:
      return null;
  }
}
