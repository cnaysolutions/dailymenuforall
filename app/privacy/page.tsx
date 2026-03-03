export const dynamic = "force-dynamic";

import { headers } from "next/headers";

function getLang(host: string): "tr" | "en" {
  return host.toLowerCase().includes("gunlukmenu") ? "tr" : "en";
}

export default async function PrivacyPolicy() {
  const headersList = await headers();
  const host = headersList.get("host") || "";
  const lang = getLang(host);

  if (lang === "tr") {
    return (
      <main style={{ maxWidth: 720, margin: "0 auto", padding: "40px 20px", fontFamily: "sans-serif", lineHeight: 1.8, color: "#2c1810" }}>
        <h1 style={{ fontSize: 28, marginBottom: 24 }}>Gizlilik Politikası</h1>
        <p><strong>Son güncelleme:</strong> 2 Mart 2026</p>

        <h2 style={{ fontSize: 20, marginTop: 28 }}>Hakkımızda</h2>
        <p>Günlük Menü (gunlukmenu.com), yapay zeka ile oluşturulan günlük helal menüler sunan bir web sitesidir. Gizliliğinize saygı duyuyoruz ve kişisel verilerinizi korumayı taahhüt ediyoruz.</p>

        <h2 style={{ fontSize: 20, marginTop: 28 }}>Topladığımız Bilgiler</h2>
        <p>Web sitemiz minimum düzeyde veri toplar. Kullanıcı hesabı, giriş veya kayıt gerektirmez. Topladığımız bilgiler şunlardır:</p>
        <p>• <strong>Kullanım verileri:</strong> Sayfa görüntülemeleri ve genel trafik istatistikleri (çerezler veya analiz araçları aracılığıyla)</p>
        <p>• <strong>Cihaz bilgileri:</strong> Tarayıcı türü, işletim sistemi (standart web sunucu günlükleri)</p>
        <p>Adınız, e-posta adresiniz veya herhangi bir kişisel bilginizi doğrudan toplamıyoruz.</p>

        <h2 style={{ fontSize: 20, marginTop: 28 }}>Sosyal Medya</h2>
        <p>Facebook ve Instagram sayfalarımızı sosyal medya aracılığıyla yönetiyoruz. Bu platformlarla etkileşimde bulunduğunuzda, ilgili platformun gizlilik politikası geçerlidir.</p>

        <h2 style={{ fontSize: 20, marginTop: 28 }}>Çerezler</h2>
        <p>Sitemiz temel işlevsellik ve analiz amacıyla çerezler kullanabilir. Tarayıcı ayarlarınızdan çerezleri devre dışı bırakabilirsiniz.</p>

        <h2 style={{ fontSize: 20, marginTop: 28 }}>Üçüncü Taraf Hizmetler</h2>
        <p>Web sitemiz şu üçüncü taraf hizmetleri kullanır: barındırma için Vercel, veri depolama için Supabase ve görüntü oluşturma için Replicate. Bu hizmetlerin her birinin kendi gizlilik politikaları vardır.</p>

        <h2 style={{ fontSize: 20, marginTop: 28 }}>Veri Silme</h2>
        <p>Verilerinizin silinmesini talep etmek için lütfen veri silme sayfamızı ziyaret edin veya bizimle iletişime geçin.</p>

        <h2 style={{ fontSize: 20, marginTop: 28 }}>İletişim</h2>
        <p>Gizlilik ile ilgili sorularınız için lütfen bizimle iletişime geçin: <strong>info@dailymenuforall.com</strong></p>

        <h2 style={{ fontSize: 20, marginTop: 28 }}>Değişiklikler</h2>
        <p>Bu gizlilik politikasını zaman zaman güncelleyebiliriz. Değişiklikler bu sayfada yayınlanacaktır.</p>
      </main>
    );
  }

  return (
    <main style={{ maxWidth: 720, margin: "0 auto", padding: "40px 20px", fontFamily: "sans-serif", lineHeight: 1.8, color: "#2c1810" }}>
      <h1 style={{ fontSize: 28, marginBottom: 24 }}>Privacy Policy</h1>
      <p><strong>Last updated:</strong> March 2, 2026</p>

      <h2 style={{ fontSize: 20, marginTop: 28 }}>About Us</h2>
      <p>Daily Menu (dailymenuforall.com / dailyhalalmenu.com) is a website that provides AI-generated daily halal menus. We respect your privacy and are committed to protecting your personal data.</p>

      <h2 style={{ fontSize: 20, marginTop: 28 }}>Information We Collect</h2>
      <p>Our website collects minimal data. We do not require any user accounts, logins, or registration. The information we may collect includes:</p>
      <p>• <strong>Usage data:</strong> Page views and general traffic statistics (via cookies or analytics tools)</p>
      <p>• <strong>Device information:</strong> Browser type, operating system (standard web server logs)</p>
      <p>We do not directly collect your name, email address, or any personal information.</p>

      <h2 style={{ fontSize: 20, marginTop: 28 }}>Social Media</h2>
      <p>We operate Facebook and Instagram pages to share our daily menus. When you interact with us on these platforms, the respective platform&apos;s privacy policy applies.</p>

      <h2 style={{ fontSize: 20, marginTop: 28 }}>Cookies</h2>
      <p>Our site may use cookies for basic functionality and analytics purposes. You can disable cookies through your browser settings.</p>

      <h2 style={{ fontSize: 20, marginTop: 28 }}>Third-Party Services</h2>
      <p>Our website uses the following third-party services: Vercel for hosting, Supabase for data storage, and Replicate for image generation. Each of these services has their own privacy policies.</p>

      <h2 style={{ fontSize: 20, marginTop: 28 }}>Data Deletion</h2>
      <p>To request deletion of your data, please visit our data deletion page or contact us directly.</p>

      <h2 style={{ fontSize: 20, marginTop: 28 }}>Contact</h2>
      <p>For privacy-related questions, please contact us at: <strong>info@dailymenuforall.com</strong></p>

      <h2 style={{ fontSize: 20, marginTop: 28 }}>Changes</h2>
      <p>We may update this privacy policy from time to time. Changes will be posted on this page.</p>
    </main>
  );
}
