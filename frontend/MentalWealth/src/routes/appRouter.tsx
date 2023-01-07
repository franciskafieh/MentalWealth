import { Route, Routes } from "react-router-dom";
import { Suspense, lazy } from "react";

import { FullScreenLoading } from "../components/fullScreenLoading";
import { RequireAuth } from "./helpers/requireAuth";
import { RequireNoAuth } from "./helpers/requireNoAuth";

export const AppRouter = () => {
    const IndexPage = lazy(() => import("../pages/index"));
    const LoginPage = lazy(() => import("../pages/auth/login"));
    const RegisterPage = lazy(() => import("../pages/auth/register"));
    const HomePage = lazy(() => import("../pages/home"));

    const ProtectedLayout = lazy(() => import("./layouts/protectedLayout"));

    return (
        <Suspense fallback={<FullScreenLoading />}>
            <Routes>
                <Route element={<RequireNoAuth />}>
                    <Route path="/" element={<IndexPage />} />
                    <Route path="/auth/login" element={<LoginPage />} />
                    <Route path="/auth/register" element={<RegisterPage />} />
                </Route>
                <Route element={<RequireAuth />}>
                    <Route element={<ProtectedLayout />}>
                        <Route path="/home" element={<HomePage />} />
                    </Route>
                </Route>
            </Routes>
        </Suspense>
    );
};