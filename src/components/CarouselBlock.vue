<template>
    <div id="homepage-carousel" class="relative w-full -z-10" data-carousel="slide">
        <!-- Carousel wrapper -->
        <div class="relative h-56 overflow-hidden rounded-base md:h-96">
            <div  v-for="item in items" class="hidden duration-700 ease-in-out" :data-carousel-item="item.active">
                <img :src="assetpath + item.image" class="absolute block w-full -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2" alt="...">
            </div>
        </div>
        <!-- Slider indicators -->
        <div class="absolute z-30 flex -translate-x-1/2 bottom-5 left-1/2 space-x-3 rtl:space-x-reverse">
            <button v-for="item in items" type="button" class="w-3 h-3 rounded-base" :aria-current="item.active == 'active'" :aria-label="'Slide' + item.count" data-carousel-slide-to="0"></button>
        </div>
        <!-- Slider controls -->
        <button type="button" class="absolute top-0 start-0 z-30 flex items-center justify-center h-full px-4 cursor-pointer group focus:outline-none" data-carousel-prev>
            <span class="inline-flex items-center justify-center w-10 h-10 rounded-base bg-white/30 dark:bg-gray-800/30 group-hover:bg-white/50 dark:group-hover:bg-gray-800/60 group-focus:ring-4 group-focus:ring-white dark:group-focus:ring-gray-800/70 group-focus:outline-none">
                <svg class="w-5 h-5 text-white rtl:rotate-180" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24"><path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m15 19-7-7 7-7"/></svg>
                <span class="sr-only">Previous</span>
            </span>
        </button>
        <button type="button" class="absolute top-0 end-0 z-30 flex items-center justify-center h-full px-4 cursor-pointer group focus:outline-none" data-carousel-next>
            <span class="inline-flex items-center justify-center w-10 h-10 rounded-base bg-white/30 dark:bg-gray-800/30 group-hover:bg-white/50 dark:group-hover:bg-gray-800/60 group-focus:ring-4 group-focus:ring-white dark:group-focus:ring-gray-800/70 group-focus:outline-none">
                <svg class="w-5 h-5 text-white rtl:rotate-180" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24"><path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m9 5 7 7-7 7"/></svg>
                <span class="sr-only">Next</span>
            </span>
        </button>
    </div>
</template>

<script setup>
    import { ref, onMounted } from 'vue';
    import ky from 'ky';
    import { initCarousels } from 'flowbite';

    const items = ref([]);
    const assetpath = import.meta.env.VITE_CMS_ENDPOINT + '/assets/';

    onMounted(() => {
        const endpoint = import.meta.env.VITE_CMS_ENDPOINT;

        const filter = {
            status: {
                _eq: 'published',
            },
        };
        ky.get(endpoint + '/items/carousel?filter=' + JSON.stringify(filter)).json()
        .then(result => {
            items.value = result.data;
            let active = true;
            let slidecount = 1;
            items.value.forEach(item => {
                item.active = active ? "active" : "";
                active = false;
                item.count = slidecount++;
            });

            // Delay initialization by 500 milliseconds (0.5 seconds)
            setTimeout(() => {
                initCarousels();
            }, 500);
        })
        .catch(error => {
            console.error(error);
        });
    });
</script>