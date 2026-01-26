<template>
    <nav class="bg-neutral-primary fixed w-full z-20 top-0 start-0 border-b border-default">
        <div class="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
            <img :src="BKLogo" class="h-32" alt="BK Railway Logo" />
            <button data-collapse-toggle="navbar-default" type="button" class="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-body rounded-base md:hidden hover:bg-neutral-secondary-soft hover:text-heading focus:outline-none focus:ring-2 focus:ring-neutral-tertiary" aria-controls="navbar-default" aria-expanded="false" id="navbar-trigger">
                <span class="sr-only">Open main menu</span>
                <svg class="w-6 h-6" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24"><path stroke="currentColor" stroke-linecap="round" stroke-width="2" d="M5 7h14M5 12h14M5 17h14"/></svg>
            </button>
            <div class="hidden w-full md:block md:w-auto" id="navbar-default">
            <ul class="font-medium flex flex-col p-4 md:p-0 mt-4 border border-default rounded-base bg-neutral-secondary-soft md:flex-row md:space-x-8 rtl:space-x-reverse md:mt-0 md:border-0 md:bg-neutral-primary">
                <li>
                    <RouterLink v-if="active == 'HomePage'" to="/" :class="activecss" aria-current="page">Home</RouterLink>
                    <RouterLink v-else to="/" :class="inactivecss" >Home</RouterLink>
                </li>
                <li>
                    <RouterLink v-if="active == 'TimetablePage'" to="/timetable" :class="activecss">Timetables</RouterLink>
                    <RouterLink v-else="active == 'TimetablePage'" to="/timetable" :class="inactivecss">Timetables</RouterLink>
                </li>
                <li>
                    <a href="#" class="block py-2 px-3 text-heading rounded hover:bg-neutral-tertiary md:hover:bg-transparent md:border-0 md:hover:text-fg-brand md:p-0 md:dark:hover:bg-transparent">Plan your visit</a>
                </li>
                <li>
                    <a href="#" class="block py-2 px-3 text-heading rounded hover:bg-neutral-tertiary md:hover:bg-transparent md:border-0 md:hover:text-fg-brand md:p-0 md:dark:hover:bg-transparent">Events</a>
                </li>
                <li>
                    <a href="#" class="block py-2 px-3 text-heading rounded hover:bg-neutral-tertiary md:hover:bg-transparent md:border-0 md:hover:text-fg-brand md:p-0 md:dark:hover:bg-transparent">Something special</a>
                </li>
            </ul>
            </div>
        </div>
    </nav>
</template>

<script setup>
    import BKLogo from '@/assets/bklogo.png';
    import { ref, onMounted, watch } from 'vue';
    import { initCollapses } from 'flowbite';
    import { RouterLink, useRoute } from 'vue-router';

    const route = useRoute();
    const active = ref('');

    const activecss = "block py-2 px-3 text-white bg-brand rounded md:bg-transparent md:text-fg-brand md:p-0";
    const inactivecss = "block py-2 px-3 text-heading rounded hover:bg-neutral-tertiary md:hover:bg-transparent md:border-0 md:hover:text-fg-brand md:p-0 md:dark:hover:bg-transparent";

    watch(() => route.name, () => {
        const $targetEl = document.getElementById('navbar-default');
        const $triggerEl = document.getElementById('navbar-trigger');
        const collapse = new Collapse($targetEl, $triggerEl);
        collapse.collapse();

        active.value = route.name;
    });

    onMounted(() => {
        initCollapses();
    })
</script>