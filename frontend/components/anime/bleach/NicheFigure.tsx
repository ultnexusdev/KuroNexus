/**
 * NİŞTEKİ SİLÜET.
 *
 * Brief: "niş içinde sadece bir SİLÜET, %8 opaklıkta. İsim yok. Kim olduğu
 * belli değil. Bu kasıtlı — Bankai bir sırdır."
 *
 * ── NEDEN ON AYNI FİGÜR DEĞİL ────────────────────────────────────────────
 * Kimlik gizli olmalı ama koridor cansız olmamalı. On özdeş siluet duvar
 * kâğıdı gibi okunurdu; on farklı figür ise kimliği ele verirdi. Ortası:
 * aynı gövde şeması, `pose` ile değişen **duruş** — pelerin açıklığı, omuz
 * eğimi, kolun yeri. Uzaktan hepsi "bir figür", yakından hiçbiri diğerinin
 * kopyası değil.
 *
 * Poz deterministik olarak indeksten türetiliyor: sunucu ve istemci aynı
 * şeyi çiziyor, hidrasyon uyuşmazlığı yok.
 */
export function NicheFigure({ pose }: { pose: number }) {
  /* Üç eksende küçük sapmalar — hepsi indeksten, rastgelelik yok */
  const lean = ((pose * 7) % 5) - 2; // -2..2 derece
  const cloak = 14 + ((pose * 11) % 5) * 3; // pelerin açıklığı
  const arm = ((pose * 5) % 3) - 1; // -1..1 kol yönü
  const height = 96 + ((pose * 13) % 4) * 5; // omuz yüksekliği

  return (
    <svg viewBox="0 0 120 220" aria-hidden="true">
      <g transform={`rotate(${lean} 60 220)`} fill="currentColor">
        {/* Pelerin: gövdeyi saran, aşağı doğru açılan tek parça */}
        <path
          d={`M60 ${220 - height}
              c-6 0-11 4-12 10
              L${60 - cloak - 10} 200
              q${cloak / 2} 8 ${cloak + 10} 8
              q${cloak / 2 + 10} 0 ${cloak + 10} -8
              L${60 + cloak + 10 - (cloak + 10)} 200
              Z`}
          opacity="0.55"
        />
        <path
          d={`M60 ${220 - height}
              c8 0 13 5 14 12
              L${60 + cloak + 12} 200
              L${60 - cloak - 12} 200
              L${46} ${220 - height + 12}
              Z`}
        />
        {/* Baş: yüz yok, yalnızca hacim */}
        <ellipse cx="60" cy={220 - height - 12} rx="11" ry="13" />
        {/* Omuz hattı */}
        <path
          d={`M${60 - 22} ${220 - height + 6} q22 -10 44 0 l-4 10 q-18 -8 -36 0 Z`}
        />
        {/* Kol: duruşa göre yana ya da gövdeye yakın */}
        <path
          d={`M${60 + arm * 20} ${220 - height + 16}
              q${arm * 12} 30 ${arm * 6} 56
              l-8 -2
              q${-arm * 4} -26 ${-arm * 10} -52 Z`}
          opacity="0.8"
        />
      </g>
    </svg>
  );
}
