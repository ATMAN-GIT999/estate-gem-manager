import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabaseClient";
import Seo from "@/components/Seo";

const UpdatePassword = () => {
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [busy, setBusy] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    // When redirected from email, a recovery session is present
    (async () => {
      const { data } = await supabase.auth.getSession();
      if (!data.session) {
        toast({
          variant: "destructive",
          title: "Invalid or expired link",
          description: "Request a new reset link from the sign-in page.",
        });
      }
    })();
  }, [toast]);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password.length < 6) {
      toast({ variant: "destructive", title: "Password too short", description: "Use at least 6 characters." });
      return;
    }
    if (password !== confirm) {
      toast({ variant: "destructive", title: "Passwords don't match", description: "Please re-enter." });
      return;
    }
    try {
      setBusy(true);
      const { error } = await supabase.auth.updateUser({ password });
      if (error) throw error;
      toast({ title: "Password updated", description: "You are now signed in." });
      navigate("/admin");
    } catch (err: any) {
      toast({ variant: "destructive", title: "Update failed", description: err?.message || "Please try again" });
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Seo title="Update Password" path="/update-password" noindex />
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="font-playfair text-3xl text-center">Set a new password</CardTitle>
          <CardDescription className="text-center">Enter and confirm your new password.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={onSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="new-password">New password</Label>
              <Input id="new-password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} minLength={6} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirm-password">Confirm password</Label>
              <Input id="confirm-password" type="password" value={confirm} onChange={(e) => setConfirm(e.target.value)} minLength={6} required />
            </div>
            <Button type="submit" className="w-full" disabled={busy}>
              {busy ? "Updating..." : "Update Password"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default UpdatePassword;
