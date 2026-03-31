/**
 * @file components/shared/custom-cursor.tsx
 * @description Custom cursor — dot + ring.
 * Works on ALL pages (placed in root layout).
 * Only activates on desktop (pointer: fine).
 * Reattaches event listeners on route change via pathname.
 */

"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

export default function CustomCursor(): null {
  const pathname = usePathname();

  useEffect(() => {
    /* Skip touch devices */
    if (!window.matchMedia("(pointer: fine)").matches) return;

    const isDesktop = window.matchMedia("(pointer: fine)").matches;
    const isLanding = pathname === "/";

    const dot = document.getElementById("cursor-dot");
    const ring = document.getElementById("cursor-ring");

    if (!isDesktop || !isLanding || !dot || !ring) {
      if (dot) {
        dot.style.opacity = "0";
        dot.style.left = "-9999px";
        dot.style.top = "-9999px";
      }
      if (ring) {
        ring.style.opacity = "0";
        ring.style.left = "-9999px";
        ring.style.top = "-9999px";
      }
      document.body.classList.remove("cursor-hover");
      return;
    }

    let mouseX = -999;
    let mouseY = -999;
    let ringX = -999;
    let ringY = -999;
    let animId = 0;
    let visible = false;

    /* Show cursor elements */
    dot.style.opacity = "1";
    ring.style.opacity = "1";

    // const resetCursor = (): void => {
    //   visible = false;

    //   mouseX = -100;
    //   mouseY = -100;
    //   ringX = -100;
    //   ringY = -100;

    //   dot.style.left = "-100px";
    //   dot.style.top = "-100px";
    //   ring.style.left = "-100px";
    //   ring.style.top = "-100px";

    //   dot.style.opacity = "0";
    //   ring.style.opacity = "0";

    //   document.body.classList.remove("cursor-hover");
    // };

    const onMove = (e: MouseEvent): void => {
      mouseX = e.clientX;
      mouseY = e.clientY;

      /* Dot follows instantly */
      dot.style.left = `${mouseX}px`;
      dot.style.top = `${mouseY}px`;
    };

    const onLeave = () => {
      dot.style.opacity = "0";
      ring.style.opacity = "0";
    };

    const onEnter = () => {
      dot.style.opacity = "1";
      ring.style.opacity = "1";
    };

    /* Ring follows with smooth lerp */
    const animate = (): void => {
      ringX += (mouseX - ringX) * 0.12;
      ringY += (mouseY - ringY) * 0.12;

      ring.style.left = `${ringX}px`;
      ring.style.top = `${ringY}px`;

      animId = requestAnimationFrame(animate);
    };

    /* Expand on interactive elements */
    const expand = (): void => document.body.classList.add("cursor-hover");
    const collapse = (): void => document.body.classList.remove("cursor-hover");

    /* Attach to all current interactive elements */
    const interactiveSelector =
      'a, button, [role="button"], input, textarea, select';

    const els = Array.from(document.querySelectorAll(interactiveSelector));
    els.forEach((el) => {
      el.addEventListener("mouseenter", expand);
      el.addEventListener("mouseleave", collapse);
    });

    window.addEventListener("mousemove", onMove, { passive: true });
    window.addEventListener("mouseleave", onLeave);
    window.addEventListener("mouseenter", onEnter);

    animate();

    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseleave", onLeave);
      window.removeEventListener("mouseenter", onEnter);
      cancelAnimationFrame(animId);

      els.forEach((el) => {
        el.removeEventListener("mouseenter", expand);
        el.removeEventListener("mouseleave", collapse);
      });

      document.body.classList.remove("cursor-hover");

      dot.style.opacity = "0";
      ring.style.opacity = "0";
      dot.style.left = "-9999px";
      dot.style.top = "-9999px";
      ring.style.left = "-9999px";
      ring.style.top = "-9999px";
    };
  }, [pathname]); /* Re-run on every route change */

  return null;
}
