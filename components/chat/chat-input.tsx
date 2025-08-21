"use client"

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import z from "zod";
import { Form, FormControl, FormField, FormItem } from "../ui/form";
import { Plus, Smile } from "lucide-react";
import { Input } from "../ui/input";
import qs from "query-string"
import axios from "axios";
import { useEffect, useRef } from "react";
import { useModal } from "@/hooks/use-model-store";
import EmojiPickerComponent from "../emoji-picker";
import { emit } from "process";
import { useRouter } from "next/navigation";

interface ChatInputProps {
    apiUrl: string,
    name: string,
    type: "channel" | "conversation",
    query: Record<string, any>,
}

const formSchema = z.object({
    content: z.string().min(1),
});

const ChatInput = ({
    apiUrl,
    name,
    type,
    query
}: ChatInputProps) => {

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            content: ""
        }
    })

    const router = useRouter();

    const isLoading = form.formState.isSubmitting;

    const inputRef = useRef<HTMLInputElement | null>(null);

    const { onOpen } = useModal();

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try {
            const url = qs.stringifyUrl({
                url: apiUrl,
                query
            })
            await axios.post(url, values);

            form.reset();
            router.refresh();
        }
        catch (err) {
            console.log(err)
        }
    }

    // Global `/` key listener (keyboard shortcut)
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            // not stealing focus if already typing in an input or textarea
            if (document.activeElement instanceof HTMLInputElement || document.activeElement instanceof HTMLTextAreaElement) {
                return;
            }

            if (e.key === "/") {
                e.preventDefault();
                inputRef.current?.focus();
            }
        };

        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, []);
    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
                <FormField
                    control={form.control}
                    name="content"
                    render={({ field }) => (
                        <FormItem>
                            <FormControl>
                                <div className="relative p-4 pb-6">
                                    <button type="button" onClick={() => { onOpen("messageFile", { apiUrl, query }) }} className=" absolute top-7 left-8 w-[24px] h-[24px] bg-zinc-500 dark:bg-zinc-400 rounded-full hover:bg-zinc-600 dark:hover:bg-zinc-300 transition">
                                        <Plus className=" text-white dark:text-[#313338]" />
                                    </button>
                                    <Input
                                        disabled={isLoading}
                                        placeholder={`Message ${type === 'conversation' ? name : `in #${name}`}`}
                                        className="px-14 py-6 bg-zinc-200/90 dark:bg-zinc-800/75 border-none border-0 focus-visible:ring-0 focus-visible:ring-offset-0 text-zinc-600 dark:text-zinc-200 placeholder:text-zinc-500 dark:placeholder:text-zinc-400"
                                        {...field}
                                        ref={(el) => {
                                            field.ref(el); // keep RHF ref
                                            inputRef.current = el; // keep our focus ref
                                        }}
                                    />
                                    <div className="absolute top-7 right-8">
                                        <EmojiPickerComponent onChange={(emoji: string) => field.onChange(`${field.value} ${emoji}`)} />
                                    </div>
                                </div>
                            </FormControl>
                        </FormItem>
                    )} />
            </form>
        </Form>
    );
}

export default ChatInput;