<script>
    import closeSVG from "#lib/assets/cross.svg";
    import FilterBtn from "#lib/components/filterBtn.svelte";
    import RankedCard from "#lib/components/rankedCard.svelte";
    
    let asideOpen = $state(true);
    let { data } = $props();

    
    let selectedFilter = $state("All");
    let ranked = $state(true);
    function asideClose() {
        asideOpen = false;
    }
    let paragrapheActif = $state(1);


    function switchCard1() {
        paragrapheActif = 1;
        ranked = true;
    }

    function switchCard2() {
        paragrapheActif = 2;
        ranked = false;
    }

    function selectFilter(tag) {
        selectedFilter = tag;
    }

    let filters = $derived([
        "All",
        ...new Set(
            data.all
                .filter((restaurant) => restaurant.listing_status === "published")
                .flatMap((restaurant) => restaurant.all_tags?.split(", ") ?? [])
                .filter(Boolean)
        )
    ]);

    let visibleRestaurants = $derived(
        data.all.filter((restaurant) => {
            return (
                restaurant.listing_status === "published" &&
                restaurant.list_status === (ranked ? "ranked" : "want_to_try")
            );
        })
    );

    // let visiblefilters = $derived(
    //     visibleRestaurants.filter((tag) => {
    //         return (
    //             tag.tags.name.includes(tag.restaurants.tagline)
    //         );
    //     })
    // );
</script>

{#if asideOpen}
    <aside>
        <div class="sidebar-header">
            <h2>Tastemap.</h2>
            <button type="button" aria-label="Close sidebar" onclick={asideClose}>
                <img src={closeSVG} alt="" />
            </button>
        </div>
        <span><p>London · 1km radius · 12 places</p></span>
        <h1>Your top tables</h1>
        <p>Ranked head-to-head, so your #3 really is better than your #4 — no five-star mush.</p>
        <br><div class="ranked-try">
            <button type="button" class:active={paragrapheActif === 1} class:inactif={paragrapheActif !== 1} onclick={switchCard1}>Ranked</button>
            <button type="button" class:active={paragrapheActif === 2} class:inactif={paragrapheActif !== 2} onclick={switchCard2}>Want to try</button>
        </div>
        <div class="filters">
            {#each filters as tag}
                <FilterBtn
                    txt={tag}
                    isChoose={selectedFilter === tag}
                    onSelect={() => selectFilter(tag)}
                />
            {/each}
        </div>
        <div class="ranked-restau">
        {#each visibleRestaurants as r (r.id)}
            <RankedCard
                name={r.name}
                tagline={r.tagline}
                neighborhood={r.neighborhood}
                price={r.price_tier}
                rank={r.rank}
                image={r.all_photo_urls?.split(", ")[0]}
            />
        {/each}
        </div>
    </aside>
    
{/if}

<style>
    aside {
        position: fixed;
        inset: 0 auto 0 0;
        z-index: 1;
        display: flex;
        flex-direction: column;
        width: min(420px, 100vw);
        padding: 24px;
        overflow: hidden;
        background: #FAFAF7;
        border-right: 1px solid #E4E5DE;
    }

    .sidebar-header {
        display: flex;
        flex: 0 0 auto;
        align-items: center;
        justify-content: space-between;
    }

    aside button {
        padding: 0;
        border: 0;
        background: none;
        cursor: pointer;
    }

    aside img {
        width: 20px;
        height: 20px;
    }

    aside span {
        display: block;
        flex: 0 0 auto;
        margin-top: 32px;
    }

    aside h1 {
        flex: 0 0 auto;
        margin-top: 24px;
    }

    aside h1 + p {
        flex: 0 0 auto;
        margin-top: 8px;
    }

    .filters {
        border-bottom: 1px solid #E4E5DE99;
        padding: 13px 0px;
        display: flex;
        flex: 0 0 auto;
        gap: 12px;
        overflow-x: scroll;
        scrollbar-width: none;
    }

    .ranked-restau {
        display: flex;
        flex: 1 1 auto;
        flex-direction: column;
        min-height: 0;
        gap: 5px;
        overflow-y: auto;
        overscroll-behavior: contain;
        scrollbar-width: none;
    }

    .ranked-try {
        display: flex;
        gap: 10px;
    }

    .ranked-try button {
        padding: 0 0 4px;
        border: 0;
        background: none;
        font: inherit;
        cursor: pointer;
    }

    .ranked-try .active {
        border-bottom: solid black 1px;

    }

    .ranked-try .inactif {
        color: #9A9D95;
    }

    .ranked-try .inactif:hover {
        border-bottom: solid #9A9D95 1px;
        cursor: pointer;
    }

</style>