<template>
    <h1 class="text-center text-4xl font-bold text-heading mb-8">PLAN YOUR VISIT</h1>

    <div class="mb-4">
        <FaresBlock></FaresBlock>
    </div>
    <div class="mb-4 flex gap-2 justify-evenly">

        <!-- Accessibility -->
        <div class="card bg-base-100 image-full w-96 shadow-sm">
            <figure>
                <img
                src="https://img.daisyui.com/images/stock/photo-1606107557195-0e29a4b5b4aa.webp"
                alt="Shoes" />
            </figure>
            <div class="card-body">
                <h2 class="card-title">ACCESSIBILITY GUIDE</h2>
                <p>A card component has a figure, a body part, and inside body there are title and actions parts</p>
                <div class="card-actions justify-end">
                <button class="btn btn-primary" @click="$router.push('/events')">Buy Now</button>
                </div>
            </div>
        </div>


        <FBCard
            :imgsrc="greensteamengineURL"
            title="TIMETABLES 2026"
            content="Find the day you'd like to visit us and click to see the timetable for that day."
            to="/timetable"
        ></FBCard>

        <FBCard
            :imgsrc="SteamSignalboxURL"
            title="SPECIAL EVENTS 2026"
            content="Answers to the questions we're often asked. If you can't find what you're looking for please don't hesitate to get in touch."
            to="/events"
        ></FBCard>

        <FBCard
            :imgsrc="SteamSignalboxURL"
            title="FAQs"
            content="Answers to the questions we're often asked. If you can't find what you're looking for please don't hesitate to get in touch."
            to="/faq"
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

    const bgstyle = computed(() => "background-image: url(" + PlanBanner + ")");
</script>