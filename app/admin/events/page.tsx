import { redirect } from "next/navigation";

export default function AdminEventsRedirect() {
  redirect("/events");
}
