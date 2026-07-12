import { PrismaClient } from './src/generated/prisma';
const prisma = new PrismaClient();

async function main() {
  const cats = await prisma.universeCategory.findMany();
  console.log("Categories:", cats);
  
  const kadimCat = cats.find(c => c.slug === 'kadim-duniyalar' || c.name === 'Kadim Dünyalar' || c.name.toLowerCase().includes('kadim'));
  
  if (kadimCat) {
    console.log("Found Kadim Dünyalar category:", kadimCat.id);
    const updated = await prisma.wikiUniverse.updateMany({
      where: {
        slug: {
          in: ['zaman-carki', 'temurkan-efsaneleri', 'dune', 'firtinaisigi-arsivi', 'kral-katili-guncesi', 'malazan-yitikler', 'yuzuklerin-efendisi', 'buz-ve-atesin-sarkisi']
        }
      },
      data: {
        categoryId: kadimCat.id
      }
    });
    console.log(`Updated ${updated.count} universes to Kadim Dünyalar.`);
  } else {
    console.log("Could not find Kadim Dünyalar category.");
  }
}

main()
  .catch(e => console.error(e))
  .finally(() => prisma.$disconnect());
