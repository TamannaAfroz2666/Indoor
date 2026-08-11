import { redirect } from "next/navigation";

export default function NewVenuePage() {
  redirect("/venues/new/basic-info");
}
