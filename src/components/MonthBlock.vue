<template>
    <div class="bg-neutral-100 block max-w-sm p-6 border border-default rounded-base shadow-xs">
        <div class="flex justify-between mb-2">
            <div>
                <FButton @click="monthdown" color="tertiary">
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
                <FButton @click="monthup" color="tertiary">
                    <svg class="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                        <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m9 5 7 7-7 7"/>
                    </svg>
                </FButton>
            </div>
        </div>
        <table class="w-full">
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
                <tr v-for="rown in 5" class="mb-1">
                    <td v-for="dayn in 7">

                        <CalendarCell :item="cmsdays[ (rown - 1) * 7 + dayn]"></CalendarCell>
                    </td>
                </tr>
            </tbody>
        </table>
    </div>
</template>

<script setup>
    import { ref, defineProps, onMounted, computed } from 'vue';
    import ky from 'ky';
    import FButton from '../flowbite/FButton.vue';
    import CalendarCell from './CalendarCell.vue';

    // Contains all the entries for the calendar table
    // 5x7 = 35 entries. 
    const cmsdays = ref(Array(35).fill(null));

    // Beware, January = 0.
    const props = defineProps({
        month: Number,
        year: Number,
    });

    function monthdown() {
        console.log('down');
    }

    function monthup() {
        console.log('up');
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
        return date.getDay();
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

    /**
     * Create month array
     */
    const monthdays = computed(() => {
        const days = [];

        // Pad to first day of month
        // 0 == Sunday
        const padding = firstday.value === 0 ? 6 : firstday.value - 1;
    });

    /**
     * Work out what to display in date cell.
     */
    function datecontent(dayn) {

        // Work out day of month. 
        // If out of range, then just null
        let dom = null;
        if (dayn >= firstday.value) {
            dom = dayn - firstday.value + 1;
            if (dom > daysinmonth.value) {
                dom = null;
            }
        }

        if ((dom != null) && (dom in cmsdays)) {
            return cmsdays[dom];
        } else {
            return {
                daynum: dom,
            };
        }
    }

    // Fill cmsdays array with entries for each day. May contain
    // * null (if outside of the month)
    // * { daynum: n } if a day with no services
    // * Calendar object + daynum field, if a day WITH a service. 
    function fill_cmsdays(items) {

        // Empty the array. 
        cmsdays.value = Array(35).fill(null);

        // Fill array with valid day numbers
        let day = 1;
        for (let i = firstday.value; i < daysinmonth.value + firstday.value; i++) {
            cmsdays.value[i] = {daynum: day++};
        }

        // Overwrite days with event items.
        items.forEach(item => {

            // 2026-12-01
            const daynum = Number(item.date.substring(8));
            item['daynum'] = daynum;
            cmsdays.value[daynum + firstday.value - 1] = item;
        });

        console.log(cmsdays.value);
    }

    onMounted(() => {
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
            console.log(result);
            fill_cmsdays(result.data);
        })
        .catch(error => {
            console.error(error);
        });
    });
</script>