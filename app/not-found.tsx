import { ButtonLink } from "@/components/ui/button";

export default function NotFound() {
  return (
    <main className="grid flex-1 place-items-center bg-gradient-to-b from-deep to-abyss px-4 py-24 text-center">
      <div>
        <p className="font-display text-aqua">404</p>
        <h1 className="mt-3 font-display text-4xl font-semibold">Lost in deep water.</h1>
        <p className="mt-3 text-mist">We could not find the page you were looking for.</p>
        <ButtonLink href="/" className="mt-7">Back to the surface</ButtonLink>
      </div>
    </main>
  );
}
