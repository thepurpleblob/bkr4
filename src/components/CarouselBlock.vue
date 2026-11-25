<template>
    <div v-if="slides.length" :id="carouselId" ref="carouselElement" class="relative z-0 w-full">
        <!-- Carousel wrapper -->
        <div class="relative h-56 overflow-hidden rounded-base md:h-96">
            <div v-for="item in slides" :key="item.id" class="hidden duration-700 ease-in-out" data-carousel-item>
                <img :src="assetpath + item.image" class="absolute block w-full" :class="contain ? 'inset-0 h-full object-contain' : '-translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2'" :alt="item.alttext || ''">
            </div>
        </div>
        <!-- Slider indicators -->
        <div v-if="showIndicators" class="absolute z-30 flex -translate-x-1/2 bottom-5 left-1/2 space-x-3 rtl:space-x-reverse">
            <button v-for="(item, index) in slides" :key="item.id" type="button" class="w-3 h-3 rounded-base" :class="activeIndex === index ? 'bg-white dark:bg-gray-800' : 'bg-white/50 dark:bg-gray-800/50 hover:bg-white dark:hover:bg-gray-800'" :aria-current="activeIndex === index" :aria-label="'Slide ' + (index + 1)" @click="carousel?.slideTo(index)"></button>
        </div>
        <!-- Slider controls -->
        <button type="button" class="absolute top-0 start-0 z-30 flex items-center justify-center h-full px-4 cursor-pointer group focus:outline-none" @click="carousel?.prev()">
            <span class="inline-flex items-center justify-center w-10 h-10 rounded-base group-focus:ring-4 group-focus:ring-white dark:group-focus:ring-gray-800/70 group-focus:outline-none" :class="contain ? 'bg-neutral-800/60 group-hover:bg-neutral-800/80' : 'bg-white/30 dark:bg-gray-800/30 group-hover:bg-white/50 dark:group-hover:bg-gray-800/60'">
                <svg class="w-5 h-5 text-white rtl:rotate-180" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24"><path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m15 19-7-7 7-7"/></svg>
                <span class="sr-only">Previous</span>
            </span>
        </button>
        <button type="button" class="absolute top-0 end-0 z-30 flex items-center justify-center h-full px-4 cursor-pointer group focus:outline-none" @click="carousel?.next()">
            <span class="inline-flex items-center justify-center w-10 h-10 rounded-base group-focus:ring-4 group-focus:ring-white dark:group-focus:ring-gray-800/70 group-focus:outline-none" :class="contain ? 'bg-neutral-800/60 group-hover:bg-neutral-800/80' : 'bg-white/30 dark:bg-gray-800/30 group-hover:bg-white/50 dark:group-hover:bg-gray-800/60'">
                <svg class="w-5 h-5 text-white rtl:rotate-180" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24"><path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m9 5 7 7-7 7"/></svg>
                <span class="sr-only">Next</span>
            </span>
        </button>
    </div>
</template>

<script setup>
    import { computed, onMounted, ref, shallowRef, useId, watch } from 'vue';
    import ky from 'ky';
    import { Carousel } from 'flowbite';

    const props = defineProps({
        items: {
            type: Array,
            default: null,
        },
        contain: {
            type: Boolean,
            default: false,
        },
        showIndicators: {
            type: Boolean,
            default: true,
        },
    });

    const homeItems = ref([]);
    const slides = computed(() => props.items ?? homeItems.value);
    const carouselElement = ref(null);
    const carousel = shallowRef(null);
    const carouselId = useId();
    const activeIndex = ref(0);
    const assetpath = import.meta.env.VITE_CMS_ENDPOINT + '/assets/';

    watch([slides, carouselElement], ([items, element], _, onCleanup) => {
        if (!items.length || !element) return;

        const elements = element.querySelectorAll('[data-carousel-item]');
        const instance = new Carousel(element,
            Array.from(elements, (el, position) => ({ el, position })),
            { onChange: current => { activeIndex.value = current.getActiveItem().position; } }
        );
        carousel.value = instance;
        instance.cycle();
        onCleanup(() => {
            instance.pause();
            instance.destroyAndRemoveInstance();
            carousel.value = null;
        });
    }, { flush: 'post' });

    onMounted(() => {
        if (props.items !== null) return;

        const endpoint = import.meta.env.VITE_CMS_ENDPOINT;

        const filter = {
            status: {
                _eq: 'published',
            },
        };
        ky.get(endpoint + '/items/carousel?filter=' + JSON.stringify(filter)).json()
        .then(result => {
            homeItems.value = result.data;
        })
        .catch(error => {
            console.error(error);
        });
    });
</script>