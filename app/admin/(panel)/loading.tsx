import { LoaderCircle } from "lucide-react";

export default function Loading() {
  return <div role="status" aria-label="Loading" className="grid h-64 place-items-center"><LoaderCircle className="size-7 animate-spin text-aqua" aria-hidden /></div>;
}
