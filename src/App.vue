<template>
    <div class="container mx-auto font-[Johnston100] max-w-screen-xl">
        <PageHeader></PageHeader>
        <main class="mt-45">
            <RouterView></RouterView>
        </main>
        <PageFooter></PageFooter>
    </div>

</template>

<script setup>
    import { onMounted } from 'vue';
    import PageHeader from './components/PageHeader.vue';
    import PageFooter from './components/PageFooter.vue';

    onMounted(() => {
    })
</script>
