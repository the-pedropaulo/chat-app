const socket = io();

const urlSearch = new URLSearchParams(window.location.search)
const username = urlSearch.get("username");
const room = urlSearch.get("select_room");

socket.emit("room_infos", {
    username: username,
    room: room
}, (messages) => {
    messages.forEach(message => {
        createMessage(message);
    });
});

$(document).ready(function(){
    $("#username").text(`user: ${username}, room: ${room}`)

    document
    .getElementById("message_input")
    .addEventListener("keypress", (event) => {
        if (event.key === "Enter") {
            const message = event.target.value;

            socket.emit("message_infos", {
                username: username,
                room: room,
                message: message
            });

            event.target.value = ""
        }
    })
});

socket.on("message_infos", (data) => {
    createMessage(data);
})

function createMessage(data) {
    const messageDiv = $("#messages")
    .append(`
        <div class="new_message">
            <label class="form-label">
            <strong>${data.username}</strong>
            <span>${data.text} ${dayjs(data.createdAt).format("DD/MM HH:mm")}.</span>
            </label>
        </div>`
    );
}