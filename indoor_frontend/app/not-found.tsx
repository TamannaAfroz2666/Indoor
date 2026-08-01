import Link from "next/link";

export default function NotFound() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-white px-6">
      <div className="text-center">
        <p className="text-sm font-semibold text-green-600">404</p>

        <h1 className="mt-3 text-4xl font-bold text-gray-900">
          Page not found
        </h1>

        <p className="mt-4 text-gray-600">
          The page you are looking for does not exist.
        </p>

        <Link
          href="/"
          className="mt-8 inline-flex rounded-full bg-green-600 px-6 py-3 font-medium text-white hover:bg-green-700"
        >
          Back to home
        </Link>
      </div>
    </main>
  );
}