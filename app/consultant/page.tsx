import { redirect } from "next/navigation"

export default function ConsultantPage() {
  redirect("/chat?mode=consultant")
}
