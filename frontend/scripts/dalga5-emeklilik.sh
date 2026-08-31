#!/usr/bin/env bash
# Dalga 5 · eski bilesen setlerini emekliye ayir.
#
# Kullanici sarti: "Mevcut component'lari silme, yeni component seti yaz ve
# route'u yenisine bagla; eski dosyalari .deprecated/ altina tasi."
#
# NEDEN .deprecated KLASORU components/character/ ICINDE
# ------------------------------------------------------
# Denetim betikleri (sinif/hex/kontrast) `readdirSync(BASE)` ile klasorleri
# geziyor ve her klasorde DOGRUDAN duran tek .module.css'i tariyor.
# `.deprecated/` bir klasor ama icinde dogrudan .module.css YOK (hepsi
# alt klasorlerde), dolayisiyla betikler onu atliyor. Ayrica ayrisma
# betigi noktayla baslayan klasorleri acikca eliyor.
#
# Bu KRITIK: eski modul yerinde birakilsaydi ayni `data-world` icin IKI
# palet blogu olur, kontrast denetimi ikisini de olcer ve aralarindaki
# uzaklik 0 cikardigi icin "accent COK YAKIN" hatasi verirdi.
#
# NEDEN VERI DOSYASI DA TASINIYOR
# --------------------------------
# Eski bilesenler `@/lib/characters/<slug>-experience` import ediyor ve o
# ad YENI veri dosyasina birakiliyor. Veri dosyasi da tasinmazsa eski
# bilesen yeni veriyi gorur ve tsc patlar. Tasindiktan sonra eski
# bilesenin tek import satiri goreli yola cevriliyor.
set -euo pipefail

FE="K:/KURONEXUS/frontend"
DEP="$FE/components/character/.deprecated"
cd "$FE"

mkdir -p "$DEP"

for slug in megumi-fushiguro nobara-kugisaki kento-nanami suguru-getou; do
  src="components/character/$slug"
  dst="$DEP/$slug"

  if [ ! -d "$src" ]; then
    echo "atlandi (klasor yok): $slug"
    continue
  fi
  if [ -d "$dst" ]; then
    echo "atlandi (zaten emekli): $slug"
    continue
  fi

  git mv "$src" "$dst"

  # Veri dosyasini bilesenin YANINA tasi ve adini sadelestir
  veri="lib/characters/$slug-experience.ts"
  if [ -f "$veri" ]; then
    git mv "$veri" "$dst/data.ts"
    # Tasinan bilesenlerdeki mutlak import'u goreli yola cevir
    for f in "$dst"/*.tsx; do
      [ -f "$f" ] || continue
      sed -i "s#@/lib/characters/$slug-experience#./data#g" "$f"
    done
  fi

  echo "emekli edildi: $slug  ->  components/character/.deprecated/$slug/"
done

echo
echo "--- dogrulama ---"
ls "$DEP"
echo
echo "Denetim betikleri .deprecated'i atlamali:"
node scripts/check-karakter-sinif.mjs || true
