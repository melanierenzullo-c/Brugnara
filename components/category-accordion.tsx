"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { Link } from "@/i18n/navigation";
import { gsap } from "gsap";

interface CategoryAccordionItem {
  slug: string;
  label: string;
  image: string;
  linkLabel: string;
}

interface CategoryAccordionProps {
  items: CategoryAccordionItem[];
}

export function CategoryAccordion({ items }: CategoryAccordionProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <div className="flex flex-col divide-y divide-white/10">
      {items.map((item, index) => (
        <AccordionRow
          key={item.slug}
          item={item}
          isOpen={openIndex === index}
          onToggle={() => setOpenIndex(openIndex === index ? null : index)}
        />
      ))}
    </div>
  );
}

interface AccordionRowProps {
  item: CategoryAccordionItem;
  isOpen: boolean;
  onToggle: () => void;
}

function AccordionRow({ item, isOpen, onToggle }: AccordionRowProps) {
  const contentRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!contentRef.current) return;

    if (isOpen) {
      gsap.to(contentRef.current, {
        height: "auto",
        opacity: 1,
        duration: 0.4,
        ease: "power2.out",
      });
      if (imageRef.current) {
        gsap.fromTo(
          imageRef.current,
          { x: 40, opacity: 0 },
          { x: 0, opacity: 1, duration: 0.5, ease: "power2.out", delay: 0.1 }
        );
      }
    } else {
      gsap.to(contentRef.current, {
        height: 0,
        opacity: 0,
        duration: 0.3,
        ease: "power2.in",
      });
    }
  }, [isOpen]);

  return (
    <div className="group">
      {/* Header row */}
      <button
        onClick={onToggle}
        className="flex w-full cursor-pointer items-center justify-between border-none bg-transparent px-6 py-5 text-left transition-colors hover:bg-white/5"
      >
        <span className="text-xl font-semibold text-white sm:text-2xl">
          {item.label}
        </span>
        <span
          className={`text-2xl text-white/60 transition-transform duration-300 ${
            isOpen ? "rotate-45" : ""
          }`}
        >
          +
        </span>
      </button>

      {/* Expandable content */}
      <div
        ref={contentRef}
        className="h-0 overflow-hidden opacity-0"
      >
        <div className="flex flex-col gap-6 px-6 pb-6 sm:flex-row sm:items-center">
          {/* Image */}
          <div ref={imageRef} className="w-full overflow-hidden rounded-xl sm:w-1/2">
            <Image
              src={item.image}
              alt={item.label}
              width={500}
              height={350}
              className="h-auto w-full rounded-xl object-cover"
            />
          </div>

          {/* Link */}
          <div className="flex flex-col gap-4 sm:w-1/2">
            <Link
              href={{ pathname: "/produkte/[slug]", params: { slug: item.slug } }}
              className="inline-flex items-center gap-2 rounded-lg bg-white px-6 py-3 text-[15px] font-semibold text-[#3A537E] no-underline transition-all hover:bg-[#A5BDD8] hover:text-white"
            >
              {item.linkLabel}
              <span className="text-lg">→</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
