import { Navigate, Outlet, useLocation } from "react-router-dom";

import { useAuthToken } from "../../hooks/useAuthToken";

export const RequireAuth = ({ redirect }: { redirect?: string }) => {
    const authToken = useAuthToken();
    const location = useLocation();

    return authToken === "" ? <Navigate to={redirect ?? "/auth/login"} state={{ from: location }} replace={true} /> : <Outlet />;
};