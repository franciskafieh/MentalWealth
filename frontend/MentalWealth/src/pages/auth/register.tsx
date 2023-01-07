import {
    Anchor,
    Box,
    Button,
    Center,
    PasswordInput,
    Text,
    TextInput,
    Title,
    createStyles,
} from "@mantine/core";
import { ValidationErrors, camelize, handleFormErrors } from "../../utils/forms";

import { Link } from "react-router-dom";
import { apiStateHandler } from "../../utils/apiStateHandler";
import { components } from "../../schema";
import { fetcher } from "../../utils/fetcher";
import { useForm } from "@mantine/form";
import { useMutation } from "@tanstack/react-query";

const useStyles = createStyles((theme) => ({
    container: {
        height: "100vh",
    },
    form: {
        display: "flex",
        flexDirection: "column",

        width: "25vw",

        [`@media (max-width: ${theme.breakpoints.lg}px)`]: {
            width: "35vw",
        },

        [`@media (max-width: ${theme.breakpoints.md}px)`]: {
            width: "45vw",
        },

        [`@media (max-width: ${theme.breakpoints.sm}px)`]: {
            width: "65vw",
        },

        [`@media (max-width: ${theme.breakpoints.xs}px)`]: {
            width: "75vw",
        },
    },
}));

const Register = (): JSX.Element => {
    const { classes } = useStyles();

    const register = useMutation({
        mutationFn: (values: components["schemas"]["RegisterRequest"]) => {
            const register = fetcher.path("/Auth/Register").method("post").create();
            return register(values);
        },
    });

    const logIn = useMutation({
        mutationFn: (values: components["schemas"]["LoginRequest"]) => {
            const logIn = fetcher.path("/Auth/Login").method("post").create();
            return logIn(values);
        }
    })

    const form = useForm({
        initialValues: {
            userName: "",
            email: "",
            password: "",
            confirmPassword: "",
        },
    });

    const submit = form.onSubmit(async (values) => {
        try {
            await register.mutateAsync(values);
            const res = await logIn.mutateAsync({
                email: values.email,
                password: values.password,
                remember: true
            });
            apiStateHandler.setAuthToken(res.data.token ?? "");
            apiStateHandler.setUser(res.data.user ?? undefined);
        } catch (err) {
            console.log(err);
            handleFormErrors(err, handleValidationErrors);
        }
    });

    const handleValidationErrors = (errors: ValidationErrors) => {
        for (const validationError in errors) {
            let message = "";
            for (const err of errors[validationError]) {
                message += `${err}\n`;
            }
            form.setFieldError(camelize(validationError), message);
        }
    };

    return (
        <Center className={classes.container}>
            <form className={classes.form} onSubmit={submit}>
                <Title order={1} size="h2" align="center" mb="sm">
                    Register
                </Title>

                <TextInput {...form.getInputProps("userName")} required={true} label="Username" mb="sm" />
                <TextInput {...form.getInputProps("email")} type="email" required={true} label="Email" mb="sm" />
                <PasswordInput {...form.getInputProps("password")} required={true} label="Password" mb="sm" />
                <PasswordInput {...form.getInputProps("confirmPassword")} required={true} label="Confirm password" mb="md" />

                <Button type="submit" loading={register.isLoading || logIn.isLoading}>Register</Button>

                <Text align="center" mt="md">
                    Already have an account?{" "}
                    <Anchor component={Link} to="/auth/login">
                        Log in
                    </Anchor>
                </Text>
                <Anchor component={Link} to="/" align="center">
                    Go back to home screen
                </Anchor>
            </form>
        </Center>
    );
};

export default Register;
