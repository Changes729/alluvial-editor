import { codeBlockConfig } from "@milkdown/kit/component/code-block";

import type { DefineFeature } from "../crepe/feature/shared";

export interface HTMLBlockConfig {
  codeMirrorEnabled: boolean;
}

export type HTMLBlockFeatureConfig = Partial<HTMLBlockConfig>;

export const htmlBlock: DefineFeature<HTMLBlockFeatureConfig> = (
  editor,
  config,
) => {
  editor.config((ctx) => {
    if (!config || !config.codeMirrorEnabled) {
      throw new Error(
        "You need to enable CodeMirror to use HTML block feature",
      );
    }

    ctx.update(codeBlockConfig.key, (prev) => ({
      ...prev,
      renderPreview: (language, content, applyPreview) => {
        console.log(language, content, language.toLowerCase() === "html")
        if (language.toLowerCase() === "html" && content.length > 0) {
          return content;
        }
        const renderPreview = prev.renderPreview;
        return renderPreview(language, content, applyPreview);
      },
    }));
  });
};
