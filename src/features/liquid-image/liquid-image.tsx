"use client";

import Image from "next/image";
import { type ComponentPropsWithoutRef, useEffect, useRef } from "react";
import { hasFinePointer } from "@/lib/motion";
import { canRenderScene } from "@/lib/scene";
import { cn } from "@/lib/utils";
import { createLiquidRenderer } from "./liquid-renderer";

type LiquidImageProps = Omit<ComponentPropsWithoutRef<"div">, "children"> & {
  src: string;
  alt: string;
  sizes: string;
  /** Classes of the picture and of the canvas that replaces it while it ripples (filters, mostly). */
  imageClassName?: string;
};

/**
 * A picture that fills its box and ripples like liquid under the pointer. The `<img>` always stays,
 * for assistive technology and as the static fallback; a WebGL canvas, drawn the same way, is laid
 * over it only while hovering. With a touch screen, reduced motion, data saving or no WebGL,
 * nothing else is mounted.
 */
export function LiquidImage({
  src,
  alt,
  sizes,
  imageClassName,
  className,
  ...props
}: LiquidImageProps) {
  const root = useRef<HTMLDivElement>(null);
  const picture = useRef<HTMLImageElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const element = root.current;
    const image = picture.current;
    const surface = canvas.current;
    if (!(element && image && surface && hasFinePointer() && canRenderScene())) return;

    let cleanup = () => {};

    function start() {
      if (!(image && surface && element)) return;
      const renderer = createLiquidRenderer(surface, image);
      if (!renderer) return;

      const show = (on: boolean) => {
        surface.style.opacity = on ? "1" : "0";
        renderer.hover(on);
      };
      const onMove = (event: PointerEvent) => {
        const box = element.getBoundingClientRect();
        renderer.pointTo(
          (event.clientX - box.left) / box.width,
          1 - (event.clientY - box.top) / box.height,
        );
      };
      const enter = () => show(true);
      const leave = () => show(false);
      const observer = new ResizeObserver(renderer.resize);

      element.addEventListener("pointerenter", enter);
      element.addEventListener("pointerleave", leave);
      element.addEventListener("pointermove", onMove);
      observer.observe(element);
      cleanup = () => {
        element.removeEventListener("pointerenter", enter);
        element.removeEventListener("pointerleave", leave);
        element.removeEventListener("pointermove", onMove);
        observer.disconnect();
        renderer.destroy();
      };
    }

    if (image.complete && image.naturalWidth > 0) start();
    else image.addEventListener("load", start, { once: true });

    return () => {
      image.removeEventListener("load", start);
      cleanup();
    };
  }, []);

  return (
    <div ref={root} className={cn("relative size-full", className)} {...props}>
      <Image
        ref={picture}
        src={src}
        alt={alt}
        fill
        sizes={sizes}
        className={cn("object-cover object-top", imageClassName)}
      />
      <div aria-hidden="true" className="absolute inset-0">
        <canvas
          ref={canvas}
          className={cn(
            "absolute inset-0 size-full opacity-0 transition-opacity duration-200",
            imageClassName,
          )}
        />
      </div>
    </div>
  );
}
