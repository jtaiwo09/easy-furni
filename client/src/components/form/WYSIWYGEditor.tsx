import { ContentState, convertToRaw, EditorState, Modifier } from "draft-js";
import React, { useEffect, useState } from "react";
import { Editor } from "react-draft-wysiwyg";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import draftToHtml from "draftjs-to-html";
import htmlToDraft from "html-to-draftjs";

const WYSIWYGEditor = React.forwardRef(({ onChange, value }: any, ref: any) => {
  const [editorState, setEditorState] = useState(EditorState.createEmpty());
  const [updated, setUpdated] = useState(false);

  useEffect(() => {
    if (!updated) {
      const defaultValue = value ? value : "";
      // convert html to block/draft
      const blocksFromHtml = htmlToDraft(defaultValue);
      const contentState = ContentState.createFromBlockArray(
        blocksFromHtml.contentBlocks,
        blocksFromHtml.entityMap
      );
      // Create editor state
      const newEditorState = EditorState.createWithContent(contentState);
      // Set new editate state
      setEditorState(newEditorState);
    }
  }, [value]);

  const onEditorStateChange = (editorState: any) => {
    setUpdated(true);
    setEditorState(editorState);
    const content = editorState.getCurrentContent();
    const draft = convertToRaw(content);
    const html = draftToHtml(draft);
    return onChange(html);
  };

  return (
    <Editor
      ref={ref}
      spellCheck
      editorState={editorState}
      toolbarClassName="toolbarClassName"
      wrapperClassName="wrapperClassName"
      editorClassName="min-h-[160px] px-4 border border-form-border"
      onEditorStateChange={onEditorStateChange}
    />
  );
});

export default WYSIWYGEditor;
