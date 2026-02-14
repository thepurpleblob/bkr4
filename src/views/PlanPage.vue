<template>
    <h1 class="text-center text-4xl font-bold text-heading mb-8">PLAN YOUR VISIT</h1>

    <div class="mb-4 w-full">
        <FaresBlock></FaresBlock>
    </div>
    <div class="mb-4 grid grid-cols-2 lg:grid-cols-4 gap-2 justify-evenly">
        <FBCard
            :imgsrc="greensteamengineURL"
            title="TIMETABLES 2026"
            content="Find the day you'd like to visit us and click to see the timetable for that day."
            to="/timetable"
        ></FBCard>

        <FBCard
            :imgsrc="afternoonteaURL"
            title="SPECIAL EVENTS 2026"
            content="Our current special events for 2026."
            to="/events"
        ></FBCard>

        <FBCard
            :imgsrc="SteamSignalboxURL"
            title="FAQs"
            content="Answers to the questions we're often asked. If you can't find what you're looking for please don't hesitate to get in touch."
            to="/faq"
        ></FBCard>

        <FBCard
            :imgsrc="accessibilityURL"
            title="Acessibility"
            content="Our accessibility guide."
            to="/page/accessibility"
        ></FBCard>

    </div>
    <GetHereBlock></GetHereBlock>
</template>

<script setup>
    import { computed } from 'vue';
    import PlanBanner from '@/assets/PlanBanner.jpg';
    import GetHereBlock from '../components/GetHereBlock.vue';
    import FaresBlock from '../components/FaresBlock.vue';
    import FBCard from '../flowbite/FBCard.vue';

    // Images.
    import SteamSignalboxURL from '../assets/SteamSignalbox.jpg';
    import greensteamengineURL from '../assets/greensteamengine.jpg';
    import accessibilityURL from '../assets/accessibility.jpg';
    import afternoonteaURL from '../assets/afternoontea.jpg';

    const bgstyle = computed(() => "background-image: url(" + PlanBanner + ")");
</script>