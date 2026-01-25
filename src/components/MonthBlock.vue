<template>
    <div class="bg-neutral-100 block max-w-full md:max-w-sm p-6 border border-default rounded-base shadow-xs mb-4">
        <div class="flex justify-between mb-2">
            <div>
                <FButton v-if="single" @click="monthdown" color="tertiary">
                    <svg class="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                        <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m15 19-7-7 7-7"/>
                    </svg>
                </FButton>
            </div>
            <div>
                <FButton color="tertiary">
                    {{ monthname }} {{ year }}
                </FButton>
            </div>
            <div>
                <FButton v-if="single" @click="monthup" color="tertiary">
                    <svg class="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                        <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m9 5 7 7-7 7"/>
                    </svg>
                </FButton>
            </div>
        </div>
        <table class="w-full mb-4 table-fixed">
            <thead>
                <tr class="mb-2">
                    <th>Mon</th>
                    <th>Tue</th>
                    <th>Wed</th>
                    <th>Thu</th>
                    <th>Fri</th>
                    <th>Sat</th>
                    <th>Sun</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="rown in 6" class="mb-2">
                    <td v-for="dayn in 7">
                        <a @click.prevent="event_clicked(cmsdays[ (rown - 1) * 7 + dayn])">
                            <CalendarCell :item="cmsdays[ (rown - 1) * 7 + dayn]"></CalendarCell>
                        </a>
                    </td>
                </tr>
            </tbody>
        </table>
        <div class="grid grid-cols-2">
            <div v-for="timetable in timetables" class="flex items-center">
                <a @click.prevent="event_clicked(timetable)">
                    <CalButton :color="timetable.Color" class="mr-2">&nbsp;</CalButton> 
                </a>
                <a @click.prevent="event_clicked(timetable)">
                    {{ timetable.Title }}
                </a>
            </div>
        </div>
    </div>
</template>

<script setup>
    import { ref, defineProps, defineEmits, onMounted, computed, watch } from 'vue';
    import ky from 'ky';
    import FButton from '../flowbite/FButton.vue';
    import CalendarCell from './CalendarCell.vue';
    import CalButton from '../flowbite/CalButton.vue';

    // Contains all the entries for the calendar table
    // 5x7 = 35 entries. 
    const cmsdays = ref(Array(35).fill(null));

    // Contains entry for each different colour
    // in the month. Assumes (doesn't check) that all
    // Timetable and Title fields are the same.
    const timetables = ref({});

    // Beware, January = 0.
    const props = defineProps({
        month: Number,
        year: Number,
        single: Boolean,
    });

    const emits = defineEmits([
        'eventclick',
        'monthup',
        'monthdown',
    ]);

    function monthdown() {
        emits('monthdown');
    }

    function monthup() {
        emits('monthup');
    }

    /**
     * One of the event buttons has been clicked
     */
    function event_clicked(item) {
        emits('eventclick', item);
    }

    /**
     * Get month name from month prop.
     * Note that January == 0
     */
    const monthname = computed(() => {
        const date = new Date(props.year, props.month, 1);
        return date.toLocaleString('default', { month: 'long' });
    });

    /**
     * Get day number of start of month
     * Note, 0 == Sunday
     */
    const firstday = computed(() => {
        const date = new Date(props.year, props.month, 1);
        const daynum = date.getDay();

        return daynum;
    });

    /**
     * Is a year a leap year?
     */
    const isleapyear = computed(() => {

        // If not divisible by 4 then not a leap year.
        if ((props.year % 4) !== 0) {
            return false;
        }

        // If not divisible by 100 then IS a leap year.
        if ((props.year % 100) !== 0) {
            return true;
        }

        // If divisble by 100 then IS a leap year.
        return (props.year % 400) === 0;
    });

    /**
     * Number of days in the month
     * January == 0
     */
    const daysinmonth = computed(() => {
        const days = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
        const daycount = days[props.month];
        if ((props.month == 1) && isleapyear.value) {
            return 29;
        } else {
            return daycount;
        }
    });

    // Fill cmsdays array with entries for each day. May contain
    // * null (if outside of the month)
    // * { daynum: n } if a day with no services
    // * Calendar object + daynum field, if a day WITH a service. 
    function fill_cmsdays(items) {

        // Empty the array. 
        cmsdays.value = Array(35).fill(null);

        // Fill array with valid day numbers
        let day = 1;
        const padding = firstday.value === 0 ? 6 : firstday.value - 1;
        for (let i = padding + 1; i < daysinmonth.value + padding + 1; i++) {
            cmsdays.value[i] = {daynum: day++};
        }

        // Overwrite days with event items.
        items.forEach(item => {

            // 2026-12-01
            const daynum = Number(item.date.substring(8));
            item['daynum'] = daynum;
            cmsdays.value[daynum + padding] = item;
        });
    }

    /**
     * Get unique list of colors / descriptions 
     */
    function fill_timetable(items) {
        timetables.value = {};
        items.forEach(item => {
            timetables.value[item.Color] = item;
        });
    }

    /**
     * Watch for month or year changing
     */
    watch (() => props.month, () => {
        load_month_data();
    });

    /**
     * Load data for month
     */
    function load_month_data() {
        const endpoint = import.meta.env.VITE_CMS_ENDPOINT;

        // Filter to only get this year's calendar entries
        const filter = {
            "year(date)": {
                _eq: props.year,
            },
            "month(date)": {
                _eq: props.month + 1,
            }
        };

        ky.get(endpoint + '/items/Calendar?limit=-1&filter=' + JSON.stringify(filter)).json()
        .then(result => {
            fill_cmsdays(result.data);
            fill_timetable(result.data);
        })
        .catch(error => {
            console.error(error);
        });
    }

    onMounted(() => {
        load_month_data();
    });
</script>