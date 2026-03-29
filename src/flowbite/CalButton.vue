<template>
    <button type="button" :data-tooltip-target="id" :class="classes" v-bind="$attrs" class="w-12 text-body border border-default hover:text-heading focus:ring-4 focus:ring-neutral-tertiary-soft shadow-xs font-medium leading-5 rounded-base text-sm px-4 py-2.5 focus:outline-none">
        <slot></slot>
    </button>

    <div :id="id" role="tooltip" class="absolute z-10 invisible inline-block px-3 py-2 text-sm font-medium text-white transition-opacity duration-300 bg-dark rounded-base shadow-xs opacity-0 tooltip">
        {{ value }}
        <div class="tooltip-arrow" data-popper-arrow></div>
    </div>
</template>

<script setup>
    import { defineProps, computed } from 'vue';

    const props = defineProps({
        color: {
            type: String,
            default: '',
        },
        value: {
            type: String,
            default: '',
        },
        id: {
            type: String,
        }
    });

    const classes = computed(() => {
        const colors = {            
            red: ['bg-red-500', 'hover:bg-red-300'],
            gray: ['bg-gray-500', 'hover:bg-gray-300'],
            grey: ['bg-gray-500', 'hover:bg-gray-300'],
            orange: ['bg-orange-500', 'hover:bg-orange-300'],
            yellow: ['bg-yellow-500', 'hover:bg-yellow-300'],
            green: ['bg-green-500', 'hover:bg-green-300'],
            teal: ['bg-teal-500', 'hover:bg-teal-300'],
            blue: ['bg-blue-500', 'hover:bg-blue-300'],
            indigo: ['bg-indigo-500', 'hover:bg-indigo-300'],
            purple: ['bg-purple-500', 'hover:bg-purple-300'],
            pink: ['bg-pink-500', 'hover:bg-pink-300'],
            default: ['bg-neutral-primary-soft', 'hover:bg-neutral-secondary-medium'],
        };

        const color = props.color;
        let classes = [];
        if (color in colors) {
            classes = colors[color];
        } else {
            classes = colors['default'];
        }

        if (props.color !== 'default') {
            classes.push('cursor-pointer');
        } 

        return classes;
    });
</script>