<template>
    <div class="login-wrap">
        <h1>login page</h1>
        <el-button @click="$router.push('/home')" type="success">首页</el-button>
    </div>
</template>

<script>
import { Button } from 'element-ui'
import { menus } from '../services/services'
export default {
    name: 'login',
    components: {
        [Button.name]: Button
    },
    mounted() {
        menus().then(res=>{
            console.log(res);
        });
    }
}
</script>

<style lang="stylus">
h1
    font-size 20px
    font-weight normal
    color #333
</style>