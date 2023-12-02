<script lang="ts">
  import Tabs from "$lib/components/Tabs.svelte";

  const tabs = [
    { icon: "home", text: "Start", link: "/" },
    { icon: "menu_book", text: "Wörterbuch", link: "/worterbuch" },
    { icon: "elderly", text: "Weisheiten", link: "/weisheiten" },
    { icon: "info", text: "Über ins", link: "/ueber-uns" },
  ];
</script>

<svelte:head>
  <!-- Global site tag (gtag.js) - Google Analytics -->
</svelte:head>

<div class="page-container">
  <slot />
</div>
<Tabs {tabs} />

<style lang="scss">
  .page-container {
    height: 100%;
    overflow: hidden;
  }
</style>
