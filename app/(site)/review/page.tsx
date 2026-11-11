import { redirect } from "next/navigation";

// Reviews now live in a section on the home page; this keeps old links working.
export default function ReviewPage() {
  redirect("/#reviews");
}
