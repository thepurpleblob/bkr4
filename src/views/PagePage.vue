<template>
    <div class="container">
        <div v-if="validcontent">
            <h1 v-html="title" class="text-center mb-4 text-3xl font-bold tracking-tight text-heading "></h1>
            <CarouselBlock v-if="carouselItems.length" :items="carouselItems" contain class="mb-4"></CarouselBlock>
            <article class="prose max-w-none" v-html="content"></article>
            <!-- <div v-html="content" class="bkrpage"></div> -->


            <div v-if="video" class="w-full overflow-hidden mt-5" >
                <div v-html="video"></div>
            </div>
        </div>
        <div v-else class="flex justify-center">
            <div  class="bg-neutral-primary-soft block max-w-sm p-6 border border-default rounded-base shadow-xs hover:bg-neutral-secondary-medium">
                Information will be available soon.
            </div>
        </div>
    </div>
</template>

<script setup>
    import { ref, watch } from 'vue';
    import { useRoute } from 'vue-router';
    import ky from 'ky';
    import CarouselBlock from '../components/CarouselBlock.vue';

    const route = useRoute();
    const content = ref('');
    const video = ref('');
    const title = ref('');
    const carouselItems = ref([]);
    const validcontent = ref(false);

    watch(() => route.params.slug, (pageslug, _, onCleanup) => {
        const controller = new AbortController();
        onCleanup(() => controller.abort());
        validcontent.value = false;
        carouselItems.value = [];
        const endpoint = import.meta.env.VITE_CMS_ENDPOINT;

        const filter = {
            slug: {
                _eq: pageslug,
            },
            status: {
                _eq: 'published',
            },
        }

        ky.get(endpoint + '/items/Page', {
            searchParams: { filter: JSON.stringify(filter), fields: '*,carousel_items.*' },
            signal: controller.signal,
        }).json()
        .then(result => {
            if (result.data.length) {
                content.value = result.data[0].Content;
                title.value = result.data[0].Title;
                video.value = result.data[0].video;
                carouselItems.value = result.data[0].carousel_items;
                validcontent.value = true;
            }
        })
        .catch(error => {
            if (!controller.signal.aborted) console.error(error);
        });
    }, { immediate: true });
</script>

<style>
    iframe {
        aspect-ratio: 16 / 9;
        width: 100% !important;
        height: auto !important;
    }
</style>