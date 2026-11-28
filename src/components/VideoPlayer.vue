<template>
    <div data-vjs-player>
        <video ref="videoElement" class="video-js vjs-big-play-centered" :aria-label="label" playsinline></video>
    </div>
</template>

<script setup>
    import { onBeforeUnmount, onMounted, ref, watch } from 'vue';
    import videojs from 'video.js';
    import 'video.js/dist/video-js.css';

    const props = defineProps({
        src: {
            type: String,
            required: true,
        },
        label: {
            type: String,
            default: 'Video',
        },
    });

    const videoElement = ref(null);
    let player;

    onMounted(() => {
        player = videojs(videoElement.value, {
            autoplay: true,
            controls: true,
            fluid: true,
            loop: true,
            muted: true,
            preload: 'metadata',
            sources: [{ src: props.src, type: 'video/mp4' }],
        });
    });

    watch(() => props.src, src => {
        if (player) player.src({ src, type: 'video/mp4' });
    });

    onBeforeUnmount(() => {
        if (player) player.dispose();
    });
</script>
