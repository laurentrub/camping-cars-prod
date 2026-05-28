import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { toast } from "sonner";
import { Loader2, Shield, ShieldOff, RefreshCw, Search, Users, UserPlus, Eye, EyeOff } from "lucide-react";

type AdminUser = {
  id: string;
  email: string | null;
  created_at: string;
  last_sign_in_at: string | null;
  roles: string[];
};

const AdminUsers = () => {
  const { user } = useAuth();
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [query, setQuery] = useState("");

  const [createOpen, setCreateOpen] = useState(false);
  const [creating, setCreating] = useState(false);
  const [newEmail, setNewEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [newRole, setNewRole] = useState<"team" | "admin">("team");
  const [showPassword, setShowPassword] = useState(false);

  const load = async () => {
    setLoading(true);
    const { data, error } = await supabase.functions.invoke("admin-users", {
      body: { action: "list" },
    });
    if (error || (data as any)?.error) {
      toast.error((data as any)?.error ?? error?.message ?? "Erreur de chargement");
      setUsers([]);
    } else {
      setUsers((data as any).users ?? []);
    }
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const createMember = async () => {
    if (!newEmail.trim() || !newPassword) return;
    setCreating(true);
    const { data, error } = await supabase.functions.invoke("admin-users", {
      body: { action: "create_member", email: newEmail.trim(), password: newPassword, role: newRole },
    });
    setCreating(false);
    if (error || (data as any)?.error) {
      toast.error((data as any)?.error ?? error?.message ?? "Erreur de création");
      return;
    }
    toast.success(`Compte créé : ${newEmail.trim()}`);
    setCreateOpen(false);
    setNewEmail("");
    setNewPassword("");
    setNewRole("team");
    load();
  };

  const toggleAdmin = async (target: AdminUser) => {
    const hasAdmin = target.roles.includes("admin");
    const action = hasAdmin ? "demote" : "promote";
    setBusyId(target.id);
    const { data, error } = await supabase.functions.invoke("admin-users", {
      body: { action, user_id: target.id },
    });
    setBusyId(null);
    if (error || (data as any)?.error) {
      toast.error((data as any)?.error ?? error?.message ?? "Action impossible");
      return;
    }
    toast.success(hasAdmin ? "Droits admin retirés" : "Promu administrateur");
    load();
  };

  const toggleTeam = async (target: AdminUser) => {
    const hasTeam = target.roles.includes("team");
    const action = hasTeam ? "demote_team" : "promote_team";
    setBusyId(target.id);
    const { data, error } = await supabase.functions.invoke("admin-users", {
      body: { action, user_id: target.id },
    });
    setBusyId(null);
    if (error || (data as any)?.error) {
      toast.error((data as any)?.error ?? error?.message ?? "Action impossible");
      return;
    }
    toast.success(hasTeam ? "Rôle équipe retiré" : "Ajouté à l'équipe");
    load();
  };

  const q = query.trim().toLowerCase();
  const filteredUsers = q
    ? users.filter((u) => (u.email ?? "").toLowerCase().includes(q) || u.id.toLowerCase().includes(q))
    : users;

  const fmt = (d: string | null) =>
    d ? new Date(d).toLocaleString("fr-FR", { dateStyle: "short", timeStyle: "short" }) : "—";

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="font-serif text-3xl font-semibold">Utilisateurs</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Gérez les comptes et attribuez les rôles.
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="hero" size="sm" onClick={() => setCreateOpen(true)}>
            <UserPlus className="h-4 w-4" /> Ajouter un membre
          </Button>
          <Button variant="elegant" size="sm" onClick={load} disabled={loading}>
            <RefreshCw className={loading ? "animate-spin" : ""} /> Actualiser
          </Button>
        </div>
      </div>

      <div className="relative max-w-md">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Rechercher par email ou ID…"
          className="pl-9"
        />
      </div>

      <div className="rounded-lg border border-border bg-card">
        {loading ? (
          <div className="flex items-center justify-center p-12 text-muted-foreground">
            <Loader2 className="mr-2 h-5 w-5 animate-spin" /> Chargement…
          </div>
        ) : users.length === 0 ? (
          <div className="p-10 text-center text-sm text-muted-foreground">Aucun utilisateur</div>
        ) : filteredUsers.length === 0 ? (
          <div className="p-10 text-center text-sm text-muted-foreground">
            Aucun résultat pour « {query} »
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Email</TableHead>
                <TableHead>Rôle</TableHead>
                <TableHead>Inscription</TableHead>
                <TableHead>Dernière connexion</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUsers.map((u) => {
                const isAdmin = u.roles.includes("admin");
                const isTeam = u.roles.includes("team");
                const isSelf = u.id === user?.id;
                return (
                  <TableRow key={u.id}>
                    <TableCell>
                      <div className="font-medium">{u.email ?? "—"}</div>
                      {isSelf && <div className="text-[10px] uppercase tracking-wider text-accent">Vous</div>}
                    </TableCell>
                    <TableCell>
                      {isAdmin ? (
                        <Badge className="bg-gradient-gold text-primary-foreground">Admin</Badge>
                      ) : isTeam ? (
                        <Badge className="bg-sky-100 text-sky-900">Équipe</Badge>
                      ) : (
                        <Badge variant="secondary">Utilisateur</Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">{fmt(u.created_at)}</TableCell>
                    <TableCell className="text-sm text-muted-foreground">{fmt(u.last_sign_in_at)}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        {isAdmin ? (
                          <Button variant="outline" size="sm" onClick={() => toggleAdmin(u)} disabled={isSelf || busyId === u.id} title={isSelf ? "Vous ne pouvez pas vous rétrograder" : ""}>
                            {busyId === u.id ? <Loader2 className="animate-spin" /> : <ShieldOff />}
                            Retirer admin
                          </Button>
                        ) : (
                          <Button variant="gold" size="sm" onClick={() => toggleAdmin(u)} disabled={busyId === u.id}>
                            {busyId === u.id ? <Loader2 className="animate-spin" /> : <Shield />}
                            Promouvoir admin
                          </Button>
                        )}
                        {!isAdmin && (
                          isTeam ? (
                            <Button variant="outline" size="sm" onClick={() => toggleTeam(u)} disabled={busyId === u.id}>
                              {busyId === u.id ? <Loader2 className="animate-spin" /> : <Users />}
                              Retirer équipe
                            </Button>
                          ) : (
                            <Button variant="outline" size="sm" onClick={() => toggleTeam(u)} disabled={busyId === u.id}>
                              {busyId === u.id ? <Loader2 className="animate-spin" /> : <Users />}
                              Ajouter équipe
                            </Button>
                          )
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        )}
      </div>

      <Dialog open={createOpen} onOpenChange={setCreateOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="font-serif text-xl">Ajouter un membre</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 pt-2">
            <div className="space-y-1.5">
              <Label htmlFor="new-email">Email *</Label>
              <Input
                id="new-email"
                type="email"
                placeholder="prenom.nom@example.com"
                value={newEmail}
                onChange={(e) => setNewEmail(e.target.value)}
                autoComplete="off"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="new-password">Mot de passe temporaire *</Label>
              <div className="relative">
                <Input
                  id="new-password"
                  type={showPassword ? "text" : "password"}
                  placeholder="8 caractères minimum"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  autoComplete="new-password"
                  className="pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>
            <div className="space-y-1.5">
              <Label>Rôle *</Label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setNewRole("team")}
                  className={`rounded-lg border p-3 text-left text-sm transition-smooth ${newRole === "team" ? "border-accent bg-accent/5" : "border-border hover:border-accent/50"}`}
                >
                  <div className="font-semibold">Équipe</div>
                  <div className="mt-0.5 text-xs text-muted-foreground">Gère ses propres véhicules et réservations</div>
                </button>
                <button
                  type="button"
                  onClick={() => setNewRole("admin")}
                  className={`rounded-lg border p-3 text-left text-sm transition-smooth ${newRole === "admin" ? "border-accent bg-accent/5" : "border-border hover:border-accent/50"}`}
                >
                  <div className="font-semibold">Admin</div>
                  <div className="mt-0.5 text-xs text-muted-foreground">Accès complet à toutes les sections</div>
                </button>
              </div>
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <Button variant="elegant" onClick={() => setCreateOpen(false)} disabled={creating}>
                Annuler
              </Button>
              <Button
                variant="hero"
                onClick={createMember}
                disabled={creating || !newEmail.trim() || newPassword.length < 8}
              >
                {creating ? <Loader2 className="animate-spin" /> : <UserPlus className="h-4 w-4" />}
                Créer le compte
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminUsers;
