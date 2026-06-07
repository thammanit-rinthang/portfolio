"use client";

import { useEffect, useState } from "react";
import { useLocale } from "../_lib/locale-context";

type ProjectImage = {
  url: string;
  alt: string;
  isCover?: boolean;
};

type ProjectGalleryProps = {
  images: ProjectImage[];
  title: string;
};

const AUTOPLAY_MS = 4500;

export function ProjectGallery({ images, title }: ProjectGalleryProps) {
  const { locale } = useLocale();
  const [activeIndex, setActiveIndex] = useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);

  const copy = {
    heading: locale === "th" ? "ภาพหน้าจอโปรเจกต์" : "Project gallery",
    open: locale === "th" ? "ขยายรูปภาพ" : "Open image",
    previous: locale === "th" ? "รูปก่อนหน้า" : "Previous image",
    next: locale === "th" ? "รูปถัดไป" : "Next image",
    close: locale === "th" ? "ปิดแกลเลอรี" : "Close gallery",
    counter: locale === "th" ? "ภาพที่" : "Image",
  };

  const goToIndex = (nextIndex: number) => {
    const normalized = (nextIndex + images.length) % images.length;
    setActiveIndex(normalized);
  };

  const showNext = () => {
    setActiveIndex((current) => (current + 1) % images.length);
  };

  const showPrevious = () => {
    goToIndex(activeIndex - 1);
  };

  const showSpecific = (index: number) => {
    goToIndex(index);
  };

  useEffect(() => {
    if (images.length < 2 || isLightboxOpen) {
      return;
    }

    const intervalId = window.setInterval(() => {
      setActiveIndex((current) => (current + 1) % images.length);
    }, AUTOPLAY_MS);

    return () => window.clearInterval(intervalId);
  }, [images.length, isLightboxOpen]);

  useEffect(() => {
    if (!isLightboxOpen) {
      return;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsLightboxOpen(false);
        return;
      }

      if (images.length < 2) {
        return;
      }

      if (event.key === "ArrowRight") {
        setActiveIndex((current) => (current + 1) % images.length);
      }

      if (event.key === "ArrowLeft") {
        setActiveIndex((current) => (current - 1 + images.length) % images.length);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = originalOverflow;
    };
  }, [images.length, isLightboxOpen]);

  const activeImage = images[activeIndex];

  return (
    <section className="mt-12">
      <div className="mb-5 flex items-center justify-between gap-4">
        <h2 className="text-2xl font-semibold text-[color:var(--ink)]">{copy.heading}</h2>
        {images.length > 1 ? (
          <p className="text-sm text-[color:var(--muted)]">
            {copy.counter} {activeIndex + 1} / {images.length}
          </p>
        ) : null}
      </div>

      <div className="overflow-hidden border border-[color:var(--line)] bg-[color:var(--surface)]">
        <button
          type="button"
          className="group relative block aspect-[16/10] w-full overflow-hidden bg-[color:var(--surface-muted)]"
          onClick={() => setIsLightboxOpen(true)}
          aria-label={`${copy.open}: ${activeImage.alt}`}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={activeImage.url}
            alt={activeImage.alt}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.02]"
          />
          <span className="absolute left-4 top-4 border border-white/30 bg-black/55 px-3 py-1 text-xs font-medium text-white backdrop-blur-sm">
            {title}
          </span>
        </button>

        {images.length > 1 ? (
          <div className="flex items-center justify-between border-t border-[color:var(--line)] px-4 py-3">
            <div className="flex gap-2">
              {images.map((image, index) => (
                <button
                  key={`${image.url}-${index}`}
                  type="button"
                  onClick={() => showSpecific(index)}
                  className={`h-2.5 w-2.5 rounded-full transition-colors ${
                    index === activeIndex ? "bg-[color:var(--ink)]" : "bg-[color:var(--line)]"
                  }`}
                  aria-label={`${copy.counter} ${index + 1}`}
                />
              ))}
            </div>
            <div className="flex gap-2">
              <button type="button" className="btn-secondary min-h-0 px-3 py-2 text-sm" onClick={showPrevious}>
                {copy.previous}
              </button>
              <button type="button" className="btn-secondary min-h-0 px-3 py-2 text-sm" onClick={() => showNext()}>
                {copy.next}
              </button>
            </div>
          </div>
        ) : null}

        {images.length > 1 ? (
          <div className="grid gap-3 border-t border-[color:var(--line)] px-4 py-4 sm:grid-cols-3">
            {images.map((image, index) => (
              <button
                key={`${image.url}-thumb-${index}`}
                type="button"
                onClick={() => showSpecific(index)}
                className={`group relative overflow-hidden border ${
                  index === activeIndex ? "border-[color:var(--ink)]" : "border-[color:var(--line)]"
                }`}
                aria-label={`${copy.open}: ${image.alt}`}
              >
                <span className="block aspect-[16/10] overflow-hidden bg-[color:var(--surface-muted)]">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={image.url}
                    alt={image.alt}
                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                </span>
              </button>
            ))}
          </div>
        ) : null}
      </div>

      {isLightboxOpen ? (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/82 px-4 py-6 backdrop-blur-sm"
          onClick={() => setIsLightboxOpen(false)}
          role="dialog"
          aria-modal="true"
          aria-label={copy.heading}
        >
          <div
            className="relative w-full max-w-6xl"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="mb-4 flex items-center justify-between gap-4 text-white">
              <p className="text-sm text-white/80">
                {copy.counter} {activeIndex + 1} / {images.length}
              </p>
              <button
                type="button"
                className="border border-white/25 px-3 py-2 text-sm font-medium text-white transition-colors hover:bg-white/10"
                onClick={() => setIsLightboxOpen(false)}
              >
                {copy.close}
              </button>
            </div>

            <div className="relative overflow-hidden border border-white/15 bg-black">
              <div className="aspect-[16/10] w-full">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={activeImage.url}
                  alt={activeImage.alt}
                  className="h-full w-full object-contain"
                />
              </div>

              {images.length > 1 ? (
                <>
                  <button
                    type="button"
                    className="absolute left-4 top-1/2 -translate-y-1/2 border border-white/20 bg-black/55 px-4 py-3 text-sm font-medium text-white backdrop-blur-sm transition-colors hover:bg-black/70"
                    onClick={showPrevious}
                    aria-label={copy.previous}
                  >
                    {copy.previous}
                  </button>
                  <button
                    type="button"
                    className="absolute right-4 top-1/2 -translate-y-1/2 border border-white/20 bg-black/55 px-4 py-3 text-sm font-medium text-white backdrop-blur-sm transition-colors hover:bg-black/70"
                    onClick={() => showNext()}
                    aria-label={copy.next}
                  >
                    {copy.next}
                  </button>
                </>
              ) : null}
            </div>
          </div>
        </div>
      ) : null}
    </section>
  );
}
