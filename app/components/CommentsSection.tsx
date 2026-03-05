"use client";

import { useEffect, useState, useRef } from "react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

interface Comment {
  id: string;
  created_at: string;
  menu_date: string;
  user_name: string;
  user_avatar: string | null;
  comment: string;
  photo_url: string | null;
}

interface User {
  email: string;
  name: string;
  avatar: string | null;
}

const TEXT = {
  en: {
    title: "Community Kitchen",
    subtitle: "Share your cooking results & tips!",
    login: "Sign in with Google",
    logout: "Sign out",
    placeholder: "How did your dish turn out? Share your experience...",
    submit: "Post Comment",
    uploading: "Posting...",
    photo_label: "Add photo",
    no_comments: "Be the first to share your experience!",
    just_now: "Just now",
    ago_min: "m ago",
    ago_hour: "h ago",
    ago_day: "d ago",
    login_prompt: "Sign in to share your cooking experience",
  },
  tr: {
    title: "Topluluk Mutfağı",
    subtitle: "Yemek sonuçlarınızı ve ipuçlarınızı paylaşın!",
    login: "Google ile Giriş Yap",
    logout: "Çıkış Yap",
    placeholder: "Yemeğiniz nasıl oldu? Deneyiminizi paylaşın...",
    submit: "Yorum Yap",
    uploading: "Gönderiliyor...",
    photo_label: "Fotoğraf ekle",
    no_comments: "Deneyiminizi paylaşan ilk kişi olun!",
    just_now: "Az önce",
    ago_min: "dk önce",
    ago_hour: "sa önce",
    ago_day: "g önce",
    login_prompt: "Yemek deneyiminizi paylaşmak için giriş yapın",
  },
};

