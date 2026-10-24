import "server-only";
import sanitizeHtml from "sanitize-html";

export function sanitize(html: string) {
  return sanitizeHtml(html, {
    allowedTags: sanitizeHtml.defaults.allowedTags.concat(["img", "h1", "h2", "h3", "figure", "figcaption"]),
    allowedAttributes: {
      ...sanitizeHtml.defaults.allowedAttributes,
      a: ["href", "name", "target", "rel"],
      img: ["src", "alt", "title", "width", "height", "loading"],
      "*": ["id"],
    },
    transformTags: {
      a: sanitizeHtml.simpleTransform("a", { rel: "noopener noreferrer" }),
    },
  });
}

/** Adds stable ids to h2/h3 so the article TOC can link to them. */
export function withHeadingIds(html: string) {
  const headings: { id: string; text: string; level: number }[] = [];
  const seen = new Map<string, number>();
  const out = html.replace(/<h([23])([^>]*)>([\s\S]*?)<\/h\1>/g, (_m, level: string, attrs: string, inner: string) => {
    const text = inner.replace(/<[^>]*>/g, "").trim();
    let id = text.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") || "section";
    const n = seen.get(id) ?? 0;
    seen.set(id, n + 1);
    if (n) id = `${id}-${n}`;
    headings.push({ id, text, level: Number(level) });
    const cleanAttrs = attrs.replace(/\sid="[^"]*"/, "");
    return `<h${level}${cleanAttrs} id="${id}">${inner}</h${level}>`;
  });
  return { html: out, headings };
}
