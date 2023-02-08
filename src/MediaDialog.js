import { useState } from "react";

import importedStyles from "./MediaDialog.module.css";

export default function MediaDialog(props) {
  const MEDIA_TYPE_AUDIO = "audio";
  const MEDIA_TYPE_IMAGE = "image";
  const MEDIA_TYPE_LINK = "link";
  const MEDIA_TYPE_VIDEO = "video";

  let { isShowing, mediaType, onCancel, onOK, setIsShowing, styles, ...rest } = props;

  //If no styles property has been assigned, the imported CSS module will be used for styling.
  if (styles === null || styles === undefined) {
    styles = importedStyles;
  }

  const [mediaHeight, setMediaHeight] = useState("auto");
  const [mediaURL, setMediaURL] = useState("");
  const [mediaWidth, setMediaWidth] = useState("auto");

  function onClickCancel(e) {
    e.preventDefault();

    setIsShowing(false);

    onCancel();

    setMediaHeight("auto");
    setMediaURL("");
    setMediaWidth("auto");
  }

  function onClickOK(e) {
    e.preventDefault();

    setIsShowing(false);

    onOK(mediaType, mediaURL, mediaWidth, mediaHeight);

    setMediaHeight("auto");
    setMediaURL("");
    setMediaWidth("auto");
  }

  function renderContent() {
    switch (mediaType) {
      case MEDIA_TYPE_AUDIO:
        return (
          <>
            <label className={styles.label}>URL</label>
            <input className={styles.input} onChange={(e) => setMediaURL(e.target.value)} type="text" value={mediaURL} />
          </>
        );
      case MEDIA_TYPE_IMAGE:
        return (
          <>
            <label className={styles.label}>URL</label>
            <input className={styles.input} onChange={(e) => setMediaURL(e.target.value)} type="text" value={mediaURL} />
            <label className={styles.label}>Width</label>
            <input className={styles.input} onChange={(e) => setMediaWidth(e.target.value)} type="text" value={mediaWidth} />
            <label className={styles.label}>Height</label>
            <input className={styles.input} onChange={(e) => setMediaHeight(e.target.value)} type="text" value={mediaHeight} />
          </>
        );
      case MEDIA_TYPE_LINK:
        return (
          <>
            <label className={styles.label}>URL</label>
            <input className={styles.input} onChange={(e) => setMediaURL(e.target.value)} type="text" value={mediaURL} />
          </>
        );
      case MEDIA_TYPE_VIDEO:
        return (
          <>
            <label className={styles.label}>URL</label>
            <input className={styles.input} onChange={(e) => setMediaURL(e.target.value)} type="text" value={mediaURL} />
          </>
        );
      default:
        return <></>;
    }
  }

  return (
    <div className={isShowing ? styles.media_dialog_show : styles.media_dialog_hide} {...rest}>
      <div className={styles.container}>
        <div className={styles.header}>Media</div>
        <div className={styles.content}>{renderContent()}</div>
        <div className={styles.buttons}>
          <button className={styles.button} onClick={onClickOK} type="button">
            OK
          </button>
          <button className={styles.button} onClick={onClickCancel} type="button">
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
