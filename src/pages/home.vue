<template>
    <div class="video-demo-wrap">
        <header class="toptit">
            <span>位置：</span>
            <span>入侵信息</span>
        </header>
        <div class="content">
            <div class="optCon">
                <div class="selectDateTime">
                    <span>选择日期</span>
                    <el-date-picker
                        v-model="dateTimeDis"
                        type="datetimerange"
                        start-placeholder="请选择开始日期"
                        end-placeholder="请选择结束日期"/>
                </div>
                <div class="btns">
                    <el-button type="primary" icon="el-icon-search" size="medium" @click="searchHandle">搜索</el-button>
                    <el-button icon="el-icon-download" size="medium" @click="downLoad=!downLoad">下载</el-button>
                    <el-button type="primary" size="medium" v-show="downLoad" @click="downloadHandle">确定</el-button>
                    <el-button type="info" size="medium" @click="cancelDownload" v-show="downLoad">取消</el-button>
                </div>
            </div>
            <div class="imgList">
                <el-scrollbar>
                    <el-collapse   v-model="activeNames" @change="handleChange">
                        <el-collapse-item v-for="(item,key,index) in list" :key="index" :title="dataFormate(key)" :name="key">
                            <div class="imgItem">
                                <dl v-for="(img,i) in item" :key="`${img.name}-${i}`" @click="downLoad?selectImg(key,img.id):openImg(key,img.id)">
                                    <dt>
                                        <el-image 
                                            :src="require(`../assets/images/${img.name}`)"
                                            :preview-src-list="downLoad?[]:[require(`../assets/images/${img.name}`)]"/>
                                    </dt>
                                    <dd>{{ img.createTime }}</dd>
                                    <dd class="chooseImg" v-show="downLoad">
                                        <span :class="{'checkbox':true, 'checked': img.selected}">
                                            <i class="el-icon-check icon-checked" v-show="img.selected"></i>
                                        </span>
                                    </dd>
                                </dl>
                            </div>
                            <div class="chooseAll" v-show="downLoad" @click="selectAll(key)">
                                <span>全选</span>
                                <span :class="{'checkbox':true, 'checked': selectAllKey[key]}">
                                    <i class="el-icon-check icon-checked"></i>
                                </span>
                            </div>
                        </el-collapse-item>
                    </el-collapse>
                </el-scrollbar>
            </div>
        </div>
    </div>
</template>

<script>
import { DatePicker, Button, Collapse, CollapseItem, Image } from 'element-ui'
import List from '../utils/imgList'
import moment from 'moment'
import JSZip from 'jszip'
import FileSaver from 'file-saver'

