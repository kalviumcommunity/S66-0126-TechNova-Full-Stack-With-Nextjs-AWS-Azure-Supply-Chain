export const revalidate = false; // This makes the page static (SSG)

export default function AboutPage() {
  console.log("About page rendered at BUILD time");

  return (
    <main className="flex min-h-screen items-center justify-center bg-gray-100 p-8">
      <div className="bg-white p-8 rounded-lg shadow-md max-w-lg text-center">
        <h1 className="text-3xl font-bold mb-4 text-gray-800">About Page</h1>
        <p className="text-gray-600 mb-6">
          This page uses <span className="font-semibold">Static Site Generation (SSG)</span>. 
          It is pre-rendered at build time and served as static HTML for fast performance.
        </p>

        <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded text-left">
          <h2 className="font-semibold text-blue-700 mb-1">Why SSG?</h2>
          <p className="text-gray-700">
            Since the content of this page does not change often, generating it at build time 
            improves performance, reduces server load, and delivers lightning-fast load times to users.
          </p>
        </div>
      </div>
    </main>
  );
}
