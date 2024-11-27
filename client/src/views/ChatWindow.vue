<script setup>
import { ref } from "vue"
import ChatBubble from '../components/ChatBubble.vue';
import ChatInput from '../components/ChatInput.vue';
import socket from "../assets/socket"
import SetName from "../components/SetName.vue";
import ConnectedUsers from "../components/ConnectedUsers.vue"

const username = ref("Guest")
const users = ref([])
const chats = ref([])
const connectedRoom = ref("")
const room = ref({
    roomName: ""
})

socket.on("room-emit", async (data) => {
    // Dcrypt here
    chats.value.push({
        string: data.msg,
        isSelf: false,
        username: data.username
    })
    sendNotification(data.username, data.msg)
    window.scrollTo(0, document.body.scrollHeight+50)
})

const sendMsg = async (chat) => {
    // encrypt here
    socket.emit("room-msg", {
        msg: chat,
        room: connectedRoom.value,
        username: username.value
    })

    window.scrollTo(0, document.body.scrollHeight + 50)
}

const pushMessage = (chat) => {
    chats.value.push({
        string: chat.chat,
        isSelf: true,
        username: username.value
    })
    sendMsg(chat.chat)
}


const joinRoom = () => {
    connectedRoom.value = room.value.roomName
    socket.emit("join-room", room.value.roomName)
}

const setName = (name) => {
    socket.auth = { name }
    socket.connect()
    username.value = name
}

const sendNotification = async (title, body) => {
    await window.versions.notify(title, body)
}

// TODO: Do better error handling
socket.on("connect_error", (err) => {
    if (err.message === "Invalid Username") {
        // this.usernameAlreadySelected = false
        console.error(err)
    }
})


socket.on("users", (userJoinEvent) => {
    userJoinEvent.forEach((user) => {
        user.self = user.userID === socket.id;
        users.value.push(user);
    });
});

socket.on("user connected", (user) => {
    users.value.push(user)
})

socket.on("user disconnected", (userID) => {
    for (let i = 0; i < users.value.length; i++) {
        const user = users.value[i];
        if (userID === user.userID) {
            users.value.splice(i, 1)
        }
    }
})

</script>

<template>
    <form v-if="username !== 'Guest'" @submit.prevent="joinRoom()">
        <input type="text" v-model="room.roomName">
        <button type="submit">Join room</button>
    </form>
    <SetName @save-name="setName" />

    <h4 style="margin-top: 1em;">Online Users</h4>
    
    <ConnectedUsers v-for="user in users" :username="user.username" :room="user.room"/>
    
    <div class="chats-container">
        <div v-for="data in chats">
            <ChatBubble :chatValue="data.string" :isSelf="data.isSelf" :username="data.username" />
        </div>
    </div>
    <div>
        <ChatInput v-if="username !== 'Guest'" @send-message="pushMessage" />
    </div>
</template>

<style scoped>
.chats-container {
    max-width: 70%;
    margin: auto;
    margin-bottom: 10em;
}
</style>