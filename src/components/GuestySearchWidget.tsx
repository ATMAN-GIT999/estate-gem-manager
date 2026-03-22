import { useEffect, useRef } from "react";

declare global {
  interface Window {
    GuestySearchBarWidget?: {
      create: (config: any) => Promise<void>;
    };
  }
}

const GuestySearchWidget = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const scriptLoaded = useRef(false);

  useEffect(() => {
    if (scriptLoaded.current) return;
    scriptLoaded.current = true;

    const initWidget = () => {
      if (window.GuestySearchBarWidget) {
        window.GuestySearchBarWidget.create({
          siteUrl: "frontierresidences.guestybookings.com",
          color: "#5a6959",
        }).catch((err: Error) =>
          console.error("[Guesty Embedded Widget]:", err.message)
        );
      }
    };

    // Check if script already loaded
    if (window.GuestySearchBarWidget) {
      initWidget();
      return;
    }

    const script = document.createElement("script");
    script.src =
      "https://s3.amazonaws.com/guesty-frontend-production/search-bar-production.js";
    script.async = true;
    script.onload = initWidget;
    document.head.appendChild(script);
  }, []);

  return (
    <div className="w-full">
      <div id="search-widget_IO312PWQ" ref={containerRef} />
    </div>
  );
};

export default GuestySearchWidget;
