import type { Screen } from "./store";

export function pathToScreen(path: string): Screen {
  if (path.startsWith("/menu")) return "menu";
  if (path.startsWith("/checkout")) return "checkout";
  if (path.startsWith("/status")) return "status";
  return "start";
}

export function screenPath(screen: Screen) {
  if (screen === "start") return "/";
  return `/${screen}`;
}
