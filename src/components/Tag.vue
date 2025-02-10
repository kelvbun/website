<script setup>
    import { ref } from 'vue';

    const tags = ref([
        {tag: 'lazy'},
        {tag: 'music addict'},
        {tag: 'sleepy'}
    ]);
</script>

<template id="container">
    <ul class="flex content-start space-x-2">
        <li v-for="(item, index) in tags" :key="index.id" class="border p-2">{{ item.tag }}</li>
    </ul>
</template>
