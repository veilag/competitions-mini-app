import {WebApp} from "@/webapp/types.ts";

declare global {
  interface Window {
    Telegram: {
      WebApp: WebApp
    }
  }
}

export {}