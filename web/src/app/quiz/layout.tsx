import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";

export default async function QuizLayout({ children }: { children: React.ReactNode }) {
  const user = await getCurrentUser();
  if (!user) redirect("/login");
  // Break out of RootLayout's padded card wrapper for a more app-like quiz experience.
  return <div className="-m-5 sm:-m-7">{children}</div>;
}
