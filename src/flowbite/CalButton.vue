<template>
    <button type="button" :class="classes" class="text-body border border-default hover:bg-neutral-secondary-medium hover:text-heading focus:ring-4 focus:ring-neutral-tertiary-soft shadow-xs font-medium leading-5 rounded-base text-sm px-4 py-2.5 focus:outline-none">
        <slot></slot>
    </button>
</template>

<script setup>
    import { defineProps, computed } from 'vue';

    const props = defineProps({
        color: {
            type: String,
            default: '',
        },
    });

    const classes = computed(() => {
        const colors = {            
            teal: ['bg-teal-500'],
            orange: ['bg-orange-500'],
        };

        const color = props.color;
        if (color in colors) {
            return colors[color];
        } else {
            return colors['default'];
        }
    });
</script>