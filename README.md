# Advanced Data Fetching in Next.js with App Router

This project demonstrates three data fetching and rendering strategies in Next.js using the **App Router**: **Static Site Generation (SSG)**, **Server-Side Rendering (SSR)**, and **Incremental Static Regeneration (ISR)**. Each strategy shows how caching, revalidation, and dynamic fetching affect performance, scalability, and user experience.

---

## Pages and Rendering Modes

### Static Page (SSG)
- **Page:** About / Blog
- **Code:** `export const revalidate = false;`
- **Reason:** Content rarely changes, so pre-rendering at build time ensures fast page loads.
- **Performance Benefit:** Page is served as HTML instantly with minimal server computation.

### Dynamic Page (SSR)
- **Page:** Dashboard / Profile
- **Code Example:**
```javascript
export const dynamic = 'force-dynamic';

export default async function Dashboard() {
  const data = await fetch('https://api.example.com/metrics', { cache: 'no-store' });
  return <DashboardView data={data} />;
}
