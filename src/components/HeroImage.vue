<template>
    <div
        v-if="page.hero"
        class="hero relative overflow-hidden"
    >
        <img
            class="block h-auto w-full"
            :src="assetpath + page.hero"
            alt=""
        />
        <div class="hero-overlay absolute inset-0"></div>
        <div class="hero-content absolute inset-0 z-10 text-neutral-content text-center">
            <div class="max-w-md">
                <p class="mb-5" v-html="page.herotext">
                </p>
                <RouterLink :to="page.herolink" class="btn btn-primary">Read more</RouterLink>
            </div>
        </div>
    </div>
</template>

<script setup>
    import { defineProps } from 'vue';
    import { RouterLink } from 'vue-router';

    const assetpath = import.meta.env.VITE_CMS_ENDPOINT + '/assets/';

    const props = defineProps({
        page: {
            type: Object,
            required: true
        }
    });
</script>