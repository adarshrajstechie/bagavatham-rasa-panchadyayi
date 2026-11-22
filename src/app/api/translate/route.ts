import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { text, target, source = "ml" } = await req.json();

    if (!text || !target) {
      return NextResponse.json({ error: "Missing text or target language" }, { status: 400 });
    }

    if (target === source) {
      return NextResponse.json({ translatedText: text });
    }

    // We chunk the text so we don't hit Google's URL length limits
    const paragraphs = text.split(/\n{2,}/);
    const translatedParagraphs: string[] = [];

    for (const para of paragraphs) {
      if (!para.trim()) {
        translatedParagraphs.push(para);
        continue;
      }

      // Chunk very long paragraphs
      const chunks: string[] = [];
      for (let i = 0; i < para.length; i += 4000) {
        chunks.push(para.slice(i, i + 4000));
      }

      const chunkTranslations: string[] = [];
      for (const chunk of chunks) {
        try {
          const url =
            "https://translate.googleapis.com/translate_a/single" +
            `?client=gtx&sl=${source}&tl=${target}&dt=t&q=` +
            encodeURIComponent(chunk);
          
          const res = await fetch(url);
          if (!res.ok) throw new Error("Google API error");
          
          const data = await res.json();
          const joined = (data[0] as unknown[])
            .map((seg) => (Array.isArray(seg) ? (seg[0] as string) : ""))
            .join("");
          
          chunkTranslations.push(joined);
        } catch (e) {
          // Fallback to original chunk if this specific piece fails
          chunkTranslations.push(chunk);
        }
      }
      translatedParagraphs.push(chunkTranslations.join(""));
    }

    return NextResponse.json({ translatedText: translatedParagraphs.join("\n\n") });
  } catch (error) {
    return NextResponse.json({ error: "Translation failed" }, { status: 500 });
  }
}