import './chat.css'
import { useContext } from 'react'
import { ChatContext } from '../../context/chatContext'
import LoadingSpinner from '../isLoading/LoadingSpinner'
import {TabContainer, Stack, Container} from 'react-bootstrap'
import UserChat from './UserChat'
import { useSelector } from 'react-redux'
import PotentialChats from './PotentialChats'
import ChatBox from './ChatBox'

const Chat = () => {
    const user = useSelector((state) => state.user);
    const { userChats, loading, error, updateCurrentChat } =
      useContext(ChatContext);
    
    return (
      <Container>
        <PotentialChats />

        {userChats?.length < 1 ? null : (
          <Stack
            direction="horizontal"
            gap={4}
            className="align-items-start chat-container"
          >
            <Stack className="messages-box flex-grow-0 pe-3" gap={3}>
              {loading && <LoadingSpinner />}
              {userChats?.map((chat, index) => {
                return (
                  <div
                    key={index}
                    onClick={() => {
                      updateCurrentChat(chat);
                    }}
                  >
                    <UserChat chat={chat} user={user} />
                  </div>
                );
              })}
            </Stack>
            <ChatBox />
          </Stack>
        )}
      </Container>
    );
}

export default Chat