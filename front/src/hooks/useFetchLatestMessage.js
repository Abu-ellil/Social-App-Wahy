import { useContext, useEffect, useState } from "react";
import { ChatContext } from "../context/chatContext";
import { apiUrl, getRequest } from "../api/api";
// import { getRequest, apiUrl } from "../api/api";



export const useFetchLatestMessage = (chat)=>{
    const [latestMessage, setLatestMessage] = useState(null);
    const {newMessage, notifications} = useContext(ChatContext)

    useEffect(()=>{
        const getMessage = async () => {
            const response = await getRequest(`${apiUrl}/messages/${chat?._id}`)
            if (response.error){
                return console.log(error);
            }

            const lastMessage = response[response.length - 1]
            setLatestMessage(lastMessage)
        }
        getMessage()
        
    },[newMessage, notifications])

    return {latestMessage}
}