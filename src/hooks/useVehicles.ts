import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { Vehicle } from "@/lib/types";

// Map raw images stored as src/assets paths to Vite imports.
import v1 from "@/assets/vehicle-1.jpg";
import v2 from "@/assets/vehicle-2.jpg";
import v3 from "@/assets/vehicle-3.jpg";
import v4 from "@/assets/vehicle-4.jpg";
import v5 from "@/assets/vehicle-5.jpg";
import v6 from "@/assets/vehicle-6.jpg";

const ASSET_MAP: Record<string, string> = {
  "/src/assets/vehicle-1.jpg": v1,
  "/src/assets/vehicle-2.jpg": v2,
  "/src/assets/vehicle-3.jpg": v3,
  "/src/assets/vehicle-4.jpg": v4,
  "/src/assets/vehicle-5.jpg": v5,
  "/src/assets/vehicle-6.jpg": v6,
};

export function resolveImage(src: string | null | undefined): string | null {
  if (!src) return null;
  return ASSET_MAP[src] ?? src;
}

function normalize(v: any): Vehicle {
  return {
    ...v,
    cover_image: resolveImage(v.cover_image),
    images: (v.images ?? []).map((i: string) => resolveImage(i) ?? i),
  };
}

export function useVehicles() {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let alive = true;
    (async () => {
      const { data, error } = await supabase
        .from("vehicles")
        .select("*")
        .order("is_featured", { ascending: false })
        .order("created_at", { ascending: false });
      if (!alive) return;
      if (!error && data) setVehicles(data.map(normalize));
      setLoading(false);
    })();
    return () => { alive = false; };
  }, []);

  return { vehicles, loading };
}

export function useVehicle(slug: string | undefined) {
  const [vehicle, setVehicle] = useState<Vehicle | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (!slug) return;
    let alive = true;
    (async () => {
      setLoading(true);
      const { data, error } = await supabase.from("vehicles").select("*").eq("slug", slug).maybeSingle();
      if (!alive) return;
      if (error || !data) setNotFound(true);
      else setVehicle(normalize(data));
      setLoading(false);
    })();
    return () => { alive = false; };
  }, [slug]);

  return { vehicle, loading, notFound };
}
