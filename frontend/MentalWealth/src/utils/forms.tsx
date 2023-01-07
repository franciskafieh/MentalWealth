import { IconX } from "@tabler/icons";
import { showNotification } from "@mantine/notifications";

export interface ValidationErrors {
    [key: string]: string[];
}

export const handleFormErrors = (error: any, handler: (errors: ValidationErrors) => void) => {
    switch (error.status) {
        case 400:
            handler(error.data.errors as ValidationErrors);
            break;
        case 401:
                showNotification({
                    title: "Hiba (401)",
                    color: "red",
                    icon: <IconX />,
                    message:
                        "Your session has expired. Please log in again.",
                });
                break;
        case 429:
            showNotification({
                title: "Error (429)",
                color: "red",
                icon: <IconX />,
                message: "Too many requests. Please try again later.",
            });
            break;
        case 500:
            showNotification({
                title: "Error (500)",
                color: "red",
                icon: <IconX />,
                message: "Error with the server. Please try again later.",
            });
            break;
        default:
            showNotification({
                title: "Error",
                color: "red",
                icon: <IconX />,
                message: "An unknown error occurred.",
            });
            break;
    }
};

export const camelize = (str) => {
    return str.replace(/(?:^\w|[A-Z]|\b\w)/g, function(word, index) {
      return index === 0 ? word.toLowerCase() : word.toUpperCase();
    }).replace(/\s+/g, '');
  }
