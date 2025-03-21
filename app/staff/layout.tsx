"use client";

import { FC, ReactNode } from "react";
import StaffNavbar from "@/components/Navbar/StaffNavbar";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Footer from "@/components/Footer";
interface StaffLayoutProps {
  children: ReactNode;
}

const StaffLayout: FC<StaffLayoutProps> = ({ children }) => {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "loading") return;

    if (!session) {
      router.push("/sign-in");
    } else if (session.user.role !== "Staff") {
      router.push("/");
    }
  }, [session, status, router]);

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (!session || session.user.role !== "Staff") {
    return null;
  }

  return (
    <div>
      <StaffNavbar />
      <main className="pt-28">{children}</main>
      <Footer />
    </div>
  );
};

export default StaffLayout;
