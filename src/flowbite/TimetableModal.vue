<template>
    <div id="timetable-modal" tabindex="-1" class="fixed top-0 left-0 right-0 z-50 hidden w-full p-4 overflow-x-hidden overflow-y-auto md:inset-0 h-[calc(100%-1rem)] max-h-full">
        <div class="relative w-full max-w-lg max-h-full">
            <!-- Modal content -->
            <div v-if="props.show" class="relative bg-neutral-primary-soft border border-default rounded-base shadow-sm p-4 md:p-6">
                <!-- Modal header -->
                <div class="flex items-center justify-between border-b border-default pb-4 md:pb-5">
                    <h3 class="text-lg font-medium text-heading">
                        <CalButton :color="color" class="mr-2">&nbsp;</CalButton>
                        {{ timetable.Title }}
                    </h3>
                    <button type="button" class="text-body bg-transparent hover:bg-neutral-tertiary hover:text-heading rounded-base text-sm w-9 h-9 ms-auto inline-flex justify-center items-center" data-modal-hide="timetable-modal" @click="close_modal">
                        <svg class="w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24"><path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18 17.94 6M18 18 6.06 6"/></svg>
                        <span class="sr-only">Close modal</span>
                    </button>
                </div>
                <!-- Modal body -->
                <div class="space-y-4 md:space-y-6 py-4 md:py-6 overflow-x-auto">
                    <div>
                        <CmsImage :filename="timetable.image" />
                    </div>
                    <table class="w-full text-left">
                        <thead class="bg-neutral-secondary-soft border-b border-default">
                            <tr>
                                <th scope="col" >&nbsp;</th>
                                <th scope="col" >&nbsp;</th>
                                <th v-for="service in timetable.Service" scope="col">{{ service.Traction }}</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <th>Bo'ness</th>
                                <td>{{ d }}</td>
                                <td v-for="service in timetable.Service" class="font-mono">{{ t(service.UpBoness) }}</td>
                            </tr>
                            <tr>
                                <th>Kinneil</th>
                                <td>{{ d }}</td>
                                <td v-for="service in timetable.Service" class="font-mono">{{ t(service.UpKinneil) }}</td>
                            </tr>
                            <tr>
                                <th>Birkhill</th>
                                <td>{{ d }}</td>
                                <td v-for="service in timetable.Service" class="font-mono">{{ t(service.UpBirkhill) }}</td>
                            </tr>
                            <tr>
                                <th>Manuel</th>
                                <td>{{ a }}</td>
                                <td v-for="service in timetable.Service" class="font-mono">{{ t(service.UpManuel) }}</td>
                            </tr>
                            <tr>
                                <td :colspan="numberofservices + 2"><hr class="h-px my-4 bg-neutral-quaternary border-0"></td>
                            </tr>
                            <tr>
                                <th>Manuel</th>
                                <td>{{ d }}</td>
                                <td v-for="service in timetable.Service" class="font-mono">{{ t(service.DownManuel) }}</td>
                            </tr>
                            <tr>
                                <th>Birkhill</th>
                                <td>{{ d }}</td>
                                <td v-for="service in timetable.Service" class="font-mono">{{ t(service.DownBirkhill) }}</td>
                            </tr>
                            <tr>
                                <th>Kinneil</th>
                                <td>{{ d }}</td>
                                <td v-for="service in timetable.Service" class="font-mono">{{ t(service.DownKinneil) }}</td>
                            </tr>
                            <tr>
                                <th>Bo'ness</th>
                                <td>{{ a }}</td>
                                <td v-for="service in timetable.Service" class="font-mono">{{ t(service.DownBoness) }}</td>
                            </tr>
                        </tbody>
                    </table>
                    <p>{{ timetable.Info }}</p>
                </div>
                <!-- Modal footer -->
                <div class="flex items-center border-t border-default space-x-4 pt-4 md:pt-5">
                    <FButton color="warning" @click="close_modal">Close</FButton>
                </div>
            </div>
        </div>
    </div>

    <div>{{ props.show }}</div>
</template>

<script setup>
    import { ref, defineProps, defineEmits, watch, computed } from 'vue';
    import ky from 'ky';
    import { Modal } from 'flowbite';
    import FButton from './FButton.vue';
    import CalButton from './CalButton.vue';
    import CmsImage from '../components/CmsImage.vue';

    const props = defineProps({
        show: Boolean,
        id: Number,
        single: Boolean,
        color: String,
    });

    const emits = defineEmits([
        'close',
    ]);

    const timetable = ref({});

    const dots = '<svg class="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">'
        + '<path stroke="currentColor" stroke-linecap="round" stroke-width="2" d="M6 12h.01m6 0h.01m5.99 0h.01"/>'
        + '</svg>';

    const numberofservices = computed(() => {
        if ("Service" in timetable.value) {
            const services = timetable.value.Service;

            return services.length;
        } else {

            return 0;
        }
    });

    const d = computed(() => {
        return props.single ? 'd.' : 'depart';
    });

    const a = computed(() => {
        return props.single ? 'a.' : 'arrive';
    });

    const imageurl = computed(() => {
        const endpoint = import.meta.env.VITE_CMS_ENDPOINT;

        return endpoint + '/assets/' + timetable.value.image + '?download';
    });

    /**
     * Reformat times
     */
    function t(oldtime) {
        if (oldtime == null) {
            return '- -';
        } else {
            return oldtime.substring(0, 5);
        }
    }

    // Get the data for the specified Timetable.
    function get_timetable() {
        const endpoint = import.meta.env.VITE_CMS_ENDPOINT;
        timetable.value = {};

        ky.get(endpoint + '/items/Timetable/' + props.id).json()
        .then(result => {
            console.log(result);
            timetable.value = result.data;
        })
        .catch(error => {
            console.log(error);
        });
    }

    watch(() => props.show, (newshow) => {
        console.log('Show is now ', newshow);

        // set the modal menu element
        const $targetEl = document.getElementById('timetable-modal');
        const options = {
            closable: false,
        };
        const modal = new Modal($targetEl, options);

        if (newshow) {
            modal.show();
            get_timetable();
        } else {
            modal.hide();
        }
    });

    function close_modal() {
        emits('close');
    }
</script>