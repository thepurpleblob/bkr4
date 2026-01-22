<template>
    <div class="container mx-auto">
        <PageHeader></PageHeader>
        <main class="mt-45">
          <RouterView></RouterView>
        </main>
    </div>


</template>

<script setup>
    import { onMounted } from 'vue';
    import PageHeader from './components/PageHeader.vue';

    onMounted(() => {
    })
</script>
