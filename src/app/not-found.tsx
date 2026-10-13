import Link from "next/link";

export default function NotFound() {
  return (
    <section className="container flex min-h-[70vh] flex-col items-start justify-center pt-24">
      <p className="label text-accent">404 · no path found</p>
      <h1 className="mt-4 font-display text-4xl font-semibold text-ink md:text-6xl">This waypoint isn&apos;t on the map.</h1>
      <Link href="/" className="btn-primary mt-8">Back to home</Link>
    </section>
  );
}
