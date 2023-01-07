import { useApiStore } from "../store/apiStore";

export const useAuthToken = () => {
    const authToken = useApiStore((state) => state.authToken);

    return authToken;
};