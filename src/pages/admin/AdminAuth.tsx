import { useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SEO } from "@/components/SEO";
import { toast } from "sonner";

const AdminAuth = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [submitting, setSubmitting] = useState(false);

  if (loading) return <div className="container-prose py-20">Chargement…</div>;
  if (user) return <Navigate to="/admin" replace />;

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const email = String(fd.get("email"));
    const password = String(fd.get("password"));
    setSubmitting(true);
    if (mode === "login") {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      setSubmitting(false);
      if (error) return toast.error(error.message);
      navigate("/admin");
    } else {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: { emailRedirectTo: `${window.location.origin}/admin` },
      });
      setSubmitting(false);
      if (error) return toast.error(error.message);
      toast.success("Compte créé. Demandez à un admin de vous attribuer le rôle.");
    }
  };

  return (
    <>
      <SEO title="Connexion admin | Horizon Évasion" description="Espace administrateur" />
      <div className="container-prose py-20">
        <div className="mx-auto max-w-md rounded-xl border border-border bg-card p-8 shadow-card">
          <h1 className="font-serif text-2xl font-semibold">Espace administrateur</h1>
          <p className="mt-1 text-sm text-muted-foreground">{mode === "login" ? "Connectez-vous pour gérer le catalogue." : "Créez votre compte (rôle attribué par un admin)."}</p>

          <form onSubmit={onSubmit} className="mt-6 space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="email">Email</Label>
              <Input id="email" name="email" type="email" required />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="password">Mot de passe</Label>
              <Input id="password" name="password" type="password" required minLength={6} />
            </div>
            <Button type="submit" variant="hero" size="lg" disabled={submitting} className="w-full">
              {submitting ? "…" : mode === "login" ? "Se connecter" : "Créer mon compte"}
            </Button>
          </form>

          <button onClick={() => setMode(mode === "login" ? "signup" : "login")} className="mt-4 w-full text-center text-xs text-muted-foreground hover:text-accent">
            {mode === "login" ? "Pas encore de compte ? Créer un compte" : "Déjà un compte ? Se connecter"}
          </button>
        </div>
      </div>
    </>
  );
};

export default AdminAuth;
