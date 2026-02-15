<template>


<footer class="bg-neutral-primary-soft">
    <hr class="my-6 border-default sm:mx-auto lg:my-8" />
    <div class="mx-auto w-full max-w-screen-xl p-4 py-6 lg:py-8">
          <div class="grid grid-cols-2 gap-8 sm:gap-6 sm:grid-cols-3">
              <div>
                <h2 class="mb-6 text-sm font-semibold text-heading uppercase">Contact us</h2>
                <p>
                    <b>Scottish Railway Preservation Society</b><br/>
                    operators of Bo'ness & Kinneil Railway and Museum of Scottish Railways,
                    is a Scottish Charity, SC002375, regulated by the Scottish Charity Regulator (OSCR)
                </p>
                <ul class="text-body font-medium mt-4">
                    <li>
                        <a href="tel:01506825855">
                            <Icon icon="streamline-freehand:phone-retro-1" class="inline" width="1.2em" height="1.2em" /> 01506 825855
                        </a>
                    </li>
                    <li>
                        <a href="mailto:enquiries.railway@srps.org.uk">
                            <Icon icon="streamline-freehand:email-action-download" class="inline" width="1.2em" height="1.2em" /> enquiries.railway@srps.org.uk
                        </a>
                    </li>
                </ul>
                <p class="mt-4"><a href="https://bkrailway.us3.list-manage.com/subscribe?u=39208c212e4ffc9b9f7acd39a&id=5eaf26d110" target="_mailchimp" class="text-fg-brand hover:underline">
                    <b>Join our mailing list...</b>
                </a></p>
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
                  <h2 class="mb-6 text-sm font-semibold text-heading uppercase">Important</h2>
                  <ul class="text-body font-medium">
                      <li>
                          <RouterLink to="/faq" class="hover:underline">FAQs</RouterLink>
                      </li>
                      <li>
                          <RouterLink to="/page/dp" class="hover:underline">Data Protection Policy</RouterLink>
                      </li>
                      <li>
                          <RouterLink to="/page/accessibility" class="hover:underline">Accessibility Guide</RouterLink>
                      </li>
                      <li>
                          <RouterLink to="/page/company" class="hover:underline">Company Details</RouterLink>
                      </li>
                      <li>
                          <a href="https://bkrailway.digitickets.co.uk/pages/terms" class="hover:underline">Terms &amp; Conditions</a>
                      </li>
                  </ul>
              </div>
          </div>
      <hr class="my-6 border-default sm:mx-auto lg:my-8" />
      <div class="sm:flex sm:items-center sm:justify-between">
          <span class="text-sm text-body sm:text-center">© {{ year }} <a href="https://www.srps.org.uk/" class="hover:underline">SRPS</a>. All Rights Reserved.
          </span>
          <div class="flex mt-4 sm:justify-center sm:mt-0">
            <a href="https://www.facebook.com/BonessKinneilRailway/" class="text-body hover:text-heading">
                <Icon icon="streamline-logos:facebook-logo-2-solid" width="1.2em" height="1.2em" />
                <span class="sr-only">Facebook page</span>
            </a>
            <a href="https://www.instagram.com/bonesskinneilrailway/" class="text-body hover:text-heading ms-5">
                <Icon icon="streamline-logos:instagram-logo-2-solid" width="1.2em" height="1.2em" />
                <span class="sr-only">Instagram</span>
            </a>
            <a href="https://twitter.com/bonessrailway" class="text-body hover:text-heading ms-5">
                <Icon icon="streamline-logos:x-twitter-logo-solid" width="1.2em" height="1.2em" />
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
    import { Icon } from '@iconify/vue';

    const year = new Date().getFullYear();
</script>