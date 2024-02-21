import './chat.css'
import { useContext } from 'react'
import { ChateContext } from '../../context/chatContext'
import LoadingSpinner from '../isLoading/LoadingSpinner'
import {TabContainer, Stack} from 'react-bootstrap'

const Chat = () => {
    const { userChats, loading, error } = useContext(ChateContext)
    console.log(userChats, loading, error);
    return (
      <div>
        {
            userChats?.length<1? null:(
                <div>

                </div>
            )
        }
      </div>
    )



    
    // return (
    //     <div className="chat-container">
    //         {loading? <LoadingSpinner /> : null}
    //         {error? <p>Error: {error}</p> : null}
    //         {userChats.map((chat) => {
    //             return (
    //                 <div className="chat-card" key={chat._id}>
    //                     <div className="chat-card-header">
    //                         <div className="chat-card-header-title">
    //                             {chat.title}
    //                         </div>
    //                     </div>
    //                     <div className="chat-card-body">
    //                         <div className="chat-card-body-text">
    //                             {chat.text}
    //                         </div>
    //                     </div>
    //                 </div>
    //             )
    //         })}
    //     </div>
    // )
}

export default Chat