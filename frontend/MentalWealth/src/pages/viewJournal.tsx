import {
    Box,
    Button,
    Center,
    Group,
    Text,
    TextInput,
    Title,
    TypographyStylesProvider,
    createStyles,
} from "@mantine/core";
import { Link, RichTextEditor } from "@mantine/tiptap";
import { ValidationErrors, camelize, handleFormErrors } from "../utils/forms";
import { closeAllModals, openConfirmModal, openModal } from "@mantine/modals";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate, useParams } from "react-router-dom";

import { FullScreenLoading } from "../components/fullScreenLoading";
import Highlight from "@tiptap/extension-highlight";
import { MoodRating } from "../components/moodRating";
import StarterKit from "@tiptap/starter-kit";
import SubScript from "@tiptap/extension-subscript";
import Superscript from "@tiptap/extension-subscript";
import TextAlign from "@tiptap/extension-text-align";
import Underline from "@tiptap/extension-underline";
import { components } from "../schema";
import dayjs from "dayjs";
import { fetcher } from "../utils/fetcher";
import { useEditor } from "@tiptap/react";
import { useForm } from "@mantine/form";
import { useQuery as useRouteQuery } from "../hooks/useQuery";

const useStyles = createStyles((theme) => ({
    errorContainer: {
        height: "100vh",
        zIndex: -1,
        top: 0,
        left: 0,
        right: 0,
        position: "fixed",
        flexDirection: "column",
    },
}));

