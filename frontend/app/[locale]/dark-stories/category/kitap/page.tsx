import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { fetchCategories } from "@/lib/api/universes";
import { getBookArchive } from "@/lib/api/books";
import { hallLabel, hallName, hallNumber } from "@/lib/halls";
import { BookLobby, type LobbyQuote } from "@/components/book/BookLobby";

/**
 * Salon 05 · Kitap — salon girişi.
 *
 * Statik yol olduğu için `[categorySlug]` dinamik sayfasından ÖNCE eşleşir:
 * kanat, veritabanında bir `UniverseCategory` kaydı olmasa da açılır. Kayıt
 * sonradan panelden oluşturulursa salon adı ve numarası oradan okunmaya
 * başlar; bu sayfa yine bu dosya kalır (film/dizi salonlarındaki desenin
 * aynısı).
 *
 * Bu dosya yalnızca veriyi toplar; çizim `BookLobby`de.
 *
 * **Neden yeni bir uç eklenmedi:** giriş, arşivin kendi listesini (`GET
 * /books`) okuyor — canlıda zaten var, salonun arşiv bölümü de aynı yanıtı
 * kullanıyor, yani ikinci bir sorgu değil aynı sorgunun ikinci tüketicisi.
 * Yanıttan burada yalnızca üç şey süzülüyor: elimdeki kitap, son eklenen
 * dört cilt, günün alıntısı.
 */

const SLUG = "kitap";

/** Raftaki cilt sayısı — referans kadrajı dört kapak gösteriyor. */
const SHELF_SIZE = 4;

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "book" });
  return { title: t("hallName") };
}

/** Salon numarası ve adı tek kaynaktan: kategori kaydı (yoksa kod adı). */
async function getHall(
  fallbackName: string,
): Promise<{ label: string; name: string }> {
  try {
    const categories = await fetchCategories();
    return {
      label: hallLabel(hallNumber(categories, SLUG)),
      name: hallName(categories, SLUG, fallbackName),
    };
  } catch {
    // Kategori listesi alınamazsa başlık numarasız görünür, sayfa çökmez
    return { label: "", name: fallbackName };
  }
}

export default async function BookLobbyPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "book" });
  const [archive, hall] = await Promise.all([
    getBookArchive(),
    getHall(t("hallName")),
  ]);

  /**
   * Elimdeki kitap. Birden fazla "okuyorum" varsa en son başlanan kürsüye
   * çıkar; tarihi olmayan kayıt sona düşer (uydurma sıra üretilmesin).
   */
  const reading =
    archive.books
      .filter((book) => book.status === "READING")
      .sort(
        (a, b) =>
          (b.startedAt ? Date.parse(b.startedAt) : 0) -
          (a.startedAt ? Date.parse(a.startedAt) : 0),
      )[0] ?? null;

  /**
   * Raf: son eklenenler. Kürsüdeki kitap ayıklanıyor — aynı kapak iki kez
   * yan yana durursa raf "yeni" değil "tekrar" gibi okunuyor.
   */
  const recent = archive.recent
    .filter((book) => book.id !== reading?.id)
    .slice(0, SHELF_SIZE);

  /**
   * Alıntı. Arşivde işaretli alıntı varsa o, yoksa salonun epigrafı —
   * masanın alt yarısı hiçbir zaman boş kalmıyor.
   *
   * ARŞİVE ULAŞILAMADIYSA masa hiç kurulmuyor (`null`): "şu an elimde açık
   * kitap yok" cümlesi o durumda YANLIŞ olurdu — bilmiyoruz, okuyamadık.
   * Salon o dalda eski hâline, tek ortalanmış dizine dönüyor (kural 4).
   */
  const quote: LobbyQuote | null = archive.unavailable
    ? null
    : archive.quoteOfTheDay
      ? {
          text: archive.quoteOfTheDay.text,
          bookTitle: archive.quoteOfTheDay.bookTitle,
          bookSlug: archive.quoteOfTheDay.bookSlug,
        }
      : { text: t("epigraph"), bookTitle: null, bookSlug: null };

  return (
    <BookLobby
      hallLabel={hall.label}
      hallName={hall.name}
      reading={reading}
      recent={recent}
      quote={quote}
    />
  );
}
