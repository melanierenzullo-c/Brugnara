import Image from "next/image";
import DOMPurify from "isomorphic-dompurify";

/**
 * Einheitliche Darstellung eines News-Beitrags.
 * Wird von der öffentlichen Detailseite und der Admin-Vorschau verwendet,
 * damit „Vorschau öffnen" wirklich zeigt, was der Besucher später sieht.
 *
 * `content` ist HTML aus dem Editor. Die URL-Prüfung dort ist reine
 * Bedienoberfläche – wer direkt gegen die Convex-Mutation schreibt, umgeht sie.
 * Deshalb wird hier, an der einzigen Render-Stelle, hart gefiltert.
 */
const SANITIZE_OPTIONS = {
  ALLOWED_TAGS: [
    "p", "br", "strong", "b", "em", "i", "u", "s",
    "ul", "ol", "li", "h1", "h2", "h3", "blockquote", "hr",
    "code", "pre", "a",
  ],
  // ponytail: keine eigene ALLOWED_URI_REGEXP – DOMPurify blockt javascript:,
  // data: und entity-kodierte Varianten schon von Haus aus, eine eigene Regex
  // würde zusätzlich target/rel wegwerfen (sie prüft alle Attributwerte).
  ADD_ATTR: ["target"],
};
export function NewsArticle({
  imageUrl,
  title,
  content,
  date,
  kicker,
}: {
  imageUrl?: string | null;
  title: string;
  content: string;
  date: string;
  kicker?: string;
}) {
  return (
    <article>
      <div className="mb-5 flex items-center gap-3 text-[11px] font-bold uppercase tracking-[0.2em] text-muted-foreground/60">
        {kicker && (
          <>
            <span>{kicker}</span>
            <span className="h-1 w-1 rounded-full bg-slate-300" />
          </>
        )}
        <span>{date}</span>
      </div>

      <h1 className="mb-10 text-4xl sm:text-5xl font-black text-foreground tracking-tight leading-[1.1]">
        {title}
      </h1>

      {imageUrl && (
        <div className="relative mb-10 aspect-[16/9] w-full overflow-hidden rounded-2xl bg-slate-50">
          <Image
            src={imageUrl}
            alt={title}
            fill
            sizes="(max-width: 1024px) 100vw, 768px"
            className="object-cover"
            priority
          />
        </div>
      )}

      <div
        className="prose-content text-lg sm:text-xl"
        dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(content, SANITIZE_OPTIONS) }}
      />
    </article>
  );
}
