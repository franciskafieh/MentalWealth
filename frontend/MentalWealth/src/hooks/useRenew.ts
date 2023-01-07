import { apiStateHandler } from "./../utils/apiStateHandler";
import dayjs from "dayjs";
import { fetcher } from "./../utils/fetcher";
import { useMutation } from "@tanstack/react-query";

class TokenRenewer {
    private static timeout: any;

    public static async start(refreshCallback: any, errorCallback: any, expiresAt: Date) {
        clearTimeout(this.timeout);
        const timeout = dayjs(expiresAt).subtract(10, "second").diff(dayjs());
        console.log("DEBUG: Token expiry thread sleep: " + timeout / 1000 + " seconds.");

        const callback = () => {
            this.timeoutCallback(refreshCallback, errorCallback);
        };

        this.timeout = setTimeout(callback, timeout);
    }

    public static stop = () => {
        clearTimeout(this.timeout);
    };

    private static timeoutCallback = async (refreshCallback: any, errorCallback: any) => {
        console.log("DEBUG: Renewing token...");
        try {
            await refreshCallback();
        } catch (e) {
            errorCallback(e);
        }
    };
}

export const useRenew = () => {
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
    const logout = useMutation({
        mutationFn: () => {
            const logout = fetcher.path("/Auth/Logout").method("delete").create();
            return logout({});
        }
    });

    const renew = async (expiresAt: Date) => {
        TokenRenewer.start(refreshCallback, errorCallback, expiresAt);
    };

    const refreshCallback = async () => {
        const res = await refresh.mutateAsync();
        renew(dayjs().add(3, "h").toDate());
    };

    const errorCallback = async (err: Error) => {
        console.error(err);
        await logout.mutateAsync();
    };

    return renew;
};