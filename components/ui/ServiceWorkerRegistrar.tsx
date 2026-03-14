"use client";

import { useEffect, useRef } from "react";

const ServiceWorkerRegistrar = () => {
  const registered = useRef(false);

  useEffect(() => {
    if (registered.current) return;
    registered.current = true;

    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.register("/sw.js").catch(() => {
        // Service worker registration failed — offline support unavailable
      });
    }
  }, []);

  return null;
};

export default ServiceWorkerRegistrar;
