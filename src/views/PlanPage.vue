<template>
    <h1 class="text-center text-4xl font-bold text-heading mb-8">PLAN YOUR VISIT</h1>

    <div class="mb-4">
        <FaresBlock></FaresBlock>
    </div>
    <div class="mb-4 flex gap-2 justify-evenly">

        <!-- Timetable link -->
        <div class="card bg-base-100 image-full w-96 shadow-sm">
            <figure>
                <img
                src="https://img.daisyui.com/images/stock/photo-1606107557195-0e29a4b5b4aa.webp"
                alt="Shoes" />
            </figure>
            <div class="card-body">
                <h2 class="card-title">TIMETABLES 2026</h2>
                <p>A card component has a figure, a body part, and inside body there are title and actions parts</p>
                <div class="card-actions justify-end">
                <button class="btn btn-primary" @click="$router.push('/timetable')">Buy Now</button>
                </div>
            </div>
        </div>

        <!-- FAQ link -->
        <div class="card bg-base-100 image-full w-96 shadow-sm">
            <figure>
                <img
                src="https://img.daisyui.com/images/stock/photo-1606107557195-0e29a4b5b4aa.webp"
                alt="Shoes" />
            </figure>
            <div class="card-body">
                <h2 class="card-title">FAQs</h2>
                <p>A card component has a figure, a body part, and inside body there are title and actions parts</p>
                <div class="card-actions justify-end">
                <button class="btn btn-primary" @click="$router.push('/faq')">Buy Now</button>
                </div>
            </div>
        </div>

        <!-- Events -->
        <div class="card bg-base-100 image-full w-96 shadow-sm">
            <figure>
                <img
                src="https://img.daisyui.com/images/stock/photo-1606107557195-0e29a4b5b4aa.webp"
                alt="Shoes" />
            </figure>
            <div class="card-body">
                <h2 class="card-title">EVENTS</h2>
                <p>A card component has a figure, a body part, and inside body there are title and actions parts</p>
                <div class="card-actions justify-end">
                <button class="btn btn-primary" @click="$router.push('/events')">Buy Now</button>
                </div>
            </div>
        </div>

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

        <FBCard></FBCard>

    </div>
    <GetHereBlock></GetHereBlock>
</template>

<script setup>
    import { computed } from 'vue';
    import PlanBanner from '@/assets/PlanBanner.jpg';
    import GetHereBlock from '../components/GetHereBlock.vue';
    import FaresBlock from '../components/FaresBlock.vue';
    import FBCard from '../flowbite/FBCard.vue';

    const bgstyle = computed(() => "background-image: url(" + PlanBanner + ")");
</script>