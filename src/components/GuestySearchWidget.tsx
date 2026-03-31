import { useEffect, useRef } from "react";

declare global {
  interface Window {
    GuestySearchBarWidget?: {
      create: (config: any) => Promise<void>;
    };
  }
}

const GuestySearchWidget = () => {
  const initialized = useRef(false);

  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;

    const config = {
      siteUrl: "frontierresidences.guestybookings.com",
      color: "#5a6959",
    };

    // Load CSS
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.type = "text/css";
    link.href =
      "https://s3.amazonaws.com/guesty-frontend-production/search-bar-production.css";
    link.media = "all";
    document.getElementsByTagName("head")[0].appendChild(link);

    // Init function
    const initWidget = () => {
      try {
        if (window.GuestySearchBarWidget) {
          window.GuestySearchBarWidget.create(config).catch((err: Error) =>
            console.error("[Guesty Embedded Widget]:", err.message)
          );
        }
      } catch (e: any) {
        console.error("[Guesty Embedded Widget]:", e.message);
      }
    };

    // Check if script already loaded
    if (window.GuestySearchBarWidget) {
      initWidget();
      return;
    }

    // Load JS
    const script = document.createElement("script");
    script.type = "text/javascript";
    script.src =
      "https://s3.amazonaws.com/guesty-frontend-production/search-bar-production.js";
    script.async = true;
    let done = false;
    script.onload = script.onreadystatechange = function () {
      if (!done && (!this.readyState || this.readyState === "complete")) {
        done = true;
        initWidget();
      }
    };
    const firstScript = document.getElementsByTagName("script")[0];
    firstScript?.parentNode?.insertBefore(script, firstScript);
  }, []);

  return (
    <div className="w-full">
      <div id="search-widget_IO312PWQ" />
    </div>
  );
};

export default GuestySearchWidget;
