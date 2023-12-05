<script lang="ts">
</script>


<header>
    <div>Let's f goooo</div>
    <a href="/play">Play</a>
</header>

<div class="page-container">
    <main class="padding">
        <slot />
    </main>
</div>

<style lang="postcss">
    header {
        width: 100%;
        height: 75px;
        display: flex;
        justify-content: start;
        align-items: center;
        gap: 20px;
    }

    
    .page-container {
        height: 100%;
        overflow: hidden;
    }
</style>
