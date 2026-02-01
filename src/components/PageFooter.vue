<template>


<footer class="bg-neutral-primary-soft">
    <hr class="my-6 border-default sm:mx-auto lg:my-8" />
    <div class="mx-auto w-full max-w-screen-xl p-4 py-6 lg:py-8">
        <div class="md:flex md:justify-between">
          <div class="mb-6 md:mb-0">
              <a href="https://www.srps.org.uk/" class="flex items-center">
                  <img :src="SRPSLogo" class="h-12 me-3" alt="SRPS Logo" />
                  <span class="text-heading self-center text-2xl font-semibold whitespace-nowrap">SRPS</span>
              </a>
          </div>
          <div class="grid grid-cols-2 gap-8 sm:gap-6 sm:grid-cols-3">
              <div>
                <h4>The Scottish Railway Preservation Society</h4>
                <p>
                    operators of Bo'ness & Kinneil Railway and Museum of Scottish Railways,
                    is a Scottish Charity, SC002375, regulated by the Scottish Charity Regulator (OSCR)
                </p>                
              </div>
              <div>
                  <h2 class="mb-6 text-sm font-semibold text-heading uppercase">SRPS Sites</h2>
                  <ul class="text-body font-medium">
                      <li>
                          <a href="https://www.srps.org.uk/" class="hover:underline">Scottish Railway Preservation Society</a>
                      </li>
                      <li>
                          <a href="https://www.srps.org.uk/railtours/" class="hover:underline">SRPS Railtours</a>
                      </li>
                      <li>
                          <a href="https://shop.srps.org.uk/" class="hover:underline">SRPS Online Shop</a>
                      </li>
                      <li>
                          <a href="http://www.srpsdiesel.co.uk/" class="hover:underline">SRPS Diesel Group</a>
                      </li>
                      <li>
                          <a href="https://www.srpssteam.com/" class="hover:underline">SRPS Steam Group</a>
                      </li>
                      <li>
                          <a href="https://www.gotopcs.net/" class="hover:underline">SRPS Carriage & Wagon Group</a>
                      </li>
                      <li>
                          <a href="https://www.srpsbirkhillgroup.org.uk/" class="hover:underline">SRPS Birkhill Station Development</a>
                      </li>
                  </ul>
              </div>
              <div>
                  <h2 class="mb-6 text-sm font-semibold text-heading uppercase">Legal</h2>
                  <ul class="text-body font-medium">
                      <li class="mb-4">
                          <RouterLink to="/page/dp" class="hover:underline">Data Protection Policy</RouterLink>
                      </li>
                      <li class="mb-4">
                          <RouterLink to="/page/company" class="hover:underline">Company Details</RouterLink>
                      </li>
                      <li>
                          <a href="https://bkrailway.digitickets.co.uk/pages/terms" class="hover:underline">Terms &amp; Conditions</a>
                      </li>
                  </ul>
              </div>
          </div>
      </div>
      <hr class="my-6 border-default sm:mx-auto lg:my-8" />
      <div class="sm:flex sm:items-center sm:justify-between">
          <span class="text-sm text-body sm:text-center">© {{ year }} <a href="https://www.srps.org.uk/" class="hover:underline">SRPS</a>. All Rights Reserved.
          </span>
          <div class="flex mt-4 sm:justify-center sm:mt-0">
            <a href="https://www.facebook.com/BonessKinneilRailway/" class="text-body hover:text-heading">
                <svg class="w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24"><path fill-rule="evenodd" d="M13.135 6H15V3h-1.865a4.147 4.147 0 0 0-4.142 4.142V9H7v3h2v9.938h3V12h2.021l.592-3H12V6.591A.6.6 0 0 1 12.592 6h.543Z" clip-rule="evenodd"/></svg>
                <span class="sr-only">Facebook page</span>
            </a>
            <a href="https://www.instagram.com/bonesskinneilrailway/" class="text-body hover:text-heading ms-5">
                <svg class="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                    <path fill="currentColor" fill-rule="evenodd" d="M3 8a5 5 0 0 1 5-5h8a5 5 0 0 1 5 5v8a5 5 0 0 1-5 5H8a5 5 0 0 1-5-5V8Zm5-3a3 3 0 0 0-3 3v8a3 3 0 0 0 3 3h8a3 3 0 0 0 3-3V8a3 3 0 0 0-3-3H8Zm7.597 2.214a1 1 0 0 1 1-1h.01a1 1 0 1 1 0 2h-.01a1 1 0 0 1-1-1ZM12 9a3 3 0 1 0 0 6 3 3 0 0 0 0-6Zm-5 3a5 5 0 1 1 10 0 5 5 0 0 1-10 0Z" clip-rule="evenodd"/>
                </svg>
                <span class="sr-only">Instagram</span>
            </a>
            <a href="https://twitter.com/bonessrailway" class="text-body hover:text-heading ms-5">
            <svg class="w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24"><path d="M13.795 10.533 20.68 2h-3.073l-5.255 6.517L7.69 2H1l7.806 10.91L1.47 22h3.074l5.705-7.07L15.31 22H22l-8.205-11.467Zm-2.38 2.95L9.97 11.464 4.36 3.627h2.31l4.528 6.317 1.443 2.02 6.018 8.409h-2.31l-4.934-6.89Z"/></svg>
            <span class="sr-only">Twitter page</span>
            </a>
          </div>
      </div>
    </div>
</footer>

</template>

<script setup>
    import { ref } from 'vue';
    import SRPSLogo from '@/assets/SRPSLogo.png';

    const year = new Date().getFullYear();
</script>