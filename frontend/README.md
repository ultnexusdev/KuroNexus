This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Dağıtım — bilinmesi gereken tuzak

`main`'e push, Coolify'ın **resmî GitHub App**'i üzerinden dağıtımı tetikler.

15 Ağustos 2026'ya kadar depoda bir de **elle eklenmiş webhook** duruyordu (GitHub
App'e geçmeden önceki kurulumdan kalma). İkisi birden tetiklendiği için her push
**aynı servisin iki eşzamanlı build'ini** açıyordu. 4 GB'lık sunucu bunu kaldırmıyor:
13-14 ve 15 Ağustos'ta site, API, SSH ve Coolify panelinin kendisi aynı anda
erişilemez oldu. İmza, tek başına teşhis ettiriyor — TCP el sıkışması tamamlanıyor
ama SSH banner'ı gelmiyor, HTTP zaman aşımına düşüyor, `free -m` swap'i %100 gösteriyor.

Ölçüldüğü hâliyle: normalde ~5 dakika süren frontend build'i, iki kopya RAM için
boğuştuğu için **23 dakika** sürüyordu.

**Dağıtım yine ikizlenmeye başlarsa** ilk bakılacak yer depo → Settings → Webhooks.
Orada elle eklenmiş bir kayıt olmamalı; Coolify'ın kendi ekranı da bunu söylüyor
("You are using an official Git App. You do not need manual webhooks.").

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
