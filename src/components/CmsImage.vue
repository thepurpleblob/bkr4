<template>
    <img v-if="!loading" :src="imageurl" alt="something" class="h-auto max-w-full rounded-base"></img>
</template>

<script setup>
    import { ref, defineProps, watch, computed } from 'vue';
    import ky from 'ky';

    const props = defineProps({
        filename: String,
    });

    const file = ref({});
    const loading = ref(true);

    const imageurl = computed(() => {
        const endpoint = import.meta.env.VITE_CMS_ENDPOINT;

        return endpoint + '/assets/' + props.filename + '/' + file.value.filename_download + '?download';
    });

    watch(() => props.filename, () => {
        const endpoint = import.meta.env.VITE_CMS_ENDPOINT;

        loading.value = true;
        if (props.filename) {
            ky.get(endpoint + '/files/' + props.filename).json()
            .then(result => {
                file.value = result.data;
                loading.value = false;
            })
            .catch(error => {
                console.error(error);
            });
        }
    });
</script>