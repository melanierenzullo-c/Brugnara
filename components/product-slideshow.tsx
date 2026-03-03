"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { Link } from "@/i18n/navigation";

interface ProductSlideshowProps {
  images: string[];
  href: string;
  label: string;
  intervalMs?: number;
}

export function ProductSlideshow({
  images,
  href,
  label,
  intervalMs = 5000,
}: ProductSlideshowProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % images.length);
  }, [images.length]);

  useEffect(() => {
    if (images.length <= 1) return;
    const timer = setInterval(nextSlide, intervalMs);
    return () => clearInterval(timer);
  }, [nextSlide, intervalMs, images.length]);

  // Extract slug from href like "/produkte/eisenwaren"
  const slug = href.split("/").pop() ?? "";

  return (
    <div className="flex flex-1 flex-col items-center">
      <div className="relative w-full overflow-hidden rounded-xl">
        <Link href={{ pathname: "/produkte/[slug]", params: { slug } }}>
          <Image
            src={images[currentIndex]}
            alt={`${label} ${currentIndex + 1}`}
            width={400}
            height={400}
            className="h-full w-full animate-[fadeIn_1.5s_ease-in-out] rounded-xl object-cover"
          />
        </Link>
      </div>
      <h2 className="mt-2 rounded bg-white text-center font-bold text-[#5A759E] underline">
        <Link
          href={{ pathname: "/produkte/[slug]", params: { slug } }}
          className="font-bold text-[#5A759E] underline visited:text-[#5A759E] hover:text-[#3A537E]"
        >
          {label}
        </Link>
      </h2>
    </div>
  );
}