function timeAgo(dateStr: string, lang: "en" | "tr") {
  const t = TEXT[lang];
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return t.just_now;
  if (mins < 60) return `${mins}${t.ago_min}`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}${t.ago_hour}`;
  const days = Math.floor(hours / 24);
  return `${days}${t.ago_day}`;
}

export default function CommentsSection({
  menuDate,
  lang,
}: {
  menuDate: string;
  lang: "en" | "tr";
}) {
  const t = TEXT[lang];
  const [user, setUser] = useState<User | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState("");
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [posting, setPosting] = useState(false);
  const [loading, setLoading] = useState(true);
  const scrollRef = useRef<HTMLDivElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  // Check auth on mount
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        setUser({
          email: session.user.email || "",
          name:
            session.user.user_metadata?.full_name ||
            session.user.user_metadata?.name ||
            session.user.email?.split("@")[0] ||
            "User",
          avatar: session.user.user_metadata?.avatar_url || null,
        });
      }
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        setUser({
          email: session.user.email || "",
          name:
            session.user.user_metadata?.full_name ||
            session.user.user_metadata?.name ||
            session.user.email?.split("@")[0] ||
            "User",
          avatar: session.user.user_metadata?.avatar_url || null,
        });
      } else {
        setUser(null);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  // Fetch comments
  useEffect(() => {
    async function fetchComments() {
      setLoading(true);
      const { data } = await supabase
        .from("menu_comments")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(50);
      setComments(data || []);
      setLoading(false);
    }
    fetchComments();

    // Real-time subscription
    const channel = supabase
      .channel("comments")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "menu_comments" },
        (payload) => {
          setComments((prev) => [payload.new as Comment, ...prev]);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [menuDate]);

  // Auto-scroll effect — only when there are many comments
  useEffect(() => {
    const el = scrollRef.current;
    if (!el || comments.length < 6) return;
    let scrollPos = 0;
    const speed = 0.3;
    let animFrame: number;
    let paused = false;

    function step() {
      if (!paused && el) {
        scrollPos += speed;
        if (scrollPos >= el.scrollHeight - el.clientHeight) {
          scrollPos = 0;
        }
        el.scrollTop = scrollPos;
      }
      animFrame = requestAnimationFrame(step);
    }
    animFrame = requestAnimationFrame(step);

    const pauseScroll = () => {
      paused = true;
    };
    const resumeScroll = () => {
      setTimeout(() => {
        paused = false;
      }, 3000);
    };

    el.addEventListener("mouseenter", pauseScroll);
    el.addEventListener("mouseleave", resumeScroll);
    el.addEventListener("touchstart", pauseScroll);
    el.addEventListener("touchend", resumeScroll);

    return () => {
      cancelAnimationFrame(animFrame);
      el?.removeEventListener("mouseenter", pauseScroll);
      el?.removeEventListener("mouseleave", resumeScroll);
      el?.removeEventListener("touchstart", pauseScroll);
      el?.removeEventListener("touchend", resumeScroll);
    };
  }, [comments]);

  async function handleLogin() {
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: window.location.href,
      },
    });
  }

  async function handleLogout() {
    await supabase.auth.signOut();
    setUser(null);
  }

  function handlePhotoChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setPhotoFile(file);
    const reader = new FileReader();
    reader.onload = () => setPhotoPreview(reader.result as string);
    reader.readAsDataURL(file);
  }

  function removePhoto() {
    setPhotoFile(null);
    setPhotoPreview(null);
    if (fileRef.current) fileRef.current.value = "";
  }

  async function handleSubmit() {
    if (!user || !newComment.trim()) return;
    setPosting(true);

    let photoUrl: string | null = null;

    // Upload photo if present
    if (photoFile) {
      const ext = photoFile.name.split(".").pop();
      const filePath = `comments/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
      const { error: upErr } = await supabase.storage
        .from("menu-media")
        .upload(filePath, photoFile, { upsert: true });
      if (!upErr) {
        const { data: pub } = supabase.storage
          .from("menu-media")
          .getPublicUrl(filePath);
        photoUrl = pub.publicUrl;
      }
    }

    await supabase.from("menu_comments").insert({
      menu_date: menuDate,
      user_email: user.email,
      user_name: user.name,
      user_avatar: user.avatar,
      comment: newComment.trim(),
      photo_url: photoUrl,
    });

    setNewComment("");
    setPhotoFile(null);
    setPhotoPreview(null);
    if (fileRef.current) fileRef.current.value = "";
    setPosting(false);
  }

  return (
    <section className="comments-section">
      <div className="comments-header">
        <h3 className="comments-title">
          <span className="comments-icon">💬</span> {t.title}
        </h3>
        <p className="comments-subtitle">{t.subtitle}</p>
      </div>

      {/* Comment Form */}
      <div className="comment-form-area">
        {user ? (
          <div className="comment-form">
            <div className="comment-form-user">
              {user.avatar ? (
                <img
                  src={user.avatar}
                  alt={user.name}
                  className="comment-avatar"
                  referrerPolicy="no-referrer"
                />
              ) : (
                <div className="comment-avatar-placeholder">
                  {user.name.charAt(0).toUpperCase()}
                </div>
              )}
              <span className="comment-user-name">{user.name}</span>
              <button onClick={handleLogout} className="comment-logout-btn">
                {t.logout}
              </button>
            </div>
            <textarea
              className="comment-textarea"
              placeholder={t.placeholder}
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              rows={3}
              maxLength={500}
            />
            {photoPreview && (
              <div className="comment-photo-preview">
                <img src={photoPreview} alt="Preview" />
                <button onClick={removePhoto} className="remove-photo-btn">
                  ✕
                </button>
              </div>
            )}
            <div className="comment-form-actions">
              <label className="comment-photo-btn">
                📷 {t.photo_label}
                <input
                  ref={fileRef}
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoChange}
                  style={{ display: "none" }}
                />
              </label>
              <button
                onClick={handleSubmit}
                disabled={posting || !newComment.trim()}
                className="comment-submit-btn"
              >
                {posting ? t.uploading : t.submit}
              </button>
            </div>
          </div>
        ) : (
          <div className="comment-login-prompt">
            <p>{t.login_prompt}</p>
            <button onClick={handleLogin} className="google-login-btn">
              <svg viewBox="0 0 24 24" width="18" height="18">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              {t.login}
            </button>
          </div>
        )}
      </div>

      {/* Sliding Comments Feed */}
      <div className="comments-feed" ref={scrollRef}>
        {loading ? (
          <div className="comments-loading">
            <div className="loading-dots">
              <span></span><span></span><span></span>
            </div>
          </div>
        ) : comments.length === 0 ? (
          <p className="no-comments">{t.no_comments}</p>
        ) : (
          comments.map((c) => (
            <div key={c.id} className="comment-card">
              <div className="comment-card-header">
                {c.user_avatar ? (
                  <img
                    src={c.user_avatar}
                    alt={c.user_name}
                    className="comment-card-avatar"
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <div className="comment-card-avatar-placeholder">
                    {c.user_name.charAt(0).toUpperCase()}
                  </div>
                )}
                <div className="comment-card-meta">
                  <span className="comment-card-name">{c.user_name}</span>
                  <span className="comment-card-time">
                    {timeAgo(c.created_at, lang)}
                  </span>
                </div>
              </div>
              <p className="comment-card-text">{c.comment}</p>
              {c.photo_url && (
                <div className="comment-card-photo">
                  <img src={c.photo_url} alt="User photo" />
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </section>
  );
}
