import { useAuthRedirect, getUserRole } from "@/app/services/authService";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export function withAuth(Component: React.FC, allowedRoles: string[]) {
  return function AuthenticatedComponent() {
    const { isChecking } = useAuthRedirect();
    const [role, setRole] = useState<string | null>(null);
    const [isAuthorized, setIsAuthorized] = useState(false);
    const router = useRouter();

    useEffect(() => {
      const userRole = getUserRole();
      setRole(userRole);

      if (!allowedRoles.includes(userRole || "")) {
        router.replace("/no"); 
      } else {
        setIsAuthorized(true); 
      }
    }, [router]);

    if (isChecking || !isAuthorized) {
      return null; 
    }

    return <Component />;
  };
}
