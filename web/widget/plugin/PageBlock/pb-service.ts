import type { Ctx } from "@milkdown/ctx";
import type { Selection } from "@milkdown/prose/state";
import type { EditorView } from "@milkdown/prose/view";

import { editorViewCtx } from "@milkdown/core";
import { NodeSelection } from "@milkdown/prose/state";
import { ActiveNode, FilterNodes } from "@milkdown/kit/plugin/block";
import { throttle } from "lodash-es";
import { selectRootNodeByDom } from "./utils";
import { pageBlockConfig } from "./pb-config";

/// @internal
export type PageBlockServiceMessageType =
  | {
      type: "hide";
    }
  | {
      type: "show";
      active: ActiveNode;
    };

/// @internal
export type PageBlockServiceMessage = (
  message: PageBlockServiceMessageType
) => void;

/// @internal
/// The block service, provide events and methods for block plugin.
/// Generally you don't need to use this class directly.
export class PageBlockService {
  /// @internal
  #ctx?: Ctx;

  /// @internal
  #createSelection: () => null | Selection = () => {
    if (!this.#active) return null;
    const result = this.#active;
    const view = this.#view;

    if (view && NodeSelection.isSelectable(result.node)) {
      const nodeSelection = NodeSelection.create(
        view.state.doc,
        result.$pos.pos
      );
      view.dispatch(view.state.tr.setSelection(nodeSelection));
      view.focus();
      return nodeSelection;
    }
    return null;
  };

  /// @internal
  #active: null | ActiveNode = null;
  /// @internal
  #activeDOMRect: undefined | DOMRect = undefined;

  /// @internal
  get #filterNodes(): FilterNodes | undefined {
    try {
      return this.#ctx?.get(pageBlockConfig.key).filterNodes;
    } catch {
      return undefined;
    }
  }

  /// @internal
  get #view() {
    return this.#ctx?.get(editorViewCtx);
  }

  /// @internal
  #notify?: PageBlockServiceMessage;

  /// @internal
  #hide = () => {
    this.#notify?.({ type: "hide" });
    this.#active = null;
  };

  /// @internal
  #show = (active: ActiveNode) => {
    this.#active = active;
    this.#notify?.({ type: "show", active });
  };

  /// Bind editor context and notify function to the service.
  bind = (ctx: Ctx, notify: PageBlockServiceMessage) => {
    this.#ctx = ctx;
    this.#notify = notify;
  };

  /// Add mouse event to the dom.
  addEvent = (dom: HTMLElement) => {
    dom.addEventListener("mousedown", this.#handleMouseDown);
  };

  /// Remove mouse event to the dom.
  removeEvent = (dom: HTMLElement) => {
    dom.removeEventListener("mousedown", this.#handleMouseDown);
  };

  /// Unbind the notify function.
  unBind = () => {
    this.#notify = undefined;
  };

  /// @internal
  #handleMouseDown = () => {
    this.#activeDOMRect = this.#active?.el.getBoundingClientRect();
    this.#createSelection();
  };

  /// @internal
  keydownCallback = (view: EditorView) => {
    this.#hide();

    view.dom.dataset.dragging = "false";
    return false;
  };

  /// @internal
  #mousemoveCallback = throttle((view: EditorView, event: MouseEvent) => {
    if (!view.editable) return;

    const rect = view.dom.getBoundingClientRect();
    const x = rect.left + rect.width / 2;
    const dom = view.root.elementFromPoint(x, event.clientY);
    if (!(dom instanceof Element)) {
      this.#hide();
      return;
    }
    const resolvePos = view.state.doc.resolve(view.posAtDOM(dom, 0));
    const filterNodes = this.#filterNodes;
    if (!filterNodes) return;

    const result = selectRootNodeByDom(
      view,
      { x, y: event.clientY },
      filterNodes
    );

    if (!result) {
      this.#hide();
      return;
    }
    this.#show(result);
  }, 10);

  /// @internal
  mousemoveCallback = (view: EditorView, event: MouseEvent) => {
    if (view.composing || !view.editable) return false;

    this.#mousemoveCallback(view, event);

    return false;
  };
}
