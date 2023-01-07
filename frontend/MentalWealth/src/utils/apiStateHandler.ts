import { components } from "../schema";
import { setApiState } from "../store/apiStore";

export class ApiStateHandler {
    public setAuthToken(token: string): void {
        sessionStorage.setItem("authToken", token);
        setApiState((state) => ({ ...state, authToken: token }));
    }

    public setUser(user?: components["schemas"]["LoginResponseUser"]): void {
        if (user) {
            sessionStorage.setItem("user", JSON.stringify(user));
        } else {
            sessionStorage.removeItem("user");
        }
        setApiState((state) => ({ ...state, user: user }));
    }
}

export const apiStateHandler = new ApiStateHandler();