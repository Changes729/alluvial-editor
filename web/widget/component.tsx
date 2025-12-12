import React, { useEffect, useRef } from "react";
import { Editor, rootCtx } from "@milkdown/core";
import style from "./milkdown.module.scss";

interface TidalProps {
  editor: Editor;
  classStyle?: string;
}

export const BasicEditorView: React.FC<TidalProps> = ({
  editor,
  classStyle,
}) => {
  const _placeholder = useRef<HTMLDivElement>(null);

  /** componentDidMount */
  useEffect(() => {
    editor.config((ctx) => {
      ctx.set(rootCtx, _placeholder.current);
    });
  }, []);

  return (
    <div
      ref={_placeholder}
      className={`${classStyle}  ${style.container} markdown-body`}
    ></div>
  );
};
