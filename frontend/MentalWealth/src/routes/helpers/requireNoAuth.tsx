import { Navigate, Outlet, useLocation } from "react-router-dom";

import { useAuthToken } from "../../hooks/useAuthToken";

export const RequireNoAuth = ({ redirect }: { redirect?: string }) => {
    const authToken = useAuthToken();
    const location = useLocation();

    return authToken === "" ? <Outlet /> : <Navigate to={redirect ?? "/home"} state={{ from: location }} replace={true} />;
};