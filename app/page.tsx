"use client";

import { FormEvent, useState } from "react";

type DownloadResponse = {
  success?: boolean;
  jobId?: string;
  error?: string;
};

const blogPosts = [
  {
    title: "How to Download Instagram Reels",
    description: "Learn the easiest and safest ways to save eligible public Instagram Reels on phone and desktop.",
    href: "https://ai-tools-three-rho.vercel.app/blog/how-to-download-instagram-reels",
  },
  {
    title: "How to Save Instagram Videos on iPhone",
    description: "A step-by-step guide for iPhone users who want to save Instagram videos and Reels responsibly.",
    href: "https://ai-tools-three-rho.vercel.app/blog/how-to-save-instagram-videos-on-iphone",
  },
  {
    title: "How to Save Instagram Videos on Android",
    description: "Simple instructions for Android users who want to save eligible Instagram content and manage files.",
    href: "https://ai-tools-three-rho.vercel.app/blog/how-to-save-instagram-videos-on-android",
  },
];

const faqItems = [
  {
    question: "Can I download any Instagram Reel?",
    answer: "No. Only public Instagram content that you own or have permission to save should be downloaded or reused.",
  },
  {
    question: "What does 'permission to save' mean?",
    answer: "It means the content is public, you own it, or you have explicit permission from the creator or rights holder to store it.",
  },
  {
    question: "Is this tool for personal use only?",
    answer: "Yes. Use it only for personal, lawful, and authorized saving of content that you are allowed to keep.",
  },
];

function isInstagramReel(url: string) {
  try {
    const parsed = new URL(url);
    const hostname = parsed.hostname.replace(/^www\./, "").toLowerCase();
    return (hostname === "instagram.com" || hostname === "instagr.am") && /^\/(reel|reels)\//.test(parsed.pathname);
  } catch {
    return false;
  }
}

export default function Home() {
  const [url, setUrl] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  async function pasteLink() {
    try {
      const text = await navigator.clipboard.readText();
      setUrl(text);
      setMessage("");
    } catch {
      setMessage("Clipboard access was blocked. Please paste the link manually.");
    }
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const reelUrl = url.trim();

    if (!isInstagramReel(reelUrl)) {
      setMessage("Please paste a valid public Instagram Reel link.");
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      const response = await fetch("/api/download", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: reelUrl }),
      });
      const data = (await response.json()) as DownloadResponse;

      if (!response.ok || !data.success || !data.jobId) {
        throw new Error(data.error || "We could not process this Reel right now.");
      }

      window.location.assign(`/api/download-file/${encodeURIComponent(data.jobId)}`);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main>
      <nav className="nav" aria-label="Main navigation">
        <a className="brand" href="#top" aria-label="ReelSave home">
          <span className="brand-mark">R</span><span>reelsave</span>
        </a>
        <div className="nav-links">
          <a className="help-link" href="#how-it-works">How it works</a>
          <a className="help-link" href="#blog">Blog</a>
          <a className="help-link" href="#faq">FAQ</a>
        </div>
      </nav>

      <section className="hero" id="top">
        <div className="orb orb-one" /><div className="orb orb-two" />
        <div className="hero-content">
          <p className="eyebrow">FAST · SIMPLE · FREE</p>
          <h1>Save the Reels<br /><em>you love.</em></h1>
          <p className="intro">Paste a public Instagram Reel link and download public content you own or have permission to save.</p>

          <form className="downloader" onSubmit={handleSubmit}>
            <label htmlFor="reel-url">Instagram Reel link</label>
            <div className="input-row">
              <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r=".8" fill="currentColor"/></svg>
              <input id="reel-url" type="url" value={url} onChange={(event) => { setUrl(event.target.value); setMessage(""); }} placeholder="https://www.instagram.com/reel/..." autoComplete="url" />
              <button className="paste" type="button" onClick={pasteLink}>Paste</button>
            </div>
            <button className="download" type="submit" disabled={loading}>
              {loading ? "Preparing your download…" : "Download Reel"}
              {!loading && <span aria-hidden="true">↓</span>}
            </button>
            {message && <p className="message" role="status">{message}</p>}
          </form>
          <p className="notice">By downloading, you confirm that the content is public and that you own it or have permission to save it.</p>
        </div>
      </section>

      <section className="steps" id="how-it-works">
        <p className="eyebrow dark">HOW IT WORKS</p>
        <h2>Three clicks. That’s it.</h2>
        <div className="step-grid">
          <article><span>01</span><h3>Copy the link</h3><p>Open a public Reel in Instagram and copy its link.</p></article>
          <article><span>02</span><h3>Paste it here</h3><p>Drop the Reel link in the box above.</p></article>
          <article><span>03</span><h3>Save your Reel</h3><p>We’ll prepare your file for download using your authorized content.</p></article>
        </div>
      </section>

      <section className="blog-section" id="blog">
        <div className="section-header">
          <p className="eyebrow dark">BLOG</p>
          <h2>Instagram download guides</h2>
        </div>
        <div className="blog-grid">
          {blogPosts.map((post) => (
            <article key={post.title} className="blog-card">
              <span className="blog-tag">Instagram guide</span>
              <h3>{post.title}</h3>
              <p>{post.description}</p>
              <a href={post.href} target="_blank" rel="noreferrer">Read guide →</a>
            </article>
          ))}
        </div>
      </section>

      <section className="faq-section" id="faq">
        <div className="section-header">
          <p className="eyebrow dark">FAQ</p>
          <h2>Common questions</h2>
        </div>
        <div className="faq-list">
          {faqItems.map((item) => (
            <div key={item.question} className="faq-item">
              <h3>{item.question}</h3>
              <p>{item.answer}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="legal-section">
        <div className="section-header">
          <p className="eyebrow dark">TERMS</p>
          <h2>Permissions & conditions</h2>
        </div>
        <div className="legal-box">
          <p>ReelSave is designed for public content and for media you own or are authorized to save. You must not use this service to download or redistribute someone else’s private, copyrighted, or restricted content without permission.</p>
          <p>By using this tool, you confirm that you have the legal right to save the content, and you agree to use downloaded files only for lawful personal, educational, or authorized purposes.</p>
          <p>We do not host or claim ownership of Instagram content. This service simply helps you process a valid public Reel link that you are permitted to save.</p>
        </div>
      </section>

      <footer><span>© 2026 ReelSave</span><span>Public content only when you own it or have permission to save it.</span></footer>
    </main>
  );
}
