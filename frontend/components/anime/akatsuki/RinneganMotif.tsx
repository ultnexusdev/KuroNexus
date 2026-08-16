/**
 * Rinnegan motifi — eşmerkezli halkalar, kod içinde çizilen vektör.
 *
 * Fotoğrafın üstüne göz konumlamak kırılgan olurdu (portre kadrajı veriye
 * bağlı); motif bunun yerine hero'nun malzeme katmanında duruyor — göz
 * değil, gözün geometrisi. Renk token'dan (kural 16); nabız animasyonu
 * kullanan tarafta ve `prefers-reduced-motion`'da tamamen kapalı.
 */
export function RinneganMotif({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 200 200"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
      focusable="false"
    >
      {[88, 70, 52, 34, 16].map((radius) => (
        <circle
          key={radius}
          cx="100"
          cy="100"
          r={radius}
          fill="none"
          stroke="var(--accent)"
          strokeWidth="1"
        />
      ))}
      <circle cx="100" cy="100" r="4" fill="var(--accent)" />
    </svg>
  );
}
