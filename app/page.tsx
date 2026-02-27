import Image from "next/image";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

function DishCard({ title, description, ingredients, media }: any) {
  const images: string[] = media?.images || [];
  const video: string | undefined = media?.video;

  return (
    <section style={{ border: "1px solid #ddd", padding: 16, marginTop: 12 }}>
      <h2>{title}</h2>
      <p>{description}</p>

      {images.length > 0 && (
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginTop: 10 }}>
          {images.slice(0, 3).map((url, i) => (
            <div key={i} style={{ width: 220, height: 140, position: "relative" }}>
              <Image
                src={url}
                alt={`${title} ${i + 1}`}
                fill
                style={{ objectFit: "cover", borderRadius: 8 }}
              />
            </div>
          ))}
        </div>
      )}

      {video && (
        <details style={{ marginTop: 12 }}>
          <summary style={{ cursor: "pointer" }}>▶ Play video</summary>
          <video controls width="100%" style={{ marginTop: 10, borderRadius: 8 }}>
            <source src={video} type="video/mp4" />
          </video>
        </details>
      )}

      <h4 style={{ marginTop: 12 }}>Ingredients</h4>
      <ul>
        {ingredients?.map((ing: any, idx: number) => (
          <li key={idx}>
            {ing.quantity} {ing.unit} {ing.name}
          </li>
        ))}
      </ul>
    </section>
  );
}

export default async function Home() {
  const today = new Date().toISOString().slice(0, 10);

  const { data, error } = await supabase
    .from("daily_menus")
    .select("menu_date,status,menu_json,media_json")
    .eq("status", "published")
    .order("menu_date", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error) return <main style={{ padding: 24 }}>Error: {error.message}</main>;
  if (!data) return <main style={{ padding: 24 }}>No published menu found.</main>;

  const menu = (data as any).menu_json?.menu;
  const media = (data as any).media_json || {};

  return (
    <main style={{ padding: 24, maxWidth: 980, margin: "0 auto" }}>
      <h1>Daily Menu</h1>
      <p>Date: {data.menu_date}</p>

      <DishCard
        title={`Soup — ${menu?.soup?.title_en}`}
        description={menu?.soup?.description_en}
        ingredients={menu?.soup?.ingredients}
        media={media?.soup}
      />
      <DishCard
        title={`Main — ${menu?.main?.title_en}`}
        description={menu?.main?.description_en}
        ingredients={menu?.main?.ingredients}
        media={media?.main}
      />
      <DishCard
        title={`Salad — ${menu?.salad?.title_en}`}
        description={menu?.salad?.description_en}
        ingredients={menu?.salad?.ingredients}
        media={media?.salad}
      />
      <DishCard
        title={`Side — ${menu?.side?.title_en}`}
        description={menu?.side?.description_en}
        ingredients={menu?.side?.ingredients}
        media={media?.side}
      />
    </main>
  );
}