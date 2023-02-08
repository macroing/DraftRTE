import { useEffect, useState } from "react";

import Button from "./Button";
import MediaDialog from "./MediaDialog";

export default function MediaButtons(props) {
  const MEDIA_TYPE_AUDIO = "audio";
  const MEDIA_TYPE_IMAGE = "image";
  const MEDIA_TYPE_LINK = "link";
  const MEDIA_TYPE_VIDEO = "video";

  const onInsertAudio = props.onInsertAudio;
  const onInsertImage = props.onInsertImage;
  const onInsertLink = props.onInsertLink;
  const onInsertVideo = props.onInsertVideo;
  const styleButton = props.styleButton;

  const [isShowingMediaDialog, setIsShowingMediaDialog] = useState(false);
  const [mediaType, setMediaType] = useState("");

  useEffect(() => {
    if (!isShowingMediaDialog) {
      setMediaType("");
    }
  }, [isShowingMediaDialog]);

  useEffect(() => {
    if (mediaType !== "") {
      setIsShowingMediaDialog(true);
    }
  }, [mediaType]);

  function onCancel() {}

  function onOK(mediaType, mediaURL, mediaWidth, mediaHeight) {
    switch (mediaType) {
      case MEDIA_TYPE_AUDIO:
        onInsertAudio(mediaURL);

        break;
      case MEDIA_TYPE_IMAGE:
        onInsertImage(mediaURL, mediaWidth, mediaHeight);

        break;
      case MEDIA_TYPE_LINK:
        onInsertLink(mediaURL);

        break;
      case MEDIA_TYPE_VIDEO:
        onInsertVideo(mediaURL);

        break;
      default:
        break;
    }
  }

  return (
    <>
      <Button onClick={(e) => setMediaType(MEDIA_TYPE_AUDIO)} style={styleButton} type="button">
        <span className="far fa-file-audio"></span>
      </Button>
      <Button onClick={(e) => setMediaType(MEDIA_TYPE_IMAGE)} style={styleButton} type="button">
        <span className="far fa-file-image"></span>
      </Button>
      <Button onClick={(e) => setMediaType(MEDIA_TYPE_VIDEO)} style={styleButton} type="button">
        <span className="far fa-file-video"></span>
      </Button>
      <Button onClick={(e) => setMediaType(MEDIA_TYPE_LINK)} style={styleButton} type="button">
        <span className="fa fa-link"></span>
      </Button>
      <MediaDialog isShowing={isShowingMediaDialog} mediaType={mediaType} onCancel={onCancel} onOK={onOK} setIsShowing={setIsShowingMediaDialog} />
    </>
  );
}
