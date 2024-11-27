<script setup>

const props = defineProps({
    chatValue: String,
    isSelf: Boolean,
    username: String,
})

</script>

<template>
    <div id="test" class="chat-container">    
        <div class="chat-bubble" :class="{ 'chat-bubble-self': isSelf }">
            <p :class="{'username-self': isSelf, 'username-other': !isSelf}">{{ username }}</p>
            <p class="chat" :class="{'chat-self': isSelf, 'chat-other': !isSelf}">{{ chatValue }}</p>
        </div>
    </div>
</template>

<style scoped>
.username-self {
    position: relative;
    left: 45px;
    bottom: 20px
}

.username-other {
    position: relative;
    left: 38px;
    bottom: 20px
}

.chat {
    word-wrap: break-word;
    border-radius: 1em;
    padding: .5em;
    max-width: 400px;
}

.chat-self {
    border: 1px solid #0E3B82;
    background-color: #0E3B82;
}

.chat-other {
    border: 1px solid #292929;
    background-color: #292929;
}

.chat-bubble {
    display: flex;
    margin-left: 1em;
    margin-right: 1em;
    padding-top: 1em
}
.chat-bubble, p {
    margin-bottom: 0em;
}

.chat-bubble-self {
    display: flex;
    justify-content: flex-end;
}

</style>