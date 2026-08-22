import type { Metadata } from "next";

/**
 * Yönetim ağacının tek işi metadata olan geçiş layout'u (2026-08-22 denetimi).
 *
 * `robots.txt` /admin'i tarama dışı bırakıyor ama bu DIZINLEME garantisi
 * değil: dışarıdan bağlantı alan bir admin adresi Google'da "içeriği
 * alınamadı" kartıyla yine listelenebiliyor. Bu başlık sayfanın kendisine
 * "dizine girme" dedirtiyor — iki katman birbirini tamamlıyor.
 *
 * UI'a kasıtlı olarak DOKUNMUYOR: children olduğu gibi geçer.
 */
export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return children;
}
