<script setup>
import { ref } from "vue"

const emit = defineEmits(["send-message"])
const form = ref({
    chat: "",
})

const onPressEnter = (event) => {
    if (!event.shiftKey) {
        if (form.value.chat.length >= 2) {
            emit("send-message",{chat: form.value.chat})
            form.value.chat = ""
        }
        form.value.chat = ""
    }
}

</script>

<template>
    <div class="chat-input">
        <textarea @keyup.enter="onPressEnter($event)" class="form-control form-control-lg" rows="1" v-model="form.chat"></textarea>
    </div>
</template>

<style scoped>

textarea {
    resize: none;
}

.chat-input {
    position: fixed;
    bottom: 0;
    width: 50%;
    margin-left: 24%;

}
</style>