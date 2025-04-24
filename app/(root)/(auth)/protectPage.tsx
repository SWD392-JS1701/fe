import { getUserRole } from "@/app/services/authService";
import { FC, useEffect, useState } from "react";
import { useAuthRedirect } from "@/app/services/userService";
import { useRouter } from "next/navigation";

export function withAuth(Component: FC, allowedRoles: string[]) {
  return function AuthenticatedComponent() {
    const { isChecking } = useAuthRedirect();
    const [isAuthorized, setIsAuthorized] = useState(false);
    const router = useRouter();

    useEffect(() => {
      const userRole = getUserRole();

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
