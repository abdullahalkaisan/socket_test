import { useEffect, useState } from "react";
import ScrollToBottom from "react-scroll-to-bottom";

export default function ChatBox(props) {
    
    const {roomId,userName,socket} = props;

    // console.log(roomId,userName, socket );

    const [messageInput, setMessageInput] = useState("");
    const [messageList, setMessageList] = useState([]);
    const [otherName, setOtherName] = useState("");

    const chatSentHandle = async ()=>{
        if(messageInput !== ""){
            const messageData = {
                roomId,
                userName,
                message: messageInput,
                time: new Date().getTime()
            }
            await socket.emit('sent_message', messageData);
            setMessageList((prev)=> [...prev, messageData]);
            setMessageInput("");
        }

    }



    useEffect( ()=>{
        socket.on('receive_message', (data)=> {
                setOtherName(data.userName);
                setMessageList((prev)=> [...prev, data]);
            })

    return ()=>{
        socket.off('receive_message', (data)=> {
            setMessageList((prev)=> [...prev, data]);
        })
    }

    }, [socket])

    

  return (
    <div className="bg-gray-10 border-l-2 border-r-2 border-b-2 overflow-hidden rounded-lg h-[50%] w-96 flex flex-col justify-between">

        <div className="bg-slate-700 font-bold text-white p-3">
            
        Chat {otherName && `with ${otherName}`} 
            {/* {userName} */}
        </div>
        <div className=" overflow-auto flex flex-col flex-wrap h-full w-full justify-end p-3">
            <ScrollToBottom initialScrollBehavior="smooth" className="h-full overflow-auto">
            <div className="flex flex-col justify-end w-full">
                {messageList.map((item, index)=> {
                    return <div key={index} className={` ${userName === item.userName ? " chat chat-end" :"chat chat-start"}`}>
                    <div className="chat-header font-bold">
                    {item.userName}
                    <time className="text-xs opacity-50 ml-2">12:46</time>
                    </div>
                    <div className={`${userName === item.userName ? "chat-bubble" : "chat-bubble border border-gray-300 bg-[#dddddd] text-gray-800"}  `}>{item.message}</div>
                    {/* <div className="chat-footer opacity-50">Seen at 12:46</div> */}
                </div>
                })}

            </div>
            </ScrollToBottom>
        </div>
            <div className="flex space-x-3 p-3">
                <input autoFocus onKeyPress={(e)=> {
                    e.key === "Enter" && chatSentHandle();
                }} value={messageInput} onChange={(e)=> setMessageInput(e.target.value)} type="text" placeholder="Type" className="input input-bordered w-full max-w-xs" />
                <button onClick={chatSentHandle} type="submit" className="btn btn-neutral">Sent</button>
            </div>
        </div>
  )
}




{/* <div className="chat-image avatar">
<div className="w-10 rounded-full">
    <img
    alt="Tailwind CSS chat bubble component"
    src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp" />
</div>
</div> */}