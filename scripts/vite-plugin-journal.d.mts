// Types for the journal Vite plugin, so vite.config.ts typechecks.
import type { Plugin } from "vite";
declare const plugin: (...args: unknown[]) => Plugin;
export default plugin;
