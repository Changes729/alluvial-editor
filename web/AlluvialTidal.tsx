import React, { Component, useEffect, useState, useRef, useMemo } from "react";

import { loadContent, saveContent, toFile } from "./utils/content-loader";
import { BasicEditorView, TidalEditor } from "./module.index";
import { useParams } from "react-router";
import { getMarkdown } from "@milkdown/utils";

function fileName(base64file: string) {
  const file = decodeURI(base64file);
  const indexOfSlash = file.indexOf(".");
  return indexOfSlash ? file.substring(0, indexOfSlash) : file;
}

export const AlluvialTidal: React.FC<{}> = ({}) => {
  var contentList = useRef<string[]>([]);
  const params = useParams();
  const [editorState, setEditorState] = useState<TidalEditor[]>([]);

  function saveFile() {
    console.log("save file");
    contentList.current.forEach((f, i) => {
      saveContent(
        "/",
        toFile(f + ".md", editorState[i].action(getMarkdown()), "text/markdown")
      );
    });
  }

  useEffect(() => {
    const url = "/";
    setEditorState([]);

    loadContent(url)
      .then(({ contentType, content }) => {
        if (!contentType || !contentType.includes("text/directory")) {
          console.log(contentType, content);
          console.log("error");
        } else {
          (content as string[]).forEach((tagName) => {
            const isFolder = tagName.endsWith("/");

            if (!isFolder) {
              const editor = TidalEditor.make();
              setEditorState((state) => [...state, editor]);
              contentList.current.push(fileName(tagName));

              loadContent(url + tagName).then(({ contentType, content }) => {
                editor.UpdateEditorContent(content as string);
              });
            }
          });
        }
      })
      .finally(() => {
        const fileName = "TestAlluvial";
        if (!contentList.current.includes(fileName)) {
          const editor = TidalEditor.make();
          contentList.current = [fileName, ...contentList.current];
          setEditorState((state) => [editor, ...state]);
        }
      });
  }, []);

  function onKeyDown(e: React.KeyboardEvent<HTMLDivElement>) {
    if (e.key === "o" && (e.ctrlKey || e.metaKey)) {
      e.preventDefault();
    } else if (e.key === "s" && (e.ctrlKey || e.metaKey)) {
      e.preventDefault();
      saveFile();
    }
  }

  return (
    <div className="abstract-content-part" onKeyDown={onKeyDown}>
      {editorState.map((editor, i) => (
        <>
          <h1 className="milkdown">{contentList.current[i]}</h1>
          <BasicEditorView editor={editor}></BasicEditorView>
        </>
      ))}
    </div>
  );
};

export default AlluvialTidal;
