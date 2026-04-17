import { useEffect } from "react";

interface SEOProps {
  title: string;
  description: string;
  canonical?: string;
  jsonLd?: Record<string, unknown>;
  image?: string;
}

export function SEO({ title, description, canonical, jsonLd, image }: SEOProps) {
  useEffect(() => {
    document.title = title.length > 60 ? title.slice(0, 57) + "..." : title;

    const setMeta = (name: string, content: string, attr: "name" | "property" = "name") => {
      let el = document.head.querySelector<HTMLMetaElement>(`meta[${attr}="${name}"]`);
      if (!el) {
        el = document.createElement("meta");
        el.setAttribute(attr, name);
        document.head.appendChild(el);
      }
      el.setAttribute("content", content);
    };

    setMeta("description", description.slice(0, 160));
    setMeta("og:title", title, "property");
    setMeta("og:description", description.slice(0, 160), "property");
    setMeta("og:type", "website", "property");
    if (image) setMeta("og:image", image, "property");

    const href = canonical ?? window.location.origin + window.location.pathname;
    let link = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    if (!link) {
      link = document.createElement("link");
      link.setAttribute("rel", "canonical");
      document.head.appendChild(link);
    }
    link.setAttribute("href", href);

    let script = document.head.querySelector<HTMLScriptElement>('script[data-seo-jsonld="true"]');
    if (jsonLd) {
      if (!script) {
        script = document.createElement("script");
        script.type = "application/ld+json";
        script.setAttribute("data-seo-jsonld", "true");
        document.head.appendChild(script);
      }
      script.textContent = JSON.stringify(jsonLd);
    } else if (script) {
      script.remove();
    }
  }, [title, description, canonical, jsonLd, image]);

  return null;
}
