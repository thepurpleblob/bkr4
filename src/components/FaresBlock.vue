<template>
    <div v-if="!loading" class="card lg:card-side bg-base-100 shadow-md/20 prose max-w-none">
        <figure>
            <img
            :src="SteamOnHillURL"
            alt="Steam train" />
        </figure>
        <div class="card-body">
            <h2 class="card-title text-2xl font-bold text-heading uppercase">FARES & BOOKINGS</h2>
            <p v-html="page.Fares" class="text-base"></p>
        </div>
    </div>
</template>

<script setup>
    import { ref, onMounted } from 'vue';
    import ky from 'ky';
    import SteamOnHillURL from '../assets/steamonhill.jpg';

    const page = ref({});
    const loading = ref(true);

    onMounted(() => {
        const endpoint = import.meta.env.VITE_CMS_ENDPOINT;
        loading.value = true;

        ky.get(endpoint + '/items/homepage').json()
        .then((result) => {
            page.value = result.data;
            loading.value = false;
        })
        .catch(error => {
            console.error(error);
        });
    });
</script>