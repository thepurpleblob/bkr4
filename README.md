# Vue 3 + Vite

This template should help get you started developing with Vue 3 in Vite. The template uses Vue 3 `<script setup>` SFCs, check out the [script setup docs](https://v3.vuejs.org/api/sfc-script-setup.html#sfc-script-setup) to learn more.

Learn more about IDE Support for Vue in the [Vue Docs Scaling up Guide](https://vuejs.org/guide/scaling-up/tooling.html#ide-support).
# bkr4

Social sharing previews are generated during `npm run build` from published CMS
pages, events and specials. The build requires `VITE_CMS_ENDPOINT` and access to
the CMS. Rebuild and deploy after changing CMS content to update previews;
social platforms may also cache older previews. Pages without a carousel or
matching event image use the default railway image. The Nginx configuration
serves the generated metadata for page URLs.
