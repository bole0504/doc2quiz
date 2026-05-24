import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";

export default async function QuizLayout({ children }: { children: React.ReactNode }) {
  const user = await getCurrentUser();
  if (!user) redirect("/login");
  return <div className="grid gap-6">{children}</div>;
}

