<template>
    <div class="h-auto" :style="bgstyle">&nbsp;</div>
    <h1 class="text-center text-4xl font-bold text-heading mb-8">PLAN YOUR VISIT</h1>
    <GetHereBlock></GetHereBlock>
</template>

<script setup>
    import { computed } from 'vue';
    import PlanBanner from '@/assets/PlanBanner.jpg';
    import GetHereBlock from '../components/GetHereBlock.vue';

    const bgstyle = computed(() => "background-image: url(" + PlanBanner + ")");
</script>