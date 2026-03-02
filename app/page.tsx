export const dynamic = "force-dynamic";

import { createClient } from "@supabase/supabase-js";
import { headers } from "next/headers";
import Image from "next/image";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

const BG_MUSIC_URL =
  "https://hwuhwqmixioehvshmila.supabase.co/storage/v1/object/public/menu-music/bg-tr-1.mp3";

// ─── Language config per domain ───
function getLangFromHost(host: string): "tr" | "en" {
  const h = host.toLowerCase();
  if (h.includes("gunlukmenu")) return "tr";
  return "en";
}

const labels = {
  en: {
    badge_today: "Today's Menu",
    badge_latest: "Latest Menu",
    title: "Daily Menu",
    halal: "✓ Halal — No pork, no alcohol",
    soup: "Soup",
    main: "Main Course",
    salad: "Salad",
    side: "Side Dish",
    ingredients: "Ingredients",
    serving: "Serving",
    empty_title: "Daily Menu",
    empty_text: "Today's menu is being prepared. Check back soon!",
    footer: "Menu generated with AI — ingredients may vary",
    error: "Something went wrong. Please try again later.",
  },
  tr: {
    badge_today: "Günün Menüsü",
    badge_latest: "Son Menü",
    title: "Günün Menüsü",
    halal: "✓ Helal — Domuz eti yok, alkol yok",
    soup: "Çorba",
    main: "Ana Yemek",
    salad: "Salata",
    side: "Yan Yemek",
    ingredients: "Malzemeler",
    serving: "Porsiyon",
    empty_title: "Günün Menüsü",
    empty_text: "Günün menüsü hazırlanıyor. Lütfen daha sonra tekrar kontrol edin!",
    footer: "Menü yapay zeka ile oluşturulmuştur — malzemeler değişebilir",
    error: "Bir hata oluştu. Lütfen daha sonra tekrar deneyin.",
  },
};

// ─── Types ───
interface Ingredient {
  name_en: string;
  name_tr: string;
  quantity: number;
  unit: string;
}

interface Dish {
  title_en?: string;
  title_tr?: string;
  description_en?: string;
  description_tr?: string;
  ingredients?: Ingredient[];
  serving_size_g?: number;
  diet_tags?: string[];
}

interface MenuData {
  soup?: Dish;
  main?: Dish;
  salad?: Dish;
  side?: Dish;
}

interface MediaDish {
  images?: string[];
  video?: string | null;
}

interface MediaData {
  soup?: MediaDish;
  main?: MediaDish;
  salad?: MediaDish;
  side?: MediaDish;
}

// ─── Dish Card Component ───
function DishCard({
  label,
  emoji,
  dish,
  media,
  lang,
}: {
  label: string;
  emoji: string;
  dish?: Dish;
  media?: MediaDish;
  lang: "en" | "tr";
}) {
  const images = media?.images || [];
  const title = lang === "tr" ? (dish?.title_tr ?? dish?.title_en ?? "—") : (dish?.title_en ?? "—");
  const desc = lang === "tr" ? (dish?.description_tr ?? dish?.description_en) : (dish?.description_en);
  const l = labels[lang];

  return (
    <section className="dish-card">
      <div className="dish-header">
        <span className="dish-emoji">{emoji}</span>
        <div>
          <span className="dish-label">{label}</span>
          <h2 className="dish-title">{title}</h2>
        </div>
      </div>

      {desc && <p className="dish-desc">{desc}</p>}

      {images.length > 0 && (
        <div className="dish-image-wrap">
          <Image
            src={images[0]}
            alt={title}
            width={800}
            height={600}
            className="dish-image"
            priority
          />
        </div>
      )}

      {dish?.diet_tags && dish.diet_tags.length > 0 && (
        <div className="diet-tags">
          {dish.diet_tags.map((tag, i) => (
            <span key={i} className="diet-tag">
              {tag}
            </span>
          ))}
        </div>
      )}

      {dish?.ingredients && dish.ingredients.length > 0 && (
        <details className="ingredients-details">
          <summary>{l.ingredients}</summary>
          <ul className="ingredients-list">
            {dish.ingredients.map((ing, idx) => (
              <li key={idx}>
                <span className="ing-amount">
                  {ing.quantity} {ing.unit}
                </span>{" "}
                <span className="ing-name">
                  {lang === "tr" ? ing.name_tr : ing.name_en}
                </span>
              </li>
            ))}
          </ul>
        </details>
      )}

      {dish?.serving_size_g && (
        <div className="serving-info">
          {l.serving}: {dish.serving_size_g}g
        </div>
      )}
    </section>
  );
}

// ─── Main Page ───
export default async function Home() {
  const headersList = await headers();
  const host = headersList.get("host") || "";
  const lang = getLangFromHost(host);
  const l = labels[lang];

  const today = new Date().toISOString().slice(0, 10);

  const { data: todayMenu, error: errToday } = await supabase
    .from("daily_menus")
    .select("menu_date, status, menu_json, media_json")
    .eq("status", "published")
    .eq("menu_date", today)
    .maybeSingle();

  if (errToday) {
    return (
      <main className="page-container">
        <div className="error-state">
          <p>{l.error}</p>
        </div>
      </main>
    );
  }

  const { data: latestMenu } = todayMenu
    ? { data: null }
    : await supabase
        .from("daily_menus")
        .select("menu_date, status, menu_json, media_json")
        .eq("status", "published")
        .order("menu_date", { ascending: false })
        .limit(1)
        .maybeSingle();

  const data = todayMenu ?? latestMenu;

  if (!data) {
    return (
      <main className="page-container">
        <div className="empty-state">
          <div className="empty-icon">🍽️</div>
          <h1>{l.empty_title}</h1>
          <p>{l.empty_text}</p>
        </div>
      </main>
    );
  }

  const menuJson = (data as Record<string, unknown>).menu_json as Record<string, unknown> | null;
  const menu = (menuJson?.menu as MenuData) || (menuJson as unknown as MenuData);
  const media = ((data as Record<string, unknown>).media_json as MediaData) || {};
  const menuDate = (data as Record<string, unknown>).menu_date as string;
  const isToday = menuDate === today;

  const dateObj = new Date(menuDate + "T00:00:00");
  const locale = lang === "tr" ? "tr-TR" : "en-US";
  const formattedDate = dateObj.toLocaleDateString(locale, {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <main className="page-container">
      <header className="page-header">
        <div className="header-badge">
          {isToday ? l.badge_today : l.badge_latest}
        </div>
        <h1 className="header-title">{l.title}</h1>
        <div className="header-date">
          <span>{formattedDate}</span>
        </div>
      </header>

      <div className="halal-badge">{l.halal}</div>

      <div className="dishes-grid">
        <DishCard label={l.soup} emoji="🍜" dish={menu?.soup} media={media?.soup} lang={lang} />
        <DishCard label={l.main} emoji="🥘" dish={menu?.main} media={media?.main} lang={lang} />
        <DishCard label={l.salad} emoji="🥗" dish={menu?.salad} media={media?.salad} lang={lang} />
        <DishCard label={l.side} emoji="🍚" dish={menu?.side} media={media?.side} lang={lang} />
      </div>

      <div className="music-player">
        <span className="music-icon">♪</span>
        <audio controls loop preload="none" className="audio-el">
          <source src={BG_MUSIC_URL} type="audio/mpeg" />
        </audio>
      </div>

      <footer className="page-footer">
        <p>{l.footer}</p>
      </footer>
    </main>
  );
}
