import type { Metadata } from "next";
import { AuthForm } from "@/features/auth/AuthForm";

export const metadata: Metadata = {
  title: "Administrator sign in",
  robots: { index: false, follow: false },
};

export default function AdminLoginPage() {
  return <AuthForm mode="admin-login" />;
}
