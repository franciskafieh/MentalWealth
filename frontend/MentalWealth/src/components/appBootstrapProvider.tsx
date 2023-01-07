import { FullScreenLoading } from "./fullScreenLoading";
import { apiStateHandler } from "../utils/apiStateHandler";
import dayjs from "dayjs";
import { fetcher } from "../utils/fetcher";
import { useApiStore } from "../store/apiStore";
import { useEffect } from "react";
import { useMutation } from "@tanstack/react-query";
import { useRenew } from "../hooks/useRenew";

export const AppBootstrapProvider = ({ children }: { children: React.ReactNode }) => {
    const refresh = useMutation({
        mutationFn: () => {
            const refresh = fetcher.path("/Auth/Refresh").method("post").create();
            return refresh({});
        },
        onSuccess: (data) => {
            console.log("DEBUG: Token renewed.");
            apiStateHandler.setAuthToken(data.data.token ?? "");
            apiStateHandler.setUser(data.data.user);
        }
    });
    const tokenState = useApiStore((state) => state.authToken);
    const renew = useRenew();

    useEffect(() => {
        (async () => {
            console.log(tokenState);
            if (!tokenState) {
                try {
                    await refresh.mutateAsync();
                    renew(dayjs().add(3, "h").toDate());
                } catch (err) {
                    console.warn(err);
                }
            } else {
                renew(dayjs().add(3, "h").toDate());
            }
        })();
    }, []);

    if (refresh.isLoading) {
        return <FullScreenLoading />;
    }

    return <>{children}</>;
};