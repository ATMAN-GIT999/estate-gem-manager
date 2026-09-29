import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

/**
 * Gate for every /admin/* route (docs/PROJECT.md C8, the "optional" fourth
 * step of closing the admin hole). Before this, a visitor with no admin role
 * could still open any admin page's shell — RLS then just handed back empty
 * tables, which reads as "it works, there's nothing here" rather than "you
 * are not allowed here". `Builder.tsx` was the one route that already
 * checked `isAdmin`; the other twelve had nothing.
 *
 * Waits for `loading` to resolve before deciding: `isAdmin` defaults to
 * `false` in AuthContext until the async role check returns, so redirecting
 * on that default would bounce a genuine admin on every page refresh —
 * exactly the race `Builder.tsx`'s own inline check had (its effect ignored
 * `loading` entirely). One gate, used everywhere, so that bug exists in one
 * place instead of potentially thirteen.
 */
const RequireAdmin = ({ children }: { children: React.ReactNode }) => {
  const { isAdmin, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !isAdmin) navigate("/auth", { replace: true });
  }, [loading, isAdmin, navigate]);

  if (loading || !isAdmin) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" aria-hidden="true" />
      </div>
    );
  }

  return <>{children}</>;
};

export default RequireAdmin;
