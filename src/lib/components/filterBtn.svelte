<script>
    let { txt, isChoose = false, onSelect } = $props();
</script>

<button type="button" onclick={onSelect} class:btnActive={isChoose} class:btn={!isChoose}>{txt}</button>

<style>
    .btn,
    .btnActive {
        flex: 0 0 auto;
        white-space: nowrap;
        border-radius: 9999px;
        padding: 4px 12px;
    }

    .btnActive {
        color: white;
        background-color: #3E6B48;
        border: none;
    }

    .btn {
        background-color: #F2F3EE;
        border: 1px solid #E4E5DE;
    }

    
</style>