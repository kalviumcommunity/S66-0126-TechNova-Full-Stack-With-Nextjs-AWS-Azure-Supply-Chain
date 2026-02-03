export const dynamic = "force-dynamic"; // Forces SSR

async function getDashboardData() {
  const res = await fetch(
    "https://jsonplaceholder.typicode.com/users/1",
    { cache: "no-store" } // Fetch fresh data every request
  );

  if (!res.ok) {
    throw new Error("Failed to fetch dashboard data");
  }

  return res.json();
}

export default async function DashboardPage() {
  const user = await getDashboardData();

  return (
    <main
      style={{
        minHeight: "100vh",
        backgroundColor: "#f4f4f4",
        padding: "40px",
        fontFamily: "Arial, sans-serif",
      }}
    >
      {/* Header */}
      <header style={{ marginBottom: "30px" }}>
        <h1 style={{ fontSize: "28px", marginBottom: "8px" }}>
          Dashboard
        </h1>
        <p style={{ color: "#555" }}>
          Server-Side Rendered Page
        </p>
        {/* Visible note explaining the rendering type */}
        <p style={{ fontSize: "14px", color: "#888", marginTop: "4px" }}>
          Note: This page is rendered on the server every time you visit (SSR).
        </p>
      </header>

      {/* Welcome Card */}
      <section
        style={{
          backgroundColor: "#fff",
          padding: "20px",
          borderRadius: "8px",
          marginBottom: "25px",
        }}
      >
        <h2 style={{ marginBottom: "10px" }}>
          Welcome, {user.name} 👋
        </h2>
        <p style={{ color: "#444" }}>
          Here’s a quick overview of your account.
        </p>
      </section>

      {/* Info Grid */}
      <section
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
          gap: "20px",
        }}
      >
        <div style={cardStyle}>
          <h3>Email</h3>
          <p>{user.email}</p>
        </div>

        <div style={cardStyle}>
          <h3>Username</h3>
          <p>{user.username}</p>
        </div>

        <div style={cardStyle}>
          <h3>Company</h3>
          <p>{user.company.name}</p>
        </div>
      </section>

      {/* Footer */}
      <footer
        style={{
          marginTop: "40px",
          fontSize: "14px",
          color: "#777",
        }}
      >
        Data fetched live on every request using SSR
      </footer>
    </main>
  );
}

const cardStyle: React.CSSProperties = {
  backgroundColor: "#ffffff",
  padding: "16px",
  borderRadius: "8px",
};
