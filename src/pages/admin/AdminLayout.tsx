import { useEffect } from "react";
import { Link, NavLink, Outlet, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { LayoutDashboard, Truck, Inbox, Repeat, Users, LogOut, ExternalLink, BookmarkCheck, Settings } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

const NAV = [
  { to: "/admin", label: "Tableau de bord", icon: LayoutDashboard, end: true },
  { to: "/admin/vehicles", label: "Véhicules", icon: Truck },
  { to: "/admin/reservations", label: "Réservations", icon: BookmarkCheck },
  { to: "/admin/leads", label: "Demandes", icon: Inbox },
  { to: "/admin/trade-ins", label: "Reprises", icon: Repeat },
  { to: "/admin/users", label: "Utilisateurs", icon: Users },
  { to: "/admin/settings", label: "Paramètres", icon: Settings },
];

const AdminLayout = () => {
  const { user, isAdmin, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const { data: sub } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "SIGNED_OUT" && !session) {
        toast.error("Session expirée. Veuillez vous reconnecter.");
        navigate("/admin/auth");
      }
    });
    return () => sub.subscription.unsubscribe();
  }, [navigate]);

  if (loading) return <div className="p-10">Chargement…</div>;
  if (!user) { navigate("/admin/auth"); return null; }
  if (!isAdmin) {
    return (
      <div className="container-prose py-20 text-center">
        <h1 className="font-serif text-2xl font-semibold">Accès réservé aux administrateurs</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Votre compte ({user.email}) n'a pas le rôle administrateur.<br />
          Demandez à un admin existant d'ajouter votre user_id dans la table <code>user_roles</code>.
        </p>
        <p className="mt-4 break-all text-xs text-muted-foreground">User ID : {user.id}</p>
        <Button variant="elegant" className="mt-6" onClick={async () => { await supabase.auth.signOut(); navigate("/"); }}>
          Se déconnecter
        </Button>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-secondary/30">
      <aside className="hidden w-64 flex-col border-r border-border bg-card md:flex">
        <div className="border-b border-border p-5">
          <Link to="/admin" className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-md bg-gradient-deep text-primary-foreground font-serif">H</div>
            <div>
              <div className="font-serif text-base font-semibold">Horizon</div>
              <div className="text-[10px] uppercase tracking-wider text-accent">Admin</div>
            </div>
          </Link>
        </div>
        <nav className="flex-1 space-y-1 p-3">
          {NAV.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) => cn(
                "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-smooth",
                isActive ? "bg-accent text-accent-foreground" : "text-muted-foreground hover:bg-secondary hover:text-foreground",
              )}
            >
              <item.icon className="h-4 w-4" />
              {item.label}
            </NavLink>
          ))}
        </nav>
        <div className="border-t border-border p-3 space-y-2">
          <Link to="/" className="flex items-center gap-2 rounded-md px-3 py-2 text-xs text-muted-foreground hover:text-foreground">
            <ExternalLink className="h-3.5 w-3.5" /> Voir le site
          </Link>
          <button
            onClick={async () => { await supabase.auth.signOut(); navigate("/"); }}
            className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-xs text-muted-foreground hover:text-destructive"
          >
            <LogOut className="h-3.5 w-3.5" /> Se déconnecter
          </button>
        </div>
      </aside>

      <main className="flex-1 overflow-x-hidden">
        <header className="sticky top-0 z-30 border-b border-border bg-background/95 backdrop-blur md:hidden">
          <div className="flex items-center justify-between px-4 py-3">
            <div className="font-serif text-lg font-semibold">Admin</div>
            <button onClick={async () => { await supabase.auth.signOut(); navigate("/"); }} className="text-xs text-muted-foreground">
              Déconnexion
            </button>
          </div>
          <nav className="flex gap-1 overflow-x-auto border-t border-border px-2 py-2">
            {NAV.map((item) => (
              <NavLink key={item.to} to={item.to} end={item.end}
                className={({ isActive }) => cn(
                  "shrink-0 rounded-md px-3 py-1.5 text-xs font-medium",
                  isActive ? "bg-accent text-accent-foreground" : "text-muted-foreground",
                )}
              >{item.label}</NavLink>
            ))}
          </nav>
        </header>
        <div className="p-6 md:p-10">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;
