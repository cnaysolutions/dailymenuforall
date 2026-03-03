export const dynamic = "force-dynamic";

import { headers } from "next/headers";

function getLang(host: string): "tr" | "en" {
  return host.toLowerCase().includes("gunlukmenu") ? "tr" : "en";
}

export default async function DataDeletion() {
  const headersList = await headers();
  const host = headersList.get("host") || "";
  const lang = getLang(host);

  if (lang === "tr") {
    return (
      <main style={{ maxWidth: 720, margin: "0 auto", padding: "40px 20px", fontFamily: "sans-serif", lineHeight: 1.8, color: "#2c1810" }}>
        <h1 style={{ fontSize: 28, marginBottom: 24 }}>Veri Silme Talebi</h1>

        <h2 style={{ fontSize: 20, marginTop: 28 }}>Veri Silme Politikamız</h2>
        <p>Günlük Menü (gunlukmenu.com) kullanıcılardan kişisel veri toplamaz veya saklamaz. Web sitemiz kullanıcı hesabı, giriş veya kayıt gerektirmez.</p>

        <h2 style={{ fontSize: 20, marginTop: 28 }}>Facebook / Instagram Verileri</h2>
        <p>Facebook veya Instagram üzerinden hizmetimizle etkileşimde bulunduysanız ve verilerinizin silinmesini istiyorsanız:</p>
        <p>1. Doğrudan Facebook/Instagram ayarlarınızdan uygulama erişimini kaldırabilirsiniz</p>
        <p>2. Veya bize e-posta gönderebilirsiniz: <strong>info@dailymenuforall.com</strong></p>
        <p>Silme talebinizi 30 gün içinde işleme alacağız.</p>

        <h2 style={{ fontSize: 20, marginTop: 28 }}>İletişim</h2>
        <p>Veri silme talepleri için: <strong>info@dailymenuforall.com</strong></p>
        <p>Konu satırına &quot;Veri Silme Talebi&quot; yazınız.</p>

        <h2 style={{ fontSize: 20, marginTop: 28 }}>Onay</h2>
        <p>Talebinizi aldıktan sonra, silme işleminin tamamlandığını onaylayan bir e-posta göndereceğiz.</p>
      </main>
    );
  }

  return (
    <main style={{ maxWidth: 720, margin: "0 auto", padding: "40px 20px", fontFamily: "sans-serif", lineHeight: 1.8, color: "#2c1810" }}>
      <h1 style={{ fontSize: 28, marginBottom: 24 }}>Data Deletion Request</h1>

      <h2 style={{ fontSize: 20, marginTop: 28 }}>Our Data Deletion Policy</h2>
      <p>Daily Menu (dailymenuforall.com / dailyhalalmenu.com) does not collect or store personal data from users. Our website does not require any user accounts, logins, or registration.</p>

      <h2 style={{ fontSize: 20, marginTop: 28 }}>Facebook / Instagram Data</h2>
      <p>If you have interacted with our service through Facebook or Instagram and wish to have your data deleted:</p>
      <p>1. You can remove app access directly from your Facebook/Instagram settings</p>
      <p>2. Or you can email us at: <strong>info@dailymenuforall.com</strong></p>
      <p>We will process your deletion request within 30 days.</p>

      <h2 style={{ fontSize: 20, marginTop: 28 }}>Contact</h2>
      <p>For data deletion requests: <strong>info@dailymenuforall.com</strong></p>
      <p>Please include &quot;Data Deletion Request&quot; in the subject line.</p>

      <h2 style={{ fontSize: 20, marginTop: 28 }}>Confirmation</h2>
      <p>After receiving your request, we will send a confirmation email once the deletion is complete.</p>
    </main>
  );
}
