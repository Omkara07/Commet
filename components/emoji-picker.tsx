import { Smile } from "lucide-react";
import { Popover, PopoverTrigger } from "./ui/popover";
import { PopoverContent } from "@radix-ui/react-popover";
import EmojiPicker from 'emoji-picker-react';
import { Theme } from "emoji-picker-react";
import { useTheme } from "next-themes";

interface EmojiPickerProps {
    onChange: (value: string) => void
}
const EmojiPickerComponent = ({
    onChange
}: EmojiPickerProps) => {
    const { resolvedTheme } = useTheme();
    return (
        <Popover>
            <PopoverTrigger>
                <Smile className="text-zinc-500 dark:text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 transition" />
            </PopoverTrigger>
            <PopoverContent side="top" sideOffset={20} className="mx-auto pr-2 transition bg-transparent border-none shadow-none drop-shadow-none">
                <EmojiPicker
                    theme={resolvedTheme as Theme}
                    onEmojiClick={(emoji) => onChange(emoji.emoji)}
                    lazyLoadEmojis
                    searchDisabled={false}
                    previewConfig={{
                        defaultCaption: "Pick your mood 😊",
                        showPreview: true,
                    }}
                />
            </PopoverContent>
        </Popover>
    );
}

export default EmojiPickerComponent;