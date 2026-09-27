<template>
    <div
        v-if="page.hero"
        class="hero relative overflow-hidden rounded-lg shadow-sm"
    >
        <img
            class="block h-auto w-full"
            :src="assetpath + page.hero"
            alt=""
        />
        <div class="hero-overlay absolute inset-0"></div>
        <div class="hero-content absolute inset-0 z-10 text-neutral-content text-center">
            <div class="hero-text max-w-md prose prose-invert max-w-none prose-headings:text-neutral-content prose-p:text-neutral-content">
                <div v-html="page.herotext"></div>
                <RouterLink :to="page.herolink" class="btn btn-primary mt-4">Read more</RouterLink>
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

<style>
    .hero-text h1,
    .hero-text h2,
    .hero-text h3,
    .hero-text h4,
    .hero-text h5,
    .hero-text h6 {
        color: var(--color-neutral-content);
        font-weight: 700;
        line-height: 1.2;
        margin-top: 0;
        margin-bottom: 1rem;
    }

    .hero-text,
    .hero-text div,
    .hero-text strong,
    .hero-text b {
        color: var(--color-neutral-content);
    }

    .hero-text h1 {
        font-size: 2.25rem;
    }
</style>