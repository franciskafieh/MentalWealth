import {
    Box,
    Button,
    Center,
    Group,
    SimpleGrid,
    Text,
    TextInput,
    Title,
    createStyles,
} from "@mantine/core";
import { Link, RichTextEditor } from "@mantine/tiptap";
import { ValidationErrors, camelize, handleFormErrors } from "../utils/forms";
import { closeAllModals, openModal } from "@mantine/modals";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { FullScreenLoading } from "../components/fullScreenLoading";
import Highlight from "@tiptap/extension-highlight";
import { JournalEntryCard } from "../components/journalEntryCard";
import { MoodRating } from "../components/moodRating";
import StarterKit from "@tiptap/starter-kit";
import SubScript from "@tiptap/extension-subscript";
import Superscript from "@tiptap/extension-subscript";
import TextAlign from "@tiptap/extension-text-align";
import Underline from "@tiptap/extension-underline";
import { components } from "../schema";
import { fetcher } from "../utils/fetcher";
import { useEditor } from "@tiptap/react";
import { useForm } from "@mantine/form";

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

const CreateEntryModalContent = (): JSX.Element => {
    const queryClient = useQueryClient();

    const createEntry = useMutation({
        mutationFn: (values: components["schemas"]["JournalCreateRequest"]) => {
            const createEntry = fetcher.path("/Journals").method("post").create();
            return createEntry(values);
        },
    });

    const form = useForm({
        initialValues: {
            title: "",
            moodLevel: 0,
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
        content: "<p>Hello <strong>World</strong>!</p>",
    });

    const submit = form.onSubmit(async (values) => {
        try {
            await createEntry.mutateAsync({ ...values, content: editor.getHTML() });
            queryClient.invalidateQueries({ queryKey: ["JournalEntries"] });
            queryClient.invalidateQueries({ queryKey: ["Balance"] });
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
                    <Text size="sm" weight={500}>Mood Rating<Text component="span" aria-hidden="true" sx={{ color: "rgb(250, 82, 82)" }}> *</Text></Text>
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
                <Button type="submit" loading={createEntry.isLoading}>Save</Button>
            </form>
        </Box>
    );
};

const Journal = (): JSX.Element => {
    const { classes } = useStyles();

    const journalEntries = useQuery({
        queryKey: ["JournalEntries"],
        queryFn: () => {
            const journalEntries = fetcher.path("/Journals").method("get").create();
            return journalEntries({});
        },
    });

    if (journalEntries.isLoading) return <FullScreenLoading />;

    if (journalEntries.isError)
        return (
            <Center className={classes.errorContainer} m="xs">
                <Title color="red" align="center">
                    Failed to load journal entries
                </Title>
                <Text color="red" align="center">
                    {" "}
                    Please try again later or try logging out and the back in.
                </Text>
            </Center>
        );

    const openCreateEntryModal = () => {
        openModal({
            title: "Create Entry",
            size: "xl",
            children: <CreateEntryModalContent />,
        });
    };

    const journalEntryCards = journalEntries.data.data.map((journalEntry) => (
        <JournalEntryCard key={journalEntry.id} journalEntry={journalEntry} />
    ));

    return (
        <Box>
            <Group position="apart" mb="xs">
                <Title order={1} mb="sm">
                    Journal
                </Title>
                <Button variant="outline" onClick={() => openCreateEntryModal()}>
                    New Entry
                </Button>
            </Group>
            <SimpleGrid
                cols={4}
                spacing="lg"
                breakpoints={[
                    { maxWidth: 1524, cols: 3, spacing: "md" },
                    { maxWidth: 1184, cols: 2, spacing: "sm" },
                    { maxWidth: 784, cols: 1, spacing: "sm" },
                ]}
            >
                {journalEntryCards}
            </SimpleGrid>
        </Box>
    );
};

export default Journal;
