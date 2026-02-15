<template>
    <div class="mt-2">
        <FBAlert
            v-if="page.noticetype != 'off'"
            :heading="page.noticeheading"
            :content="page.notice"
            :link="page.noticelink"
        ></FBAlert>

        <h1 class="text-center text-4xl font-bold text-heading mb-3">A great day out the old fashioned way.</h1>

        <CarouselBlock></CarouselBlock>

        <div class="my-4 grid grid-cols-3 gap-2 justify-items-center">
            <FBCard
                :imgsrc="greensteamengineURL"
                title="TIMETABLES 2026"
                content="Find the day you'd like to visit us and click to see the timetable for that day."
                to="/timetable"
            ></FBCard>

            <FBCard
                :imgsrc="museumURL"
                title="PLAN YOUR VISIT"
                content="Find out about fares, bookings and how to get here."
                to="/plan"
            ></FBCard>

            <FBCard
                :imgsrc="museumURL"
                title="MUSEUM OF SCOTTISH RAILWAYS"
                content="Visit Scotland's largest railway museum."
                to="/museum"
            ></FBCard>
        </div>

        <div class="w-full overflow-hidden" >
            <div v-html="page.video"></div>
        </div>
    </div>
</template>

<script setup>
    import { ref, onMounted } from 'vue';
    import ky from 'ky';
    import CarouselBlock from '../components/CarouselBlock.vue';
    import FBAlert from '../flowbite/FBAlert.vue';
    import FBCard from '../flowbite/FBCard.vue';

    // Images
    import greensteamengineURL from '../assets/greensteamengine.jpg';
    import museumURL from '../assets/museum.png';

    const loading = ref(true);
    const page = ref({});
    const alertclass = ref('alert-info');

    /**
     * Get alert class from noticetype.
     * (Shouldn't be this hard)
     */
    function get_alertclass(noticetype) {
        if (noticetype == 'info') {
            return 'alert-info';
        }
        if (noticetype == 'warning') {
            return 'alert-warning';
        }

        return '';
    }

    onMounted(() => {
        const endpoint = import.meta.env.VITE_CMS_ENDPOINT;
        loading.value = true;

        ky.get(endpoint + '/items/homepage').json()
        .then((result) => {
            page.value = result.data;
            loading.value = false;
            if (page.value.noticetype != 'off') {
                alertclass.value = get_alertclass(page.value.noticetype);
                console.log(alertclass.value);
            }
        })
        .catch(error => {
            console.error(error);
        });
    });
</script>

<style>
    iframe {
        aspect-ratio: 16 / 9;
        width: 100% !important;
        height: auto !important;
    }
</style>
