import { Link } from "react-router-dom";
import { Container } from "./layout";

interface BreadcrumbProps {
  /** Every step but the last is a link; the last is the page itself. */
  trail: Array<{ label: string; to: string }>;
}

/**
 * The visible trail. The same shape PropertyDetail.tsx draws inline — one
 * quiet line under the header, `›` between steps — pulled out so the location
 * pages and, later, the property page (docs/seo/01_IMPLEMENTATION.md D1) do
 * not grow three copies of it.
 *
 * Pair it with `breadcrumbSchema` over the same steps. docs/seo/struktur.md §8
 * makes a breadcrumb mandatory on every page except `/`, because it is both
 * the way back and the `BreadcrumbList` a search result shows.
 */
const Breadcrumb = ({ trail }: BreadcrumbProps) => (
  <Container className="py-sm">
    <nav aria-label="Breadcrumb">
      <ol className="flex flex-wrap items-center gap-2 t-body text-muted-foreground">
        {trail.map((step, index) => {
          const isLast = index === trail.length - 1;
          return (
            <li key={step.to} className="flex items-center gap-2">
              {isLast ? (
                <span className="text-foreground" aria-current="page">
                  {step.label}
                </span>
              ) : (
                <>
                  <Link to={step.to} className="hover:text-accent-strong transition-colors">
                    {step.label}
                  </Link>
                  <span aria-hidden="true">›</span>
                </>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  </Container>
);

export default Breadcrumb;
