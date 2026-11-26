<template>
    <section aria-labelledby="santa-availability-heading">
        <h2 id="santa-availability-heading" class="text-center text-2xl font-bold mb-2">Seat availability</h2>
        <p v-if="loading" role="status" class="text-center">Loading availability...</p>
        <p v-else-if="error" role="alert" class="text-center">Availability is temporarily unavailable. Please try again later.</p>
        <p v-else-if="!availability.dates.length" class="text-center">No availability information is currently available.</p>
        <template v-else>
            <p class="text-center mb-3">Updated {{ formatUpdated(availability.updatedAt) }}</p>
            <div class="overflow-x-auto">
                <table class="availability-table">
                    <thead>
                        <tr>
                            <th scope="col">Date</th>
                            <th v-for="time in availability.times" :key="time" scope="col">{{ time }}</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="day in availability.dates" :key="day.date">
                            <th scope="row">{{ formatDate(day.date) }}</th>
                            <td v-for="time in availability.times" :key="time" :class="day.levels[time] || 'not-applicable'">
                                {{ labels[day.levels[time]] || 'N/A' }}
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </template>
    </section>
</template>

<script setup>
    import { onMounted, ref } from 'vue';
    import ky from 'ky';

    const loading = ref(true);
    const error = ref(false);
    const availability = ref(null);
    const labels = {
        good: 'Good',
        limited: 'Limited',
        'very-low': 'Very Low',
        'sold-out': 'Sold Out',
        unknown: 'Unavailable',
    };

    function formatDate(date) {
        return new Intl.DateTimeFormat('en-GB', { weekday: 'short', day: 'numeric', month: 'short', timeZone: 'UTC' })
            .format(new Date(`${date}T00:00:00Z`));
    }

    function formatUpdated(date) {
        return new Intl.DateTimeFormat('en-GB', {
            dateStyle: 'medium', timeStyle: 'short', timeZone: 'Europe/London',
        }).format(new Date(date));
    }

    onMounted(async () => {
        try {
            const result = await ky.get('/api/santa-availability', { retry: 0 }).json();
            if (!result || !Array.isArray(result.dates) || !Array.isArray(result.times) ||
                typeof result.updatedAt !== 'string' || Number.isNaN(Date.parse(result.updatedAt)) ||
                result.dates.some(day => !day || typeof day.date !== 'string' || !day.levels || typeof day.levels !== 'object')) {
                throw new Error('Invalid availability response');
            }
            availability.value = result;
        } catch (cause) {
            console.error('Unable to load Santa availability:', cause);
            error.value = true;
        } finally {
            loading.value = false;
        }
    });
</script>

<style scoped>
    .availability-table {
        width: 100%;
        border-collapse: collapse;
        text-align: center;
    }
    .availability-table th, .availability-table td {
        border: 1px solid #d5bd79;
        padding: 0.65rem;
        white-space: nowrap;
    }
    .availability-table thead {
        background: #00432f;
        color: #f0c350;
    }
    .availability-table tbody th { background: #f2e7d0; color: #00432f; }
    .availability-table td { font-weight: bold; }
    .good { background: #397b42; color: white; }
    .limited { background: #edbe41; color: #003e2b; }
    .very-low { background: #a11d37; color: white; }
    .sold-out { background: #6f1c2c; color: white; }
    .unknown, .not-applicable { background: #d3d0ca; color: #333; }
</style>
