import { RefObject } from "react";
import type { Selection } from "@milkdown/kit/prose/state";
import { Ctx } from "@milkdown/ctx";
import { ToolbarFeatureConfig } from "../crepe/feature/toolbar";
import { getGroups, type ToolbarItem } from "../crepe/feature/toolbar/config";
import { IconWidget } from "./icon";
import clsx from "clsx";
import { editorCtx, EditorStatus } from "@milkdown/core";

type ToolbarProps = {
  ctx: Ctx;
  hide: () => void;
  show: RefObject<boolean>;
  selection: RefObject<Selection>;
  config?: ToolbarFeatureConfig;
};

export function toolbarWidget(props: ToolbarProps) {
  const { ctx, config } = props;

  const onClick = (fn: (ctx: Ctx) => void) => (e: MouseEvent) => {
    e.preventDefault();
    ctx && fn(ctx);
  };

  function checkActive(checker: ToolbarItem["active"]) {
    // make sure the function subscribed to vue reactive
    props.selection.current;
    // Check if the edtior is ready
    const status = ctx.get(editorCtx).status;
    if (status !== EditorStatus.Created) return false;

    return checker(ctx);
  }

  const groupInfo = getGroups(config, ctx);

  let fragment = document.createDocumentFragment();

  groupInfo
    .values()
    .map((group) => {
      return group.items.map((item) => {
        let button = document.createElement("button");
        button.type = "button";
        button.classList = clsx(
          "toolbar-item",
          ctx && checkActive(item.active) && "active"
        );
        button.onpointerdown = onClick(item.onRun);
        button.appendChild(IconWidget({ icon: item.icon }));

        return button as HTMLElement;
      });
    })
    .reduce((acc, curr, index) => {
      if (index === 0) {
        acc.push(...curr);
      } else {
        let div = document.createElement("div");
        div.className = "divider";
        acc.push(div, ...curr);
      }
      return acc;
    }, []);

  return fragment;
}
