<script setup>

const props = defineProps({
    username: String,
    room: String
})



</script>
<template>


<div class="online-users">
    <ul class="users-list">
        <li v-if="props.room !== null" class="user">{{ props.username }} | In Room: {{ props.room }}</li>
        <li v-else class="user">{{ props.username }}</li>
    </ul>
</div>


</template>
<style>

.online-users {
    margin-left: 1em;
    width: max-content;
    padding-right: 1em;
}

li::marker {
    color: green;
}

</style>