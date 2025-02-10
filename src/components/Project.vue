<script setup>
    import { ref } from 'vue';

    const projects = ref([
        {id: 'project-1', name: 'null', extension: 'python', url: ''},
        {id: 'project-2', name: 'null', extension: 'astro', url: ''},
        {id: 'project-3', name: 'null', extension: 'java', url: ''}
    ]);
</script>


<template id="container">
    <ul class="flex content-start justify-center space-x-2 mt-10">
        <li v-for="(item, index) in projects" :key="index.id" class="m-3 w-40"> 
            <div class="border p-4">
                <h1 class="mb-2">{{ item.name }}</h1>
                <h4>{{ item.extension }}</h4>
            </div>
        </li>
    </ul>
</template>
