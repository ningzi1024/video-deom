<template>
    <div class="login-info-wrap">
        <h1>这是个弹出框</h1>
    </div>
</template>

<script>

export default {
    name: 'login-info',
    props:{
        value:{
            type: [Boolean,Number],
            default: false
        }
    }
}
</script>

<style lang="stylus">
    .login-info-wrap
        width 200px
        height 400px
        border 1px solid rgba(120,23,56,0.6)
        display none
        overflow hidden

        h1
            width 100px
    .show
        display inline-block
</style>