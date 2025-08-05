import { Server } from "@/lib/generated/prisma";
import { create } from "zustand";

export type ModalType = "createServer" | "invite" | "editServer" | "members" | "createChannel" | "leaveServer" | "deleteServer";

type modalData = {
    server?: Server
}
interface ModalStore {
    type: ModalType | null;
    isOpen: boolean;
    data: modalData;
    onOpen: (type: ModalType, data?: modalData) => void;
    onClose: () => void;
}

export const useModal = create<ModalStore>((set) => ({
    type: null,
    isOpen: false,
    data: {},
    onOpen: (type, data = {}) => set({ isOpen: true, type, data }),
    onClose: () => set({ type: null, isOpen: false }),
}));