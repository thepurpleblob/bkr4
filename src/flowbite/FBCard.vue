<template>
    <div class="bg-neutral-primary-soft flex h-full max-w-sm flex-col p-6 border border-default rounded-base shadow-xs">
        <RouterLink :to="to">
            <img class="rounded-base" :src="imgsrc" alt="" />
        </RouterLink>
        <RouterLink :to="to">
            <h5 class="mt-6 mb-2 text-2xl font-semibold tracking-tight text-heading">{{ title }}</h5>
        </RouterLink>
        <p class="mb-6 flex-1 text-body" v-html="content"></p>
        <RouterLink :to="to" class="mt-auto inline-flex items-center bg-yellow-400 text-gray-900 box-border border border-yellow-500 hover:bg-yellow-500 hover:text-gray-900 focus:ring-4 focus:ring-yellow-300 shadow-xs font-medium leading-5 rounded-base text-sm px-4 py-2.5 focus:outline-none">
            Read more
            <svg class="w-4 h-4 ms-1.5 rtl:rotate-180 -me-0.5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24"><path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 12H5m14 0-4 4m4-4-4-4"/></svg>
        </RouterLink>
    </div>
</template>

<script setup>
    import { defineProps } from 'vue';
    import { RouterLink } from 'vue-router';

    const props = defineProps({
        imgsrc: String,
        title: String,
        content: String,
        to: String,
    });
</script>