<template>
    <div class="sysLog-wrap">
        <header class="toptit">
            <span>位置：</span>
            <span>门禁监控</span>
        </header>
        <div class="content">
            <div class="opts">
                <el-select
                        v-model="requestParams.date_type"
                        placeholder="请选择时间条件"
                        class="sys-select el-select-hh">
                    <el-option
                            v-for="item in timeTypes"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                    </el-option>
                </el-select>
                <el-select
                        v-model="requestParams.value_type"
                        placeholder="请选择搜索条件"
                        class="sys-select">
                    <el-option
                            v-for="item in searchTypes"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                    </el-option>
                </el-select>
                <template v-if="requestParams.date_type==4">
                    <el-date-picker
                            v-model="dataPicker"
                            type="datetimerange"
                            range-separator="至"
                            start-placeholder="请选择开始日期"
                            end-placeholder="请选择结束日期">
                    </el-date-picker>
                </template>
                <el-input
                        class="keywords"
                        placeholder="请输入搜索内容"
                        v-model="requestParams.value"
                        clearable>
                </el-input>
                <el-button type="primary"
                           icon="el-icon-search"
                           @click="searchHandle"
                           :loading="loading">搜索</el-button>
            </div>
            <div class="infos">
                <el-table
                        :data="dealList(tableData)"
                        stripe
                        highlight-current-row
                        style="width: 100%">
                    <el-table-column
                            prop="event_time"
                            label="时间">
                    </el-table-column>
                    <el-table-column
                            prop="access_type"
                            label="门禁类型">
                    </el-table-column>
                    <el-table-column
                            prop="event_point_name"
                            label="事件发生点">
                    </el-table-column>
                    <el-table-column
                            prop="door_action"
                            label="门动作">
                    </el-table-column>
                    <el-table-column
                            prop="name"
                            label="用户名">
                    </el-table-column>
                    <el-table-column
                            prop="verify_mode_name"
                            label="验证方式">
                    </el-table-column>
                    <el-table-column
                            prop="card_no"
                            label="卡号">
                    </el-table-column>
                </el-table>
            </div>
            <div class="pager">
                <el-pagination
                        background
                        @current-change="handleCurrentChange"
                        layout="prev, pager, next"
                        :total="pagination.total"
                        :page-size="this.requestParams.limit">
                </el-pagination>
            </div>
        </div>
    </div>
</template>

<script>
import { DatePicker, Button,Select, Option, Input, Table, TableColumn, Pagination } from 'element-ui'
import moment from 'moment'
import axios from 'axios'

export default {
    name: 'sysLog',
    components:{
        [DatePicker.name]: DatePicker,
        [Button.name]: Button,
        [Select.name]:  Select,
        [Option.name]: Option,
        [Input.name]: Input,
        [Table.name]: Table,
        [TableColumn.name]: TableColumn,
        [Pagination.name]:Pagination
    },
    data(){
        return{
            requestParams:{
                page: 1,        /*当前页*/
                limit: 10,      /*每页条数*/
                date_type: '',   /*时间条件*/
                value_type: '',   /*搜索条件*/
                value:'',       /*搜索内容*/
                start: 0,       /*开始时间戳*/
                end:0           /*结束时间戳*/
            },
            timeTypes:[
                {
                    value: 0,
                    label: '今日'
                },
                {
                    value: 1,
                    label: '本周'
                },{
                    value: 2,
                    label: '本月'
                },{
                    value: 3,
                    label: '本年'
                },{
                    value: 4,
                    label: '自定义'
                }
            ],
            searchTypes: [
                {
                    value: 0,
                    label: '门禁类型'
                }, {
                    value: 1,
                    label: '门动作'
                },{
                    value: 2,
                    label: '用户名'
                },{
                    value: 3,
                    label: '验证方式'
                },{
                    value: 4,
                    label: '卡号'
                }
            ],
            dataPicker: null,
            access_type_obj:{
                '1': '中控',
                '2': '全盾',
                '3': '海康'
            },
            tableData: [
                // {
                //     card_no: '254878877',
                //     verify_mode_name: '指纹',
                //     name: '猪八戒',
                //     door_action: '开门',
                //     event_point_name: '192-45-78-8485-1',
                //     access_type: 1, //1.中控，2.全盾，3.海康
                //     event_time: '2019-05-15 12:45:21'
                // }
            ],
            pagination: {
                total: 10
            },
            loading: false
        }
    },
    mounted() {
      this.init();
    },
    watch:{
        dataPicker(newVal){
            if(newVal && newVal!==null){
                this.requestParams.start = moment(newVal[0]).format('X');
                this.requestParams.end = moment(newVal[0]).format('X');
                console.log(newVal)
            }else if(newVal===null){
                this.requestParams.start = 0;
                this.requestParams.end = 0;
            }
        }
    },
    methods: {
        /**
         * 数据初始化
         */
        init(){
            this.getDataList();
        },

        /**
         * 搜索操作
         */
        searchHandle(){
            console.log(this.requestParams);
            if(!this.searchParamsCheck()) return;
            this.requestParams.page = 1;
            this.loading = true;
            this.getDataList();
        },

        /*
        *@returns Boolean {*}
        **/
        searchParamsCheck(){
            let { requestParams } = this;
            if(requestParams.date_type===4){
                if(!requestParams.start){
                    this.$message.error('请选择开始时间！');
                    return false
                }
                else if(!requestParams.end){
                    this.$message.error('请选择结束时间！');
                    return false;
                }
            }
            return true;
        },

        /**
         * 获取数据
         */
        getDataList(){
            axios.get('/api/',{
                params: this.requestParams
            }).then(res=>{
                this.loading = false;
                if(res.status === 200){
                    if(res.data !== ""){
                        let data = res.data;
                        this.tableData = data.data;//this.dealList(data.data);
                        this.pagination.total = data.Total;
                        console.log(data);
                    }else{
                        this.tableData = [];
                    }
                }else{
                    this.$message.error('获取数据失败!');
                }
            }).catch(err=>{
                this.loading = false;
                this.$message.error('网络异常，请稍候重试！');
                console.log(err)
            });
        },

        /**
         * 处理数据函数
         * @param data
         * @returns {*}
         */
        dealList(data){
            if(!data||data.length===0) return data;
            let format = 'YYYY-MM-DD HH:mm:ss';
            data.map(item=>{
               if(typeof item.access_type === 'number')
                   item.access_type = this.access_type_obj[item.access_type];
               item.event_time = moment(item.event_time).format(format);
            });
            return data;
        },

        /**
         * 翻页操作
         * @param value type{number}
         */
        handleCurrentChange(value){
            console.log(value);
            this.requestParams.page = value;
            this.getDataList();
        }
    }
}
</script>

<style lang="stylus">
.sysLog-wrap
    width 100%
    height 100%
    background #fff
    .toptit
        height 45px
        line-height 45px
        background #edf6fb
        border-bottom 2px solid #eee
        padding-left 45px
        font-size 15px
        overflow hidden
    .content
        padding: 20px 40px 0 40px;
        .sys-select
            margin-right 15px
            display inline-block
        .el-select-hh
            margin-right 30px
        .keywords
            display inline-block
            width 200px
            margin 0 10px
        .infos
            width 100%
            min-height 500px
            padding-top 20px
            th
                background-color #54b5ff
                color #fff
                text-align center
                border-right 1px solid #fff
            td
                text-align center
        .pager
            text-align center
            margin-top 20px
.el-message
    font-size 14px;

</style>