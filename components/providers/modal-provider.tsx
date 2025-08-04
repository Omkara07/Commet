"use client"

import { useEffect, useState } from "react";
import CreateServerModal from "../modals/create-server-modal"
import InviteMemberModal from "../modals/invite-member-modal";
import EditServerModal from "../modals/edit-server-modal";
import ManageMemberModal from "../modals/manage-members-modal";


const ModalProvider = () => {
    const [isMounted, setMounted] = useState(false);

    useEffect(() => setMounted(true), []);

    if (!isMounted) return null

    return (
        <>
            <CreateServerModal />
            <InviteMemberModal />
            <EditServerModal />
            <ManageMemberModal />
        </>
    )
}

export default ModalProvider
