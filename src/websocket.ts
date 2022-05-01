import { io } from "./http";

interface IRoomUser {
    socket_id: string,
    username: string,
    room: string
}

interface IMessage {
    room: string,
    text: string,
    username: string,
    createdAt: Date
}

const users: Array<IRoomUser> = []

const messages: Array<IMessage> = []

io.on("connection", socket => {
    socket.on("room_infos", (data, callback) => {
        console.log(data);

        socket.join(data.room)

        const userInRoom = users.find((user) => {
            user.username === data.username && user.room === data.room
        });

        if(userInRoom) {
            userInRoom.socket_id = socket.id;

        } else {  

            const user: IRoomUser = {
                room: data.room,
                username: data.username,
                socket_id: socket.id
            }

            users.push(user);
        }

        const messagesRoom = getMessagesRoom(data.room)
        callback(messagesRoom)
    });

    socket.on("message_infos", (data) => {
        console.log(data)

        const message: IMessage = {
            room: data.room,
            username: data.username,
            text: data.message,
            createdAt: new Date()
        }

        messages.push(message)

        io.to(data.room).emit("message_infos", message);
    })
});

function getMessagesRoom(room: string): Array<IMessage> | [] {
    const messagesRoom = messages.filter((message) => message.room === room);
    return messagesRoom;
}