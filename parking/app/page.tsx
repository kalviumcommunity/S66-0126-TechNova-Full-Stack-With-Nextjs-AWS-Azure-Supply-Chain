import Link from "next/link";
import Image from "next/image";

export default function Home() {
  return (
    <div
      style={{
        display: "flex",
        minHeight: "100vh",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "Arial, sans-serif",
        backgroundColor: "#f4f4f4",
        padding: "20px",
      }}
    >
      <main
        style={{
          maxWidth: "600px",
          width: "100%",
          backgroundColor: "#fff",
          padding: "30px",
          borderRadius: "10px",
          textAlign: "center",
          boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
        }}
      >
        <Image
          src="/next.svg"
          alt="Next.js Logo"
          width={100}
          height={30}
          style={{ marginBottom: "20px" }}
        />

        <h1 style={{ fontSize: "24px", marginBottom: "10px" }}>
          Welcome to My Next.js App
        </h1>

        <p style={{ color: "#555", marginBottom: "20px" }}>
          This is a simple landing page. Use the links below to explore
          different pages demonstrating Static, Dynamic, and Hybrid Rendering.
        </p>

        {/* Links to pages */}
        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          <Link
            href="/about"
            style={{
              textDecoration: "none",
              padding: "10px",
              borderRadius: "5px",
              backgroundColor: "#0070f3",
              color: "white",
            }}
          >
            About (SSG)
          </Link>

          <Link
            href="/dashboard"
            style={{
              textDecoration: "none",
              padding: "10px",
              borderRadius: "5px",
              backgroundColor: "#21ba45",
              color: "white",
            }}
          >
            Dashboard (SSR)
          </Link>

          <Link
            href="/news"
            style={{
              textDecoration: "none",
              padding: "10px",
              borderRadius: "5px",
              backgroundColor: "#f5a623",
              color: "white",
            }}
          >
            News (ISR)
          </Link>
        </div>
      </main>
    </div>
  );
}
