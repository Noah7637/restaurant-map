<script>
    import search from "#lib/assets/search.svg";
    import reload from "#lib/assets/reload.svg";

    let { onLocationFound, onReset } = $props();
    let address = $state("");
    let isSearching = $state(false);
    let hasActiveSearch = $state(false);
    let errorMessage = $state("");
    let statusMessage = $state("");
    let searchForm;
    let requestController;
    let requestId = 0;

    async function submitSearch(event) {
        event.preventDefault();
        errorMessage = "";
        statusMessage = "";

        if (!address.trim()) {
            errorMessage = "Saisissez une adresse à rechercher.";
            return;
        }

        isSearching = true;
        const currentRequestId = ++requestId;
        requestController = new AbortController();

        try {
            const response = await fetch(`/api/geocode?q=${encodeURIComponent(address.trim())}`, {
                signal: requestController.signal
            });
            const result = await response.json();

            if (currentRequestId !== requestId) return;

            if (!response.ok) {
                throw new Error(result.message ?? "Impossible de rechercher cette adresse.");
            }

            const nearbyCount = onLocationFound(result);
            hasActiveSearch = true;
            statusMessage = `${nearbyCount} restaurant${nearbyCount === 1 ? "" : "s"} trouvé${nearbyCount === 1 ? "" : "s"} dans un rayon de 1 km.`;
        } catch (error) {
            if (currentRequestId !== requestId) return;
            errorMessage = error instanceof Error
                ? error.message
                : "Impossible de rechercher cette adresse pour le moment.";
        } finally {
            if (currentRequestId === requestId) {
                isSearching = false;
                requestController = undefined;
            }
        }
    }

    function handleSearchButton() {
        if (isSearching || hasActiveSearch) {
            requestId += 1;
            requestController?.abort();
            requestController = undefined;
            isSearching = false;
            hasActiveSearch = false;
            address = "";
            errorMessage = "";
            statusMessage = "";

            try {
                onReset();
            } catch (error) {
                errorMessage = error instanceof Error
                    ? error.message
                    : "Impossible de réinitialiser la carte.";
            }
            return;
        }

        searchForm?.requestSubmit();
    }
</script>

<div class="search-container">
    <form class="searchBar" bind:this={searchForm} onsubmit={submitSearch}>
        <img src={search} alt="" />
        <input
            type="search"
            bind:value={address}
            placeholder="Redchurch St, Shoreditch, London"
            aria-label="Adresse à rechercher"
            aria-describedby="search-status"
        />
        <p>1000 m<br />radius</p>
        <button
            type="button"
            aria-label={isSearching || hasActiveSearch ? "Annuler la recherche et afficher tous les restaurants" : "Rechercher cette adresse"}
            title={isSearching || hasActiveSearch ? "Afficher tous les restaurants" : "Rechercher"}
            onclick={handleSearchButton}
        >
            <img src={reload} alt="" />
        </button>
    </form>
    <p id="search-status" class="search-status" aria-live="polite">
        {#if isSearching}
            Recherche en cours…
        {:else if errorMessage}
            {errorMessage}
        {:else if statusMessage}
            {statusMessage}
        {/if}
    </p>
</div>

<style>
    .search-container {
        position: fixed;
        top: 20px;
        left: 50%;
        z-index: 2;
        width: min(560px, calc(100vw - 32px));
        transform: translateX(-50%);
    }

    .searchBar {
        display: flex;
        align-items: center;
        gap: 12px;
        width: 100%;
        padding: 10px 16px;
        background-color: #fffffff2;
        border: 1px solid #e4e5de;
        border-radius: 999px;
        box-shadow: 0 2px 12px rgb(0 0 0 / 12%);
    }

    .searchBar input {
        flex: 1;
        min-width: 0;
        padding: 4px 0;
        border: 0;
        outline: 0;
        background: transparent;
        font-size: 15px;
    }

    .searchBar > img,
    .searchBar button img {
        width: 20px;
        height: 20px;
        flex: 0 0 auto;
    }

    .searchBar button {
        display: grid;
        flex: 0 0 auto;
        width: 32px;
        height: 32px;
        padding: 0;
        place-items: center;
        border: 0;
        border-radius: 50%;
        background: transparent;
        cursor: pointer;
    }

    .searchBar button:hover:not(:disabled) {
        background: #f2f3ee;
    }

    .searchBar button:disabled {
        cursor: wait;
        opacity: 0.55;
    }

    .searchBar > p {
        padding: 2px 10px;
        border: 1px solid #e4e5de;
        border-radius: 9999px;
        background-color: #f2f3ee;
        color: #5e625b;
        font-size: 12px;
        line-height: 10px;
        letter-spacing: 0.8px;
    }

    .search-status {
        min-height: 18px;
        margin: 6px 12px 0;
        color: #5e625b;
        font-family: Arial, sans-serif;
        font-size: 12px;
        text-shadow: 0 1px 2px white;
    }
</style>
