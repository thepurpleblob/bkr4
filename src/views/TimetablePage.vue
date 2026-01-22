<template>
    <div class="mt-2 grid grid-cols-2 lg:grid-cols-3 container">
        <MonthBlock v-for="month in 12" :year="2026" :month="month - 1"></MonthBlock>
    </div>

    <Modal></Modal>
</template>

<script setup>
    import { ref, onMounted } from 'vue';
    import ky from 'ky';
    import MonthBlock from '../components/MonthBlock.vue';
    import Modal from '../flowbite/Modal.vue';

    const year = ref(0);


    onMounted(() => {

    })

</script>