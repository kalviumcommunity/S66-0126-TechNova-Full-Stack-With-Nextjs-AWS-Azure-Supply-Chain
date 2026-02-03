import { Key, ReactElement, JSXElementConstructor, ReactNode, ReactPortal } from "react";

export const revalidate = 60;

async function getNewsData() {
  const res = await fetch(
    "https://api.spaceflightnewsapi.net/v4/articles/?limit=6"
  );

  if (!res.ok) {
    throw new Error("Failed to fetch news");
  }

  return res.json();
}

export default async function NewsPage() {
  console.log("News page generated / revalidated");

  const data = await getNewsData();
  const newsList = data.results;

  return (
    <main style={{ padding: "24px", fontFamily: "sans-serif" }}>
      <h1 style={{ marginBottom: "16px" }}>📰 Latest News</h1>

      <div style={{ display: "grid", gap: "16px" }}>
        {newsList.map((news: { id: Key | null | undefined; title: string | number | bigint | boolean | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | Promise<string | number | bigint | boolean | ReactPortal | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | null | undefined> | null | undefined; summary: string | any[]; url: string | undefined; }) => (
          <article
            key={news.id}
            style={{
              border: "1px solid #e5e7eb",
              borderRadius: "10px",
              padding: "16px",
            }}
          >
            <h3 style={{ marginBottom: "8px" }}>{news.title}</h3>

            <p style={{ fontSize: "14px", color: "#555" }}>
              {news.summary.slice(0, 120)}...
            </p>

            <a
              href={news.url}
              target="_blank"
              style={{
                display: "inline-block",
                marginTop: "10px",
                color: "#2563eb",
                fontSize: "14px",
              }}
            >
              Read more →
            </a>
          </article>
        ))}
      </div>

      <small style={{ display: "block", marginTop: "20px", color: "#777" }}>
        Revalidates every 60 seconds
      </small>
    </main>
  );
}
