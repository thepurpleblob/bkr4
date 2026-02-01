<template>
    <h1 class="text-center text-4xl font-bold text-heading mb-8">SOMETHING SPECIAL</h1>

    <div v-for="event in events" class="card lg:card-side bg-base-100 shadow-md/20 mb-8">
        <figure>
            <CmsImage :filename="event.Image" :width="300"></CmsImage>
        </figure>
        <div class="card-body">
            <h2 class="card-title text-xl font-bold text-heading">{{ event.Title }}</h2>
            <p v-html="event.Content"></p>
            <div v-if="event.Page" class="card-actions justify-end">
                <RouterLink :to="event.Page">
                    <button class="btn btn-primary">Learn more...</button>
                </RouterLink>
            </div>
        </div>
    </div>
</template>

<script setup>
    import { ref, onMounted } from 'vue';
    import { RouterLink } from 'vue-router';
    import ky from 'ky';
    import CmsImage from '../components/CmsImage.vue';

    const events = ref([]);

    onMounted(() => {
        const endpoint = import.meta.env.VITE_CMS_ENDPOINT;

        const filter = {
            status: {
                _eq: 'published',
            },
        };

        ky.get(endpoint + '/items/Specials?filter=' + JSON.stringify(filter) + '&sort=sort').json()
        .then(result => {
            events.value = result.data;
        })
        .catch(error => {
            console.error(error);
        });
    })
</script>