const EditEntryModalContent = ({
    entry,
    id,
}: {
    entry: components["schemas"]["JournalViewResponse"];
    id: number;
}): JSX.Element => {
    const queryClient = useQueryClient();

    const editEntry = useMutation({
        mutationFn: (values: components["schemas"]["JournalUpdateRequest"] & { id: number }) => {
            const createEntry = fetcher.path("/Journals/{id}").method("put").create();
            return createEntry(values);
        },
    });

    const form = useForm({
        initialValues: {
            title: entry.title,
            moodLevel: entry.moodLevel,
        },
        validate: {
            moodLevel: (value) => {
                if (value < 1 || value > 5) return "Mood level must be between 1 and 5";
            },
        },
    });

    const editor = useEditor({
        extensions: [
            StarterKit,
            Underline,
            Link,
            Superscript,
            SubScript,
            Highlight,
            TextAlign.configure({ types: ["heading", "paragraph"] }),
        ],
        content: entry.content,
    });

    const submit = form.onSubmit(async (values) => {
        try {
            await editEntry.mutateAsync({ ...values, content: editor.getHTML(), id });
            queryClient.invalidateQueries({ queryKey: ["JournalEntries"] });
            closeAllModals();
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
        <Box>
            <form onSubmit={submit}>
                <TextInput label="Title" required {...form.getInputProps("title")} mb="sm" />
                <Group position="apart" mb={form.errors.moodLevel ? 0 : "sm"}>
                    <Text size="sm" weight={500}>
                        Mood Rating
                        <Text
                            component="span"
                            aria-hidden="true"
                            sx={{ color: "rgb(250, 82, 82)" }}
                        >
                            {" "}
                            *
                        </Text>
                    </Text>
                    <MoodRating ratingProps={form.getInputProps("moodLevel")} />
                </Group>
                {form.errors.moodLevel && (
                    <Text color="red" size="sm" mb="sm">
                        {form.errors.moodLevel}
                    </Text>
                )}
                <RichTextEditor editor={editor} mb="md" sx={{ minHeight: 300 }}>
                    <RichTextEditor.Toolbar sticky stickyOffset={60}>
                        <RichTextEditor.ControlsGroup>
                            <RichTextEditor.Bold />
                            <RichTextEditor.Italic />
                            <RichTextEditor.Underline />
                            <RichTextEditor.Strikethrough />
                            <RichTextEditor.ClearFormatting />
                            <RichTextEditor.Highlight />
                            <RichTextEditor.Code />
                        </RichTextEditor.ControlsGroup>

                        <RichTextEditor.ControlsGroup>
                            <RichTextEditor.H1 />
                            <RichTextEditor.H2 />
                            <RichTextEditor.H3 />
                            <RichTextEditor.H4 />
                        </RichTextEditor.ControlsGroup>

                        <RichTextEditor.ControlsGroup>
                            <RichTextEditor.Blockquote />
                            <RichTextEditor.Hr />
                            <RichTextEditor.BulletList />
                            <RichTextEditor.OrderedList />
                            <RichTextEditor.Subscript />
                            <RichTextEditor.Superscript />
                        </RichTextEditor.ControlsGroup>

                        <RichTextEditor.ControlsGroup>
                            <RichTextEditor.Link />
                            <RichTextEditor.Unlink />
                        </RichTextEditor.ControlsGroup>

                        <RichTextEditor.ControlsGroup>
                            <RichTextEditor.AlignLeft />
                            <RichTextEditor.AlignCenter />
                            <RichTextEditor.AlignJustify />
                            <RichTextEditor.AlignRight />
                        </RichTextEditor.ControlsGroup>
                    </RichTextEditor.Toolbar>

                    <RichTextEditor.Content />
                </RichTextEditor>
                <Button type="submit" loading={editEntry.isLoading}>
                    Save
                </Button>
            </form>
        </Box>
    );
};

const ViewJournal = (): JSX.Element => {
    const { classes } = useStyles();

    const { id } = useParams<{ id: string }>();
    let query = useRouteQuery();
    const navigate = useNavigate();

    const queryClient = useQueryClient();

    const entry = useQuery({
        queryKey: ["JournalEntries", id],
        queryFn: () => {
            const getEntry = fetcher.path(`/Journals/{id}`).method("get").create();
            return getEntry({ id: +id, token: query.get("token") });
        },
    });

    const deleteEntry = useMutation({
        mutationFn: () => {
            const deleteEntry = fetcher.path(`/Journals/{id}`).method("delete").create();
            return deleteEntry({ id: +id });
        },
    });

    const openConfirmDeleteModal = () => {
        openConfirmModal({
            title: "Are you sure you want to delete this entry?",
            children: (
                <Text size="sm">
                    This action cannot be undone. If you delete this entry it will be gone forever.
                </Text>
            ),
            labels: { confirm: "Delete", cancel: "Cancel" },
            onConfirm: async () => {
                await deleteEntry.mutateAsync();
                queryClient.invalidateQueries({ queryKey: ["JournalEntries"] });
                navigate("/journal");
            },
            onCancel: () => {
                closeAllModals();
            },
        });
    };

    const openEditEntryModal = () => {
        openModal({
            title: "Edit Entry",
            size: "xl",
            children: <EditEntryModalContent entry={entry.data.data} id={+id} />,
        });
    };

    if (entry.isLoading) return <FullScreenLoading />;

    if (entry.isError)
        return (
            <Center className={classes.errorContainer} m="xs">
                <Title color="red" align="center">
                    Failed to load journal entry {/* @ts-ignore */}
                    {entry.error.status ? `(${entry.error.status})` : ""}
                </Title>
                <Text color="red" align="center">
                    {" "}
                    If it's an error 404 then it seems like the entry doesn't exist or is restricted
                    to view. Otherwise try again later or try logging out and the back in.
                </Text>
            </Center>
        );

    return (
        <Box>
            <Group position="apart" mb="xl">
                <Title>{entry.data.data.title}</Title>
                <MoodRating ratingProps={{ value: entry.data.data.moodLevel, readOnly: true }} />
            </Group>
            <TypographyStylesProvider>
                <div dangerouslySetInnerHTML={{ __html: entry.data.data.content }} />
            </TypographyStylesProvider>
            <Group position="apart" mt="xl">
                <Box>
                    <Text color="dimmed" size="xs">
                        Updated at
                    </Text>
                    <Text size="sm">{dayjs(entry.data.data.updatedAt).format("DD MMM YYYY")}</Text>
                </Box>
                <Box>
                    <Text color="dimmed" size="xs">
                        Created at
                    </Text>
                    <Text size="sm">{dayjs(entry.data.data.createdAt).format("DD MMM YYYY")}</Text>
                </Box>
            </Group>
            <Group position="apart" mt="sm">
                <Button onClick={() => navigate(-1)}>Back</Button>
                {!query.get("token") && (
                    <Group>
                        <Button
                            variant="outline"
                            color="red"
                            onClick={() => openConfirmDeleteModal()}
                        >
                            Delete
                        </Button>
                        <Button variant="outline" onClick={() => openEditEntryModal()}>
                            Edit
                        </Button>
                    </Group>
                )}
            </Group>
        </Box>
    );
};

export default ViewJournal;
