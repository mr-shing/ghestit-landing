// Per-route SEO for the SPA. index.html ships homepage meta; sub-routes call
// this in an effect to correct <title>, description and canonical so each page
// gives its own signals instead of inheriting the homepage's.
const SITE = 'https://ghestit.com';

function upsertMeta(name: string, content: string): void {
  let el = document.head.querySelector<HTMLMetaElement>(`meta[name="${name}"]`);
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute('name', name);
    document.head.appendChild(el);
  }
  el.setAttribute('content', content);
}

function upsertCanonical(href: string): void {
  let el = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
  if (!el) {
    el = document.createElement('link');
    el.setAttribute('rel', 'canonical');
    document.head.appendChild(el);
  }
  el.setAttribute('href', href);
}

export type PageSeo = {
  title: string;
  description?: string;
  /** Path beginning with "/", or omit to leave canonical untouched. */
  path?: string;
  /** true => tell crawlers not to index this route (auth/app pages). */
  noindex?: boolean;
};

export function setPageSeo({ title, description, path, noindex }: PageSeo): void {
  document.title = title;
  if (description) upsertMeta('description', description);
  if (path) upsertCanonical(SITE + path);
  upsertMeta('robots', noindex ? 'noindex, nofollow' : 'index, follow');
}
