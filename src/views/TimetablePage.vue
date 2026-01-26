<template>
    <h1>Timetables</h1>
    <div v-if="singlemonth && year">
        <MonthBlock :year="year" :month="monthnow" :single="true" @eventclick="event_clicked" @monthup="monthup" @monthdown="monthdown"></MonthBlock>
    </div>
    <div v-if="year && !singlemonth" class="mt-2 grid grid-cols-2 lg:grid-cols-3 gap-4 container">
        <MonthBlock v-for="month in 12" :year="year" :month="month - 1" :single="false" @eventclick="event_clicked"></MonthBlock>
    </div>

    <TimetableModal :show="showmodal" :id="timetableid" :single="singlemonth" :color="color" @close="showmodal = false"></TimetableModal>
</template>

<script setup>
    import { ref, onMounted, computed } from 'vue';
    import { useWindowSize } from '@vueuse/core';
    import MonthBlock from '../components/MonthBlock.vue';
    import TimetableModal from '../flowbite/TimetableModal.vue';

    const year = ref(0);
    const monthnow = ref(0);
    const showmodal = ref(false);
    const timetableid = ref(0);
    const color = ref('');
    const { width, height } = useWindowSize();

    const singlemonth = computed(() => {
        return width.value < 500;
    });

    function monthup() {
        monthnow.value++;
        if (monthnow.value == 12) {
            year.value++;
            monthnow.value = 0;
        }
    }

    function monthdown() {
        monthnow.value--;
        if (monthnow.value == -1) {
            year.value--;
            monthnow.value = 11;
        }
    }

    function event_clicked(item) {
        timetableid.value = item.Timetable;
        color.value = item.Color;
        showmodal.value = true;
    }


    onMounted(() => {
        const date = new Date;
        year.value = date.getFullYear();
        monthnow.value = date.getMonth();
    })

</script>