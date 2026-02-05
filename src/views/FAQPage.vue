<template>
    <h1 class="text-center text-4xl font-bold text-heading mb-8">FAQs</h1>

    <details v-for="item in items" class="collapse bg-base-100 border border-base-300" name="my-accordion-det-1" open>
        <summary class="collapse-title font-semibold">{{ item.Question}}</summary>
        <div class="collapse-content text-base" v-html="item.Answer"></div>
    </details>
</template>

<script setup>
    import { ref, onMounted } from 'vue';
    import ky from 'ky';

    const items = ref([]);

    onMounted(() => {
        const endpoint = import.meta.env.VITE_CMS_ENDPOINT;

        ky.get(endpoint + '/items/faq_plan?sort=sort').json()
        .then(result => {
            items.value = result.data;
        })
        .catch(error => {
            console.error(error);
        });
    });
</script>