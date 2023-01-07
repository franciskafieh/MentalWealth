import { components } from "./../schema";
import create from "zustand";
import createVanilla from "zustand/vanilla";
import { mountStoreDevtool } from "simple-zustand-devtools";

export interface ApiState {
    authToken: string;
    user?: components["schemas"]["LoginResponseUser"];
}

export const apiStore = createVanilla<ApiState>(() => ({
    authToken: sessionStorage.getItem("authToken") ?? "",
    user: JSON.parse(sessionStorage.getItem("user") ?? "{}") as components["schemas"]["LoginResponseUser"],
}));

export const { getState: getApiState, setState: setApiState, subscribe: apiSubscribe, destroy: apiDestroy } = apiStore;

export const useApiStore = create(apiStore);

if (process.env.NODE_ENV === "development") {
    mountStoreDevtool("ApiStore", useApiStore);
}