import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Loader2, Shield, ShieldOff, RefreshCw, Search, Users } from "lucide-react";
import { Input } from "@/components/ui/input";

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
    ? users.filter(
        (u) =>
          (u.email ?? "").toLowerCase().includes(q) ||
          u.id.toLowerCase().includes(q),
      )
    : users;

  const fmt = (d: string | null) =>
    d ? new Date(d).toLocaleString("fr-FR", { dateStyle: "short", timeStyle: "short" }) : "—";

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="font-serif text-3xl font-semibold">Utilisateurs</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Gérez les comptes et attribuez les droits administrateurs.
          </p>
        </div>
        <Button variant="elegant" size="sm" onClick={load} disabled={loading}>
          <RefreshCw className={loading ? "animate-spin" : ""} /> Actualiser
        </Button>
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
                <TableHead>Rôles</TableHead>
                <TableHead>Inscription</TableHead>
                <TableHead>Dernière connexion</TableHead>
                <TableHead className="text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUsers.map((u) => {
                const isAdmin = u.roles.includes("admin");
                const isSelf = u.id === user?.id;
                return (
                  <TableRow key={u.id}>
                    <TableCell>
                      <div className="font-medium">{u.email ?? "—"}</div>
                      {isSelf && <div className="text-[10px] uppercase tracking-wider text-accent">Vous</div>}
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {isAdmin ? (
                          <Badge className="bg-gradient-gold text-primary-foreground">Admin</Badge>
                        ) : u.roles.includes("team") ? (
                          <Badge className="bg-sky-100 text-sky-900">Équipe</Badge>
                        ) : (
                          <Badge variant="secondary">Utilisateur</Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">{fmt(u.created_at)}</TableCell>
                    <TableCell className="text-sm text-muted-foreground">{fmt(u.last_sign_in_at)}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        {isAdmin ? (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => toggleAdmin(u)}
                            disabled={isSelf || busyId === u.id}
                            title={isSelf ? "Vous ne pouvez pas vous rétrograder" : ""}
                          >
                            {busyId === u.id ? <Loader2 className="animate-spin" /> : <ShieldOff />}
                            Retirer admin
                          </Button>
                        ) : (
                          <Button
                            variant="gold"
                            size="sm"
                            onClick={() => toggleAdmin(u)}
                            disabled={busyId === u.id}
                          >
                            {busyId === u.id ? <Loader2 className="animate-spin" /> : <Shield />}
                            Promouvoir admin
                          </Button>
                        )}
                        {!isAdmin && (
                          u.roles.includes("team") ? (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => toggleTeam(u)}
                              disabled={busyId === u.id}
                            >
                              {busyId === u.id ? <Loader2 className="animate-spin" /> : <Users />}
                              Retirer équipe
                            </Button>
                          ) : (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => toggleTeam(u)}
                              disabled={busyId === u.id}
                            >
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

      <p className="text-xs text-muted-foreground">
        Les nouveaux comptes sont créés via la page <code>/admin/auth</code>. Une fois inscrit, un administrateur peut promouvoir un utilisateur ici.
      </p>
    </div>
  );
};

export default AdminUsers;
