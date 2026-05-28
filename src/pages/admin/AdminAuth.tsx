import { useEffect, useRef, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SEO } from "@/components/SEO";
import { toast } from "sonner";

const MAX_ATTEMPTS = 5;
const LOCKOUT_MS = 5 * 60 * 1000; // 5 minutes

const AdminAuth = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [submitting, setSubmitting] = useState(false);
  const [attempts, setAttempts] = useState(0);
  const [lockedUntil, setLockedUntil] = useState<number | null>(null);
  const [countdown, setCountdown] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (lockedUntil == null) return;
    const tick = () => {
      const remaining = Math.ceil((lockedUntil - Date.now()) / 1000);
      if (remaining <= 0) {
        setLockedUntil(null);
        setAttempts(0);
        setCountdown(0);
        if (timerRef.current) clearInterval(timerRef.current);
      } else {
        setCountdown(remaining);
      }
    };
    tick();
    timerRef.current = setInterval(tick, 1000);
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [lockedUntil]);

  if (loading) return <div className="container-prose py-20">Chargement…</div>;
  if (user) return <Navigate to="/admin" replace />;

  const isLocked = lockedUntil != null && Date.now() < lockedUntil;

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (isLocked) return;

    const fd = new FormData(e.currentTarget);
    const email = String(fd.get("email"));
    const password = String(fd.get("password"));
    setSubmitting(true);

    if (mode === "login") {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      setSubmitting(false);
      if (error) {
        const next = attempts + 1;
        setAttempts(next);
        if (next >= MAX_ATTEMPTS) {
          setLockedUntil(Date.now() + LOCKOUT_MS);
          toast.error(`Trop de tentatives. Compte bloqué 5 minutes.`);
        } else {
          toast.error(`Identifiants incorrects. (${next}/${MAX_ATTEMPTS})`);
        }
        return;
      }
      setAttempts(0);
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
      <SEO title="Connexion admin | ST Services" description="Espace administrateur" />
      <div className="container-prose py-20">
        <div className="mx-auto max-w-md rounded-xl border border-border bg-card p-8 shadow-card">
          <h1 className="font-serif text-2xl font-semibold">Espace administrateur</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {mode === "login" ? "Connectez-vous pour gérer le catalogue." : "Créez votre compte (rôle attribué par un admin)."}
          </p>

          {isLocked && (
            <div className="mt-4 rounded-lg border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive">
              Trop de tentatives échouées. Réessayez dans <strong>{Math.floor(countdown / 60)}:{String(countdown % 60).padStart(2, "0")}</strong>.
            </div>
          )}

          <form onSubmit={onSubmit} className="mt-6 space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="email">Email</Label>
              <Input id="email" name="email" type="email" required autoComplete="username" disabled={isLocked} />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="password">Mot de passe</Label>
              <Input id="password" name="password" type="password" required minLength={6} autoComplete="current-password" disabled={isLocked} />
            </div>
            <Button type="submit" variant="hero" size="lg" disabled={submitting || isLocked} className="w-full">
              {submitting ? "…" : mode === "login" ? "Se connecter" : "Créer mon compte"}
            </Button>
          </form>

          <button
            onClick={() => setMode(mode === "login" ? "signup" : "login")}
            className="mt-4 w-full text-center text-xs text-muted-foreground hover:text-accent"
          >
            {mode === "login" ? "Pas encore de compte ? Créer un compte" : "Déjà un compte ? Se connecter"}
          </button>
        </div>
      </div>
    </>
  );
};

export default AdminAuth;
