"use client";

import { useEffect, useMemo, useRef, useState } from "react";

type Language = { code: string; name: string; native: string };

const languages: Language[] = [
  { code: "ml", name: "Malayalam", native: "മലയാളം" },
  { code: "en", name: "English", native: "English" },
  { code: "hi", name: "Hindi", native: "हिन्दी" },
  { code: "ta", name: "Tamil", native: "தமிழ்" },
  { code: "te", name: "Telugu", native: "తెలుగు" },
  { code: "kn", name: "Kannada", native: "ಕನ್ನಡ" },
  { code: "mr", name: "Marathi", native: "मराठी" },
  { code: "bn", name: "Bengali", native: "বাংলা" },
  { code: "gu", name: "Gujarati", native: "ગુજરાતી" },
  { code: "pa", name: "Punjabi", native: "ਪੰਜਾਬੀ" },
  { code: "or", name: "Odia", native: "ଓଡ଼ିଆ" },
  { code: "as", name: "Assamese", native: "অসমীয়া" },
  { code: "ur", name: "Urdu", native: "اردو" },
  { code: "sa", name: "Sanskrit", native: "संस्कृतम्" },
  { code: "ne", name: "Nepali", native: "नेपाली" },
];

/**
 * Calls our own backend API route to translate the text.
 * This bypasses Google's CORS restrictions.
 */
async function translateText(
  text: string,
  target: string,
  source = "ml"
): Promise<string> {
  if (target === source || !text.trim()) return text;

  const response = await fetch("/api/translate", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text, target, source }),
  });

  if (!response.ok) {
    throw new Error("Translation failed");
  }

  const data = await response.json();
  return data.translatedText;
}

