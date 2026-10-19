<template>
    <CalButton v-if="item && item.Color" :color="item.Color" :id="'ttooltip' + item.id" :value="item.Title" :class="['!w-full !aspect-square !px-0 !py-0', cellClasses]">
        {{ item.daynum }}
    </CalButton>
    <CalButton v-if="item && item.daynum && !item.Color" color="default" :id="'ttooltip' + item.id" value="No services" :class="['!w-full !aspect-square !px-0 !py-0', cellClasses]">
        {{ item.daynum }}
    </CalButton>
</template>

<script setup>
    import { computed, defineProps } from 'vue';
    import CalButton from '../flowbite/CalButton.vue';

    const props = defineProps({
        item: Object,
    });

    const itemDate = computed(() => props.item?.date?.slice(0, 10) ?? '');
    const now = new Date();
    const today = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
    const cellClasses = computed(() => ({
        'border-2 border-white ring-2 ring-black': itemDate.value === today,
        'opacity-50': itemDate.value !== '' && itemDate.value < today,
    }));
</script>