<template>
    <div>
        <el-button @click="testDialog()">Test DialogItem</el-button> 
        <button @click="$store.commit('increment')">CounterMe: {{ $store.state.counter }}</button>

        <DialogItem ref='foo'>xxxxxxxxxxxxx</DialogItem>

    </div>
</template>

<script>
import echarts from 'echarts'
import axios from 'axios'
import DialogItem from "@/components/DialogItem.vue";
import { mapActions, mapState, mapMutations } from 'vuex'

  export default {
    head: {
        title: 'Dashboard'
    },
    components: {
        DialogItem
    },
    data() {
      return {
        dialogVisible: false,
      }
    },
    methods: {
        ...mapActions('DialogItem', ['getData', 'delData','showDialog']),
        ...mapMutations('DialogItem', ['SET_DIALOG']),

        testDialog(){
            console.log('dialog.methods.testDialog');
            //$store.commit('dialogVisible')
            this.$refs.foo.showDialog();
             
        },
        selectItem(){
            console.log('dialog.selectItem')
        },
        handleClose(){
            console.log('dialog.handleClose')
        }
    },
    computed: {
        ...mapState('DialogItem', {
            categories: state => state.categories,
            page: state => state.page
        })
    },
    watch: {
        page() {
            console.log('dialog.watch.page')
        }  
    },

  }
</script>