export default function Reader({ manuscript }: { manuscript: string }) {
  const [selected, setSelected] = useState("ml");
  const [fontScale, setFontScale] = useState(1);
  const [showSettings, setShowSettings] = useState(false);
  const [copied, setCopied] = useState(false);

  // Translation state
  const [translatedManuscript, setTranslatedManuscript] = useState<string | null>(null);
  const [isTranslating, setIsTranslating] = useState(false);
  const [translateError, setTranslateError] = useState<string | null>(null);

  // Cache translations so switching back and forth is instant
  const cache = useRef<Map<string, string>>(new Map());

  const wordCount = useMemo(
    () => manuscript.trim().split(/\s+/u).length,
    [manuscript]
  );

  // The text actually rendered in the manuscript area
  const displayText = selected === "ml" ? manuscript : translatedManuscript ?? manuscript;

  // Whenever the language changes, fetch/cache the translation
  useEffect(() => {
    if (selected === "ml") {
      setTranslatedManuscript(null);
      setTranslateError(null);
      setIsTranslating(false);
      return;
    }

    const cached = cache.current.get(selected);
    if (cached) {
      setTranslatedManuscript(cached);
      setTranslateError(null);
      setIsTranslating(false);
      return;
    }

    let cancelled = false;
    setIsTranslating(true);
    setTranslateError(null);

    translateText(manuscript, selected, "ml")
      .then((result) => {
        if (cancelled) return;
        cache.current.set(selected, result);
        setTranslatedManuscript(result);
      })
      .catch(() => {
        if (cancelled) return;
        setTranslateError("Translation failed. Showing original Malayalam.");
        setTranslatedManuscript(manuscript);
      })
      .finally(() => {
        if (!cancelled) setIsTranslating(false);
      });

    return () => {
      cancelled = true;
    };
  }, [selected, manuscript]);

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      setCopied(false);
    }
  }

  return (
    <main className="site-shell">
      <div className="ambient ambient-one" aria-hidden="true" />
      <div className="ambient ambient-two" aria-hidden="true" />

      <header className="topbar">
        <a className="brand" href="#top" aria-label="Rasa Panchadyayi home">
          <span className="brand-mark" aria-hidden="true">ॐ</span>
          <span className="brand-copy">
            <strong>RASA PANCHADYAYI</strong>
            <small>THE DIVINE VERSE · THE ETERNAL LOVE</small>
          </span>
        </a>
        <nav className="top-actions" aria-label="Page actions">
          <a className="nav-link" href="#about">About the text</a>
          <button
            className="icon-button"
            onClick={() => setShowSettings((v) => !v)}
            aria-label="Reading settings"
            aria-expanded={showSettings}
          >
            <span aria-hidden="true">Aa</span>
          </button>
        </nav>
      </header>

      <section className="hero" id="top">
        <div className="hero-kicker"><span /> THE HEART OF ŚRĪMAD BHĀGAVATAM <span /></div>
        <div className="hero-symbol" aria-hidden="true">❋</div>
        <h1>Rasa Panchadyayi</h1>
        <p className="hero-description">
          Experience the supreme secret of devotion and love through the divine pastimes of Lord Sri Krishna.
        </p>
        <div className="hero-meta">
          <span><i /> Canto 10</span>
          <span><i /> Chapters 29—33</span>
          <span><i /> Malayalam Commentary</span>
        </div>
      </section>

      <section className="reader-toolbar" aria-label="Reader controls">
        <div className="reader-label">
          <span className="eyebrow">YOUR READING SPACE</span>
          <strong>Read in your language</strong>
        </div>
        <div className="toolbar-actions">
          <label className="language-select-wrap">
            <span className="sr-only">Choose translation language</span>
            <span className="globe" aria-hidden="true">◎</span>
            <select
              value={selected}
              onChange={(e) => setSelected(e.target.value)}
              aria-label="Translation language"
            >
              {languages.map((language) => (
                <option value={language.code} key={language.code}>
                  {language.native} · {language.name}
                </option>
              ))}
            </select>
            <span className="select-chevron" aria-hidden="true">⌄</span>
          </label>
          <button className="share-button" onClick={copyLink} aria-label="Copy page link">
            <span aria-hidden="true">↗</span> {copied ? "Copied" : "Share"}
          </button>
        </div>
      </section>

      {showSettings && (
        <section className="settings-panel" aria-label="Reading settings">
          <div>
            <strong>Text size</strong>
            <span>Adjust for comfortable reading</span>
          </div>
          <div className="font-controls">
            <button
              onClick={() => setFontScale((v) => Math.max(0.85, +(v - 0.05).toFixed(2)))}
              aria-label="Decrease text size"
            >A−</button>
            <span>{Math.round(fontScale * 100)}%</span>
            <button
              onClick={() => setFontScale((v) => Math.min(1.35, +(v + 0.05).toFixed(2)))}
              aria-label="Increase text size"
            >A+</button>
          </div>
        </section>
      )}

      <section className="reading-layout">
        <aside className="chapter-aside">
          <div className="aside-sticky">
            <span className="eyebrow">IN THIS EDITION</span>
            <div className="chapter-range">29<span>—</span>33</div>
            <p>Canto 10<br />Rasa Panchadyayi</p>
            <div className="aside-rule" />
            <div className="reading-stat">
              <span>WORDS</span>
              <strong>{wordCount.toLocaleString("en-IN")}</strong>
            </div>
            <div className="reading-stat">
              <span>LANGUAGES</span>
              <strong>{languages.length}</strong>
            </div>
            <a href="#manuscript" className="continue-link">Begin reading <span>↓</span></a>
          </div>
        </aside>

        <article className="manuscript-card" id="manuscript">
          <div className="manuscript-heading">
            <div>
              <span className="eyebrow">THE SACRED NARRATIVE</span>
              <h2>Sara Sangraham</h2>
              <p>Srimad Bhagavatam · Canto 10</p>
            </div>
            <div className="chapter-seal" aria-label="Chapter 29 to 33">X<br /><small>29–33</small></div>
          </div>
          <div className="ornament-divider"><span>✧</span></div>

          {isTranslating && (
            <p
              role="status"
              style={{
                fontSize: 12,
                color: "#9b7b4c",
                textAlign: "center",
                margin: "8px 0 16px",
                letterSpacing: ".05em",
              }}
            >
              Translating…
            </p>
          )}
          {translateError && (
            <p
              role="alert"
              style={{
                fontSize: 12,
                color: "#b04040",
                textAlign: "center",
                margin: "8px 0 16px",
              }}
            >
              {translateError}
            </p>
          )}

          <div
            className="manuscript-content"
            style={{ "--reader-scale": fontScale } as React.CSSProperties}
          >
            <pre>{displayText}</pre>
          </div>
          <footer className="manuscript-footer">
            <span>✧</span>
            <p>Sri Krishnarpanamastu</p>
            <span>✧</span>
          </footer>
        </article>
      </section>

      <section className="about-section" id="about">
        <span className="eyebrow">A NOTE ON THIS READING</span>
        <h2>The essence of divine love.</h2>
        <p>
          This reading includes the five chapters known as the Rasa Panchadyayi 
          (Canto 10, Chapters 29–33) from the Srimad Bhagavatam. The original Malayalam 
          text provided here has been preserved in its entirety.
        </p>
        <p className="translation-note">
          Translation support is provided through Google Translate. Translated wording is
          machine-generated and may not preserve every theological nuance. Select മലയാളം
          to return to the original text.
        </p>
      </section>

      <footer className="site-footer">
        <a className="footer-brand" href="#top">ॐ <span>RASA PANCHADYAYI</span></a>
        <span>Made for quiet reading & contemplation</span>
        <a href="#top" className="back-top">Back to top ↑</a>
      </footer>
    </main>
  );
}