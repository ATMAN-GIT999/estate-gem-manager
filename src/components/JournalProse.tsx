import ReactMarkdown, { type Components } from "react-markdown";
import { Link } from "react-router-dom";

/**
 * An article's Markdown, set in the site's own type scale.
 *
 * Raw HTML in an article is not rendered (react-markdown's default, left on
 * deliberately): the text is written by us, but an article is the one place
 * where "paste something in" is routine, and a pasted `<script>` or iframe
 * should be inert rather than a thing to remember to check.
 *
 * `#` inside an article is shown as an `h2` — the page already has its one
 * `h1`, the article title, and a second one would be as wrong as none.
 */
const components: Components = {
  h1: ({ children }) => <h2 className="t-block text-foreground mt-lg">{children}</h2>,
  h2: ({ children }) => <h2 className="t-block text-foreground mt-lg">{children}</h2>,
  h3: ({ children }) => <h3 className="t-card text-foreground mt-md">{children}</h3>,
  h4: ({ children }) => <h3 className="t-card text-foreground mt-md">{children}</h3>,
  p: ({ children }) => <p className="t-body text-foreground mt-md">{children}</p>,
  ul: ({ children }) => <ul className="t-body text-foreground mt-md list-disc pl-6 space-y-2">{children}</ul>,
  ol: ({ children }) => <ol className="t-body text-foreground mt-md list-decimal pl-6 space-y-2">{children}</ol>,
  blockquote: ({ children }) => (
    <blockquote className="mt-md border-l border-accent-strong pl-md text-muted-foreground">
      {children}
    </blockquote>
  ),
  hr: () => <hr className="mt-lg border-border" />,
  img: ({ src, alt }) => (
    <img src={src} alt={alt ?? ""} loading="lazy" className="mt-md w-full h-auto" />
  ),
  a: ({ href = "", children }) => {
    const className =
      "text-accent-strong underline underline-offset-2 hover:text-foreground transition-colors";
    // A path on this site goes through the router, so following it does not
    // reload the app (and a visitor on a saved page keeps the live one).
    if (href.startsWith("/") && !href.startsWith("//")) {
      return (
        <Link to={href} className={className}>
          {children}
        </Link>
      );
    }
    return (
      <a href={href} className={className} rel="noopener noreferrer">
        {children}
      </a>
    );
  },
};

const JournalProse = ({ children }: { children: string }) => (
  <ReactMarkdown components={components}>{children}</ReactMarkdown>
);

export default JournalProse;
