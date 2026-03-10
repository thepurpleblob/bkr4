<template>
    <div class="container">
        <div v-if="validcontent">
            <h1 v-html="title" class="text-center mb-4 text-3xl font-bold tracking-tight text-heading "></h1>
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
    import { ref, onMounted } from 'vue';
    import { RouterLink, useRoute } from 'vue-router';
    import ky from 'ky';

    const route = useRoute();
    const content = ref('');
    const video = ref('');
    const title = ref('');
    const validcontent = ref(false);

    onMounted(() => {
        const pageslug = route.params.slug;
        const endpoint = import.meta.env.VITE_CMS_ENDPOINT;

        const filter = {
            slug: {
                _eq: pageslug,
            },
            status: {
                _eq: 'published',
            },
        }

        ky.get(endpoint + '/items/Page?filter=' + JSON.stringify(filter)).json()
        .then(result => {
            if (result.data.length) {
                content.value = result.data[0].Content;
                title.value = result.data[0].Title;
                video.value = result.data[0].video;
                validcontent.value = true;
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