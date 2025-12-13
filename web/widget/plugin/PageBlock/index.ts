import {
  pageBlockPlugin,
  pageBlockService,
  pageBlockServiceInstance,
  pageBlockSpec,
} from "./pb-plugin";
import { PluginSpec } from "prosemirror-state";
import { $Ctx, $Prose } from "@milkdown/utils";
import { pageBlockConfig, FilterNodes } from "./pb-config";
import { PageBlockService } from "./pb-service";
import { SliceType } from "@milkdown/ctx";

export * from "./pb-provider";

export type PageBlockPlugin = [
  $Ctx<PluginSpec<any>, "pageBlockSpec">,
  $Ctx<{ filterNodes: FilterNodes }, "pageBlockConfig">,
  $Ctx<() => PageBlockService, "pageBlockService">,
  $Ctx<PageBlockService, "pageBlockServiceInstance">,
  $Prose
] & {
  key: SliceType<PluginSpec<any>, "pageBlockSpec">;
  pluginKey: $Prose["key"];
};

export const pageBlock = [
  pageBlockSpec,
  pageBlockConfig,
  pageBlockService,
  pageBlockServiceInstance,
  pageBlockPlugin,
] as PageBlockPlugin;

pageBlock.key = pageBlockSpec.key;
pageBlock.pluginKey = pageBlockPlugin.key;
