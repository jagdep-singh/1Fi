import Link from "next/link";

export default function NotFound() {
  return (
    <main className="max-w-5xl mx-auto p-6 flex flex-col items-center justify-center text-center min-h-[60vh]">
      <p className="text-6xl font-black text-gray-900 mb-4">404</p>
      <h1 className="text-2xl font-bold text-gray-900 mb-2">Page Not Found</h1>
      <p className="text-gray-600 mb-8">
        everything is on the home page
      </p>
      <Link
        href="/"
        className="px-6 py-3 rounded-3xl bg-gray-900 text-white font-semibold hover:bg-gray-800 transition-colors"
      >
        Back to Home
      </Link>
    </main>
  );
}