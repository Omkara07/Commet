"use client"

import { useEffect, useState } from "react";
import CreateServerModal from "../modals/create-server-modal"
import InviteMemberModal from "../modals/invite-member-modal";
import EditServerModal from "../modals/edit-server-modal";
import ManageMemberModal from "../modals/manage-members-modal";
import CreateChannelModal from "../modals/create-channel-modal";
import LeaveServerModal from "../modals/leave-server-modal";
import DeleteServerModal from "../modals/delete-server-modal";
import DeleteChannelModal from "../modals/delete-channel-modal";
import EditChannelModal from "../modals/edit-channel-modal";


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
            <CreateChannelModal />
            <LeaveServerModal />
            <DeleteServerModal />
            <DeleteChannelModal />
            <EditChannelModal />
        </>
    )
}

export default ModalProvider
