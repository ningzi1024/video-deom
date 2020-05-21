<template>
    <div class="home-wrap">
        <h1>home page</h1>
        <el-button @click="$router.push('/login')" type="success">登录</el-button>
    </div>
</template>

<script>
import { Button } from 'element-ui'
export default {
    name: 'home',
    components: {
        [Button.name]: Button
    }
}
</script>

<style lang="stylus">
.home-wrap
    font-size 14px;
</style>