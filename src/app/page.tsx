import { readFile } from "node:fs/promises";
import path from "node:path";
import Reader from "@/components/Reader";

export default async function Home() {
  const sourcePath = path.join(process.cwd(), "src/content/rasa-panchadyayi.txt");
  const manuscript = await readFile(sourcePath, "utf8");

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: "രാസപഞ്ചാധ്യായി — ശ്രീമദ് ഭാഗവതം",
    description:
      "ശ്രീമദ് ഭാഗവതത്തിലെ ദശമസ്കന്ധം 29 മുതൽ 33 വരെയുള്ള അധ്യായങ്ങളെ ആസ്പദമാക്കിയുള്ള മലയാള വ്യാഖ്യാനം.",
    inLanguage: "ml",
    isAccessibleForFree: true,
    articleSection: "ശ്രീമദ് ഭാഗവതം — ദശമസ്കന്ധം",
    author: { "@type": "Organization", name: "Rasa Panchadyayi Reader" },
    publisher: { "@type": "Organization", name: "Rasa Panchadyayi Reader" }
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }}
      />
      <Reader manuscript={manuscript} />
    </>
  );
}
