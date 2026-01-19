<template>
    <div class="mt-2">
        <MonthBlock :year="2026" :month="1"></MonthBlock>
    </div>
</template>

<script setup>
    import { ref, onMounted } from 'vue';
    import ky from 'ky';
    import MonthBlock from '../components/MonthBlock.vue';

</script>