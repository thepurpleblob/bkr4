<template>
    <CalButton v-if="item && item.Color" :color="item.Color">
        {{ item.daynum }}
    </CalButton>
    <CalButton v-if="item && item.daynum && !item.Color" color="default">
        {{ item.daynum }}
    </CalButton>
</template>

<script setup>
    import { defineProps } from 'vue';
    import FButton from '../flowbite/FButton.vue';
    import CalButton from '../flowbite/CalButton.vue';

    const props = defineProps({
        item: Object,
    });
</script>