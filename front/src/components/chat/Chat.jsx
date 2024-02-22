import './chat.css'
import { useContext } from 'react'
import { ChatContext } from '../../context/chatContext'
import LoadingSpinner from '../isLoading/LoadingSpinner'
import {TabContainer, Stack, Container} from 'react-bootstrap'
import UserChat from './UserChat'
import { useSelector } from 'react-redux'
import PotentialChats from './PotentialChats'

const Chat = () => {
    const user = useSelector((state) => state.user);
    const { userChats, loading, error } = useContext(ChatContext)
    // console.log(userChats, loading, error);
    return (
      <Container>
        <PotentialChats/>
        <div>
        {userChats?.length < 1 ? null : (
          <Stack direction="horizontal" gap={4} className='align-items-start'>
            <Stack className="messages-box flex-grow-0 pe-3"  gap={3}>
              {loading && <LoadingSpinner/>}
              {userChats?.map((chat,index)=>{
                return (
                    <div key={index}>
                        <UserChat chat={chat} user={user}/>
                    </div>
                )
              })}
            </Stack>
            <p>ChatBox</p>
          </Stack>
        )}</div>
      </Container>
    );
}

export default Chat