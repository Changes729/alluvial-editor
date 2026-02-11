import type { Ctx } from "@milkdown/kit/ctx";
import { RefObject } from "react";
import type {
  EditorState,
  PluginView,
  Selection,
} from "@milkdown/kit/prose/state";
import type { EditorView } from "@milkdown/kit/prose/view";

import { TooltipProvider, tooltipFactory } from "@milkdown/kit/plugin/tooltip";
import { TextSelection } from "@milkdown/kit/prose/state";

import type { GroupBuilder } from "../../utils";
import type { DefineFeature } from "../shared";
import type { ToolbarItem } from "./config";

import { toolbarWidget } from "../../../kit/toolbar";

interface ToolbarConfig {
  boldIcon: string;
  codeIcon: string;
  italicIcon: string;
  linkIcon: string;
  strikethroughIcon: string;
  latexIcon: string;
  buildToolbar: (builder: GroupBuilder<ToolbarItem>) => void;

  isLatexEnabled: boolean;
}

export type ToolbarFeatureConfig = Partial<ToolbarConfig>;

const toolbarTooltip = tooltipFactory("CREPE_TOOLBAR");

class ToolbarView implements PluginView {
  #tooltipProvider: TooltipProvider;
  #content: HTMLElement;
  #selection: RefObject<Selection>;
  #show: RefObject<boolean> = { current: false };

  constructor(ctx: Ctx, view: EditorView, config?: ToolbarFeatureConfig) {
    const content = document.createElement("div");
    content.className = "milkdown-toolbar";
    this.#selection = { current: view.state.selection };
    content.appendChild(
      toolbarWidget({
        ctx,
        hide: this.hide,
        config,
        selection: this.#selection,
        show: this.#show,
      })
    );
    this.#content = content;

    this.#tooltipProvider = new TooltipProvider({
      content: this.#content,
      debounce: 20,
      offset: 10,
      shouldShow(view: EditorView) {
        const { doc, selection } = view.state;
        const { empty, from, to } = selection;

        const isEmptyTextBlock =
          !doc.textBetween(from, to).length &&
          selection instanceof TextSelection;

        const isNotTextBlock = !(selection instanceof TextSelection);

        const activeElement = (view.dom.getRootNode() as ShadowRoot | Document)
          .activeElement;
        const isTooltipChildren = content.contains(activeElement);

        const notHasFocus = !view.hasFocus() && !isTooltipChildren;

        const isReadonly = !view.editable;

        if (
          notHasFocus ||
          isNotTextBlock ||
          empty ||
          isEmptyTextBlock ||
          isReadonly
        )
          return false;

        return true;
      },
    });
    this.#tooltipProvider.onShow = () => {
      this.#show.current = true;
    };
    this.#tooltipProvider.onHide = () => {
      this.#show.current = false;
    };
    this.update(view);
  }

  update = (view: EditorView, prevState?: EditorState) => {
    this.#tooltipProvider.update(view, prevState);
    this.#selection.current = view.state.selection;
  };

  destroy = () => {
    this.#tooltipProvider.destroy();
    this.#content.remove();
  };

  hide = () => {
    this.#tooltipProvider.hide();
  };
}

export const toolbar: DefineFeature<ToolbarFeatureConfig> = (
  editor,
  config
) => {
  editor
    .config((ctx) => {
      ctx.set(toolbarTooltip.key, {
        view: (view) => new ToolbarView(ctx, view, config),
      });
    })
    .use(toolbarTooltip);
};
