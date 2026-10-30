<script>
    import plate from "#lib/assets/plate.jpg"
    let {name, tagline, neighborhood, price, rank = plate} = $props();
    let reste = 4 - price;
    let classCard = "ranked-card"
    if (rank === 1) {
        classCard = "top-pick-card"
    }
</script>

<div class="{classCard}">
    {#if rank !== null && rank !== undefined}
        <h1>{rank}</h1>
    {/if}
    <img src={plate} alt="">
    <span class="description">
        <b>{name}</b>
        <p>{tagline} · {neighborhood}</p>
    </span>
    <span>
        <span class="price">
            <p class="price-dark">
            {#each Array.from({ length: price }) as p}
                €
            {/each}
            </p>
            <p class="price-light">
                {#each Array.from({ length: reste }) as p}
                   € 
                {/each}
            </p>
            
        </span>
        {#if rank === 1}
            <p class="p-top-pick">TOP PICK</p>
        {/if}
    </span>
</div>

<style>
    .ranked-card {
        display: flex;

padding: 12px;
gap: 14px;
align-items: center;
border-radius: 16px;
}

.top-pick-card {
    display: flex;

padding: 12px;
gap: 14px;
align-items: center;
border-radius: 16px;
background-color: #FBF1E1;
border: 1px solid #EDD3A3;
border-radius: 48px;
}



    .ranked-card img, .top-pick-card img {
width: 64px;
height: 64px;
flex: 0 0 64px;
border-radius: 12px;
object-fit: cover;
    }

    .top-pick-card .p-top-pick {
        color: #B9862E;
        font-family: Inter;
font-weight: 700;
font-style: Bold;
font-size: 10px;
line-height: 15px;
letter-spacing: 0.5px;
text-align: right;

    }

    .description {
flex: 1 1 auto;
min-width: 0;
    }

    .description b {
display: block;
overflow: hidden;
color: #1c1f1a;
font-size: 15px;
font-weight: 600;
line-height: 1.3;
text-overflow: ellipsis;
white-space: nowrap;
    }

    .description p {
overflow: hidden;
margin-top: 4px;
color: #777b73;
font-family: Arial, sans-serif;
font-size: 11px;
font-weight: 400;
line-height: 1.4;
text-overflow: ellipsis;
white-space: nowrap;
    }

    .ranked-card > span:last-child, .top-pick-card > span:last-child{
display: flex;
flex: 0 0 auto;
flex-direction: column;
align-items: flex-end;
gap: 8px;
    }

    .price {
display: flex;
gap: 1px;
font-family: Arial, sans-serif;
font-size: 12px;
font-weight: 600;
    }

    .price-dark {
color: #1C1F1A;
    }

    .price-light {
color: #C9CBC3;
    }

    .ranked-card > span:last-child > p {
padding: 4px 7px;
border-radius: 999px;
background: #edf3eb;
color: #3e6b48;
font-family: Arial, sans-serif;
font-size: 8px;
font-weight: 700;
letter-spacing: 0.06em;
line-height: 1;
    }


</style>