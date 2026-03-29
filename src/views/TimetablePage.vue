<template>
    <h1 class="text-center text-4xl font-bold text-heading">TIMETABLE</h1>
    <div class="text-center text-xl my-5 font-semibold">Click on a coloured square to see the full timetable for that day.</div>
    <div v-if="singlemonth && year">
        <MonthBlock :year="year" :month="monthnow" :single="true" @eventclick="event_clicked" @monthup="monthup" @monthdown="monthdown"></MonthBlock>
    </div>
    <div v-if="year && !singlemonth" class="mt-2 grid grid-cols-2 lg:grid-cols-3 gap-4 container">
        <MonthBlock v-for="month in monthlist" :year="month.year" :month="month.month" :single="false" @eventclick="event_clicked"></MonthBlock>
    </div>

    <TimetableModal :show="showmodal" :id="timetableid" :title="itemtitle" :single="singlemonth" :color="color" :inpast="dateinpast" @close="showmodal = false"></TimetableModal>
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
    const itemtitle = ref('');
    const { width, height } = useWindowSize();
    const monthlist = ref([]);
    const dateinpast = ref(false);

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
        itemtitle.value = item.Title;

        // Check if selected date is in the past (no booking)
        const now = Date.now();
        const selectdate = Date.parse(item.date);
        dateinpast.value = now > selectdate;

        showmodal.value = true;
    }


    onMounted(() => {
        const date = new Date;
        year.value = date.getFullYear();
        monthnow.value = date.getMonth();

        // Get 12 months from now.
        for (let i = 0; i <= 11; i++) {
            let iyear = year.value;
            let imonth = monthnow.value + i;
            if (imonth > 11) {
                iyear++;
                imonth = imonth - 12;
            }
            monthlist.value.push({
                month: imonth,
                year: iyear,
            });
        }
    })



</script>