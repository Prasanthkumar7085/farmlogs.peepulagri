import { SupportResponseDataType } from "@/types/supportTypes";
import Messagebox from "./messagebox";
import InMessage from "./in-message1";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import getMessageBySupportId from "../../../../../lib/services/SupportService/getMessageBySupportId";
import { SupportMessageType } from "@/types/SupportConversationTypes";
import { useSelector, useDispatch } from "react-redux";
import { setMessages } from "@/Redux/Modules/Conversations";


const SupportConversationScreen = ({ data }: { data: SupportResponseDataType | undefined }) => {

    const router = useRouter();
    const dispatch = useDispatch();

    const messages = useSelector((state: any) => state.conversation.messages);

    const [conversationMessages, setConversationMessages] = useState<Array<SupportMessageType>>([]);


    useEffect(() => {
        if (router.isReady) {
            getAllMessagesBySupportId();
        }
    }, [router])

    const getAllMessagesBySupportId = async () => {
        const response = await getMessageBySupportId(router.query.support_id as string);

        if (response.success) {
            setConversationMessages(response.data);
            dispatch(setMessages(response?.data));

        }
    }

    return (
        <div>
            <Messagebox getAllMessagesBySupportId={getAllMessagesBySupportId} />
            {messages.length ? messages.map((item: SupportMessageType, index: number) => {
                return (
                    <div key={index} >
                        <InMessage data={item} />
                    </div>
                )
            }) : ""}
        </div>
    )
}

export default SupportConversationScreen;