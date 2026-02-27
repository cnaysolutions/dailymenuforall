export const dynamic = "force-dynamic";

import Image from "next/image";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// Your Supabase public music URL (TR for now)
const BG_MUSIC_URL =
  "https://hwuhwqmixioehvshmila.supabase.co/storage/v1/object/public/menu-music/bg-tr-1.mp3";

function DishCard({
  label,
  title,
  description,
  ingredients,
  media,
}: {
  label: string;
  title?: string;
  description?: string;
  ingredients?: Array<{ name: string; quantity: number; unit: string }>;
  media?: { images?: string[]; video?: string | null };
}) {
  const images: string[] = media?.images || [];
  const video: string | null | undefined = media?.video;

  return (
    <section
      style={{
        border: "1px solid #e5e7eb",
        borderRadius: 12,
        padding: 16,
        marginTop: 14,
        background: "white",
      }}
    >
      <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
        <div style={{ fontSize: 12, opacity: 0.7 }}>{label}</div>
        <h2 style={{ margin: 0, fontSize: 18 }}>{title ?? "-"}</h2>
        {description ? (
          <p style={{ margin: 0, opacity: 0.85 }}>{description}</p>
        ) : null}
      </div>

      {images.length > 0 && (
        <div
          style={{
            display: "flex",
            gap: 10,
            flexWrap: "wrap",
            marginTop: 12,
          }}
        >
          {images.slice(0, 4).map((url, i) => (
            <div
              key={i}
              style={{
                width: 240,
                height: 150,
                position: "relative",
                borderRadius: 10,
                overflow: "hidden",
                border: "1px solid #f1f5f9",
              }}
            >
              <Image
                src={url}
                alt={`${title ?? label} ${i + 1}`}
                fill
                style={{ objectFit: "cover" }}
                sizes="240px"
                priority={i === 0}
              />
            </div>
          ))}
        </div>
      )}

      {video ? (
        <details style={{ marginTop: 12 }}>
          <summary style={{ cursor: "pointer", fontWeight: 600 }}>
            ▶ Play video (main dish)
          </summary>
          <video
            controls
            preload="metadata"
            width="100%"
            style={{
              marginTop: 10,
              borderRadius: 12,
              border: "1px solid #e5e7eb",
              background: "#000",
            }}
          >
            <source src={video} type="video/mp4" />
          </video>
        </details>
      ) : null}

      <h4 style={{ marginTop: 14, marginBottom: 6 }}>Ingredients</h4>
      {ingredients?.length ? (
        <ul style={{ marginTop: 0 }}>
          {ingredients.map((ing, idx) => (
            <li key={idx}>
              {ing.quantity} {ing.unit} {ing.name}
            </li>
          ))}
        </ul>
      ) : (
        <p style={{ marginTop: 0, opacity: 0.7 }}>No ingredients.</p>
      )}
    </section>
  );
}

export default async function Home() {
  const today = new Date().toISOString().slice(0, 10);

  // 1) Try to get today's published menu
  const { data: todayMenu, error: errToday } = await supabase
    .from("daily_menus")
    .select("menu_date,status,menu_json,media_json")
    .eq("status", "published")
    .eq("menu_date", today)
    .maybeSingle();

  if (errToday) {
    return <main style={{ padding: 24 }}>Error: {errToday.message}</main>;
  }

  // 2) If no menu for today, fallback to latest published
  const { data: latestMenu, error: errLatest } = todayMenu
    ? { data: null, error: null }
    : await supabase
        .from("daily_menus")
        .select("menu_date,status,menu_json,media_json")
        .eq("status", "published")
        .order("menu_date", { ascending: false })
        .limit(1)
        .maybeSingle();

  if (errLatest) {
    return <main style={{ padding: 24 }}>Error: {errLatest.message}</main>;
  }

  const data = todayMenu ?? latestMenu;

  if (!data) {
    return <main style={{ padding: 24 }}>No published menu found.</main>;
  }

  const menu = (data as any).menu_json?.menu;
  const media = (data as any).media_json || {};

  return (
    <main style={{ padding: 24, maxWidth: 1020, margin: "0 auto" }}>
      <header style={{ marginBottom: 12 }}>
        <h1 style={{ margin: 0 }}>Daily Menu</h1>
        <p style={{ margin: "6px 0 0 0", opacity: 0.75 }}>
          Date: {data.menu_date}{" "}
          {data.menu_date === today ? "(Today)" : "(Latest published)"}
        </p>

        {/* Background Music (TR for now) */}
        <div style={{ marginTop: 12 }}>
          <div style={{ fontSize: 12, opacity: 0.7, marginBottom: 6 }}>
            Background music
          </div>
          <audio controls autoPlay loop style={{ width: "100%" }}>
            <source src={BG_MUSIC_URL} type="audio/mpeg" />
          </audio>
        </div>
      </header>

      <DishCard
        label="Soup"
        title={menu?.soup?.title_en}
        description={menu?.soup?.description_en}
        ingredients={menu?.soup?.ingredients}
        media={media?.soup}
      />

      <DishCard
        label="Main"
        title={menu?.main?.title_en}
        description={menu?.main?.description_en}
        ingredients={menu?.main?.ingredients}
        media={media?.main}
      />

      <DishCard
        label="Salad"
        title={menu?.salad?.title_en}
        description={menu?.salad?.description_en}
        ingredients={menu?.salad?.ingredients}
        media={media?.salad}
      />

      <DishCard
        label="Side"
        title={menu?.side?.title_en}
        description={menu?.side?.description_en}
        ingredients={menu?.side?.ingredients}
        media={media?.side}
      />
    </main>
  );
}