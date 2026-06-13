"use client";

import { useEffect, useState } from "react";
import { Navbar } from "./Navbar";

export function StickyNavbar() {
  const [isLight, setIsLight] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setIsLight(window.scrollY > window.innerHeight * 0.6);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return <Navbar variant={isLight ? "light" : "dark"} />;
}
