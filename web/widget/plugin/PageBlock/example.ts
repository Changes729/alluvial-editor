import { Ctx } from "@milkdown/ctx";
import { PageBlockProvider } from "./pb-provider";
import { Editor } from "@milkdown/core";
import { pageBlock } from ".";

const handle = document.createElement("div");
handle.className = "drag-handle";
handle.innerHTML = "+";
handle.style.cssText = `
width:20px;height:20px;position: absolute;display:flex;align-items:center;justify-content:center;
cursor:grab;border-radius:4px;background:#f2f3f5;color:#555;user-select:none;`;

function createBlockPluginView(ctx: Ctx) {
  return () => {
    const provider = new PageBlockProvider({
      ctx,
      content: handle,
      getOffset: () => 8,
    });

    return {
      update: provider.update,
      destroy: provider.destroy,
    };
  };
}

var _editor = Editor.make()
  .config((ctx: Ctx) => {
    ctx.set(pageBlock.key, {
      view: createBlockPluginView(ctx),
    });
  })
  .use(pageBlock);
