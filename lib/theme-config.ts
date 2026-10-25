export type Theme = "light" | "dark";

export const DEFAULT_THEME: Theme = "light";
export const THEME_KEY = "co3:theme";
export const THEME_COLORS: Record<Theme, string> = { light: "#ffffff", dark: "#08111c" };

/** Inline, pre-paint script: applies the saved theme so there is never a flash of the wrong one. */
export const themeScript = `try{var t=localStorage.getItem('${THEME_KEY}');if(t!=='light'&&t!=='dark')t='${DEFAULT_THEME}';document.documentElement.dataset.theme=t}catch(e){document.documentElement.dataset.theme='${DEFAULT_THEME}'}`;
