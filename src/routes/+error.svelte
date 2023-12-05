<script lang="ts">
  import { page } from '$app/stores';
  import logo from '$lib/assets/images/logo.svg';
</script>

<main class="error-page flex-center">
  <div class="flex-center flex-column">
    <img src={logo} id="logo" alt="logo" />
    <h2>Nothing to find here</h2>
    <h3>{$page.error?.message}</h3>
    <a class="primary-button" href="/">Let's GO back</a>
  </div>
</main>

<style lang="postcss">
  #logo {
    width: 175px;
    height: 175px;
    object-fit: contain;
    margin-bottom: 15px;
  }

  h2 {
    font-size: 30px;
    font-family: var(--fontFamilyAlt);
  }

  h3 {
    font-size: 22px;
    font-family: var(--fontFamilyAlt);
    margin-bottom: 20px;
  }
</style>
