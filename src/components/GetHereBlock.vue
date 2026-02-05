<template>
    <div class="card lg:card-side bg-base-100 shadow-sm">
        <figure>
            <img
            class="object-right"
            :src="bkrguard"
            alt="BKR Guard" />
        </figure>
        <div class="card-body">
            <h2 class="card-title text-2xl font-bold text-headin">How to get here</h2>
            <hr class="h-px my-3 bg-neutral-quaternary border-0">
            <div class="grid grid-cols-1 sm:grid-cols-2">
                <div>
                    <h3 class="text-xl font-bold text-heading">Our address:</h3>
                    <p class="my-3 text-base">
                        <b>The Bo'ness and Kinneil Railway</b><br />
                        Bo'ness Station<br />
                        Union Street<br />
                        Bo'ness<br />
                        EH51 9AQ
                    </p>
                </div>
                <div>
                    <h3 class="text-xl font-bold text-heading">By Car</h3>
                    <p class="mb-3 text-base">
                        Bo'ness station is in the town centre and has lots of free parking.
                        From the M9 take J5 or J3 then follow the brown tourist signs
                        to Bo'ness and the railway. Satnav - EH51 9AQ.
                    </p>
                    <h3 class="text-xl font-bold text-heading">By bus from Edinburgh</h3>
                    <p class="mb-3 text-base">
                        Visit <a href="https://www.citylink.co.uk/" target="_citylink" class="text-fg-brand hover:underline">Scottish Citylink</a>
                    </p>
                    <h3 class="text-xl font-bold text-heading">By train and bus</h3>
                    <p class="text-base">
                        Linlithgow is the nearest mainline station. Visitors should alight here and 
                        make their way to Linlithgow Cross and the bus stop outside The Four Marys
                        pub. Please see <a href="https://www.travelinescotland.com/" target="_traveline" class="text-fg-brand hover:underline">Traveline Scotland</a>
                        or call 0871 200 2233 for information about bus services.
                    </p>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
    import bkrguard from '@/assets/bkrguard.jpg'
</script>