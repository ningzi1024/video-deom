export default {
    saveMenuList(state, list){
        if(!list || list.length<=0)
            return;
        state.menuList = list;
    }
}