export default {
    name: 'home',
    components:{
        'el-date-picker': DatePicker,
        'el-button': Button,
        'el-collapse': Collapse,
        'el-collapse-item': CollapseItem,
        'el-image': Image
    },
    data(){
        return{
            dateTimeDis: null,
            activeNames:['2020-05'],
            cacheList: {},
            list: { },
            downLoad: false,
            selectAllKey: {}
        }
    },
    watch:{
        dateTimeDis(newVal,oldVal){
            console.log(newVal, oldVal);
            if(!newVal && newVal===null)
                this.list = this.cacheList;
        }
    },
    methods: {
        /**
         * 按日期时间搜索图片
         */
        searchHandle(){
            let dataTime = this.dateTimeDis,
                searchArr = [],
                listObj = {};
            if(!dataTime) return;
            dataTime.map(item=>{
                searchArr.push(moment(item).format('X'));
            });
            for(let key in this.cacheList){
                listObj[key] = [];
                this.cacheList[key].map(item=>{
                    let createTimeUx = moment(item.createTime).format('X');
                    if(createTimeUx>=searchArr[0] && createTimeUx<=searchArr[1]){
                        listObj[key].push(item);
                        if(this.activeNames.indexOf(key)<0)
                            this.activeNames.push(key);
                    }  
                })
            }
            setTimeout(()=>{
                this.list = listObj;
            }, 200)

        },

        /**
         * 全选/全不选 操作
         * @param key type[string]
         * @param id type[number]
         * @returns {}
         **/
        selectImg(key,id){
            let selectNum = 0;
            this.list[key].map(item=>{
                if(item.id === id){
                    let curSelected = item.selected;
                    item.selected = !curSelected;
                }
                if(item.selected)
                    selectNum++;
                if(selectNum===this.list[key].length)
                    this.selectAllKey[key] = true;
                else
                    this.selectAllKey[key] = false;

            });
        },
        openImg(key,id){
            console.log(this.dateTimeDis);
            console.log('openImg',id);
        },
        /**
         *  取消下载操作
         **/
        cancelDownload(){
            for(let key in this.list){
                this.list[key].map(item=>item.selected = false)
            }
            for(let key in this.selectAllKey){
                this.selectAllKey[key] = false
            }
            this.downLoad = false;
        },


        /**
         * 全选/全不选 操作
         * @param key type[string]
         * @returns {Promise<unknown>}
         **/
        selectAll(key){
            let curData = this.selectAllKey[key];
            this.selectAllKey[key] = !curData;
            this.list[key].map(item=>{
                if(this.selectAllKey[key])
                    item.selected = true
                else
                    item.selected = false
            })
        },
        dataFormate(data, format='YYYY年MM月'){
            return moment(data).format(format);
        },
        handleChange(val) {
            console.log(val);
        },

        /**
         *  下载按钮点击事件
         **/
        downloadHandle(){
            let arrImages = [];
            let list = this.list;
            for(let key in list){
                list[key].map(item=>{
                    if(item.selected){
                        arrImages.push({
                            fileUrl: require(`../assets/images/${item.name}`),
                            renameFileName: item.name
                        });
                    }
                })
            }
            if(!arrImages || arrImages.length<=0) return;
            this.filesToRar(arrImages,'warnImages');
            this.cancelDownload();
        },

        /**文件打包
         * arrImages:文件list:[{fileUrl:文件url,renameFileName:文件名}]
         * filename 压缩包名
         * */
        filesToRar(arrImages, filename) {
            if(!arrImages || arrImages.length<=0) return;
            let _this = this;
            let zip = new JSZip();
            let cache = {};
            let promises = [];
            _this.title = '正在加载压缩文件';

            for (let item of arrImages) {
                const promise= _this.getImgArrayBuffer(item.fileUrl).then(data => {
                    // 下载文件, 并存成ArrayBuffer对象(blob)
                    zip.file(item.renameFileName, data, { binary: true }); // 逐个添加文件
                    cache[item.renameFileName] = data;
                });
                promises.push(promise);
            }

            Promise.all(promises).then(() => {
                zip.generateAsync({ type: "blob" }).then(content => {
                    _this.title = '正在压缩';
                    // 生成二进制流
                    FileSaver.saveAs(content, filename); // 利用file-saver保存文件  自定义文件名
                    _this.title = '压缩完成';
                });
            }).catch(()=>{
                _this.$message.error('文件压缩失败');
            });
        },
        /**
         * 获取文件blob
         * @param url type[string]
         * @returns {Promise<unknown>}
         */
        getImgArrayBuffer(url){
            // let _this=this;
            return new Promise((resolve, reject) => {
                let xmlhttp = new XMLHttpRequest();
                xmlhttp.open("GET", url, true);
                xmlhttp.responseType = "blob";
                xmlhttp.onload = function () {
                    if (this.status == 200) {
                        resolve(this.response);
                    }else{
                        reject(this.status);
                    }
                }
                xmlhttp.send();
            });

        },
    },
    created() {
        this.list = this.cacheList = List;
         Object.keys(List).map(item=>{
             if(!this.selectAllKey[item])
                 this.selectAllKey[item] = false
         })
        console.log(this.selectAllKey);
    }
}
</script>

<style lang="stylus">
.video-demo-wrap
    width 100%
    height 100%
    background #fff

    .toptit
        height: .9rem;
        line-height: .9rem;
        background: #edf6fb;
        border-bottom: 2px solid #eee;
        padding-left: .9rem;
        font-size: 0.3rem;

    .content
        padding .4rem .8rem

        .selectDateTime
            margin 0 .3rem 0 .5rem
            display inline-block
            span
                font-size .28rem
                display inline-block
                margin-right 0.2rem
                color #333

        .btns
            display inline-block
        .imgList
            width 95%
            margin 0 auto
            text-align center
            height 3rem

            .imgItem
                width 100%
                padding 0.2rem 0
                overflow hidden
                dl
                    float left
                    width 2.6rem
                    margin 0.03rem 0.2rem 0.2rem 0.5rem
                    min-height 0.9rem
                    position relative

                    dt
                        width 80%
                        text-align center
                        margin 0 auto
                        cursor pointer

                      img
                        width 100%

                    dd
                        width 100%
                        margin-inline-start: 0;

                        &.chooseImg
                            width .38rem
                            height .38rem
                            position: absolute
                            right .4rem
                            top .1rem

                            .checkbox
                                display inline-block
                                width .42rem
                                height .42rem
                                background-color rgba(255,255,255,.2)
                                border 1px solid #fff;
                                border-radius 50%
                                cursor pointer
                                position: relative
                            .checked
                                background-color #36a1ee
                            .icon-checked
                                color #fff
                                font-size .32rem


            .chooseAll
                float right
                margin-right .6rem
                font-size .26rem
                cursor pointer
                span
                    display inline-block
                    margin-right .2rem
            .checkbox
                display inline-block
                width .42rem
                height .42rem
                background-color rgba(255,255,255,.2)
                border 1px solid #ddd;
                border-radius 50%
                cursor pointer
                position: relative

            .checked
                background-color #36a1ee
            .icon-checked
                color #fff
                font-size .32rem
    .el-collapse
        border-top none
    .el-collapse-item__header
        font-size .32rem
        border-bottom: 1px dashed #EBEEF5;
    .el-collapse-item__wrap
        border-bottom: 1px dashed #EBEEF5;
    .el-scrollbar__wrap
        overflow-x hidden     
</style>