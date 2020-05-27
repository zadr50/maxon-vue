<template>
 <div id='dialog-item'>
 <el-dialog title="Addnew Items"  v-model='dlgItem' v-bind='dlgItem' :visible.sync=dialogVisible  
      width="60%" :before-close="handleClose">

      <span slot="footer" class="dialog-footer">
         <span style='color:red '  ><i>{{message}}</i></span>    
        <el-button @click="dialogVisible = false" size="mini">Cancel</el-button>
        <el-button type="primary" @click="onSubmit" size="mini">Confirm</el-button>
      </span>

      <el-row>
      <el-form ref="frmItem" :model="item" label-width="120px">
          <el-col :span="10"  :sm="23">
            <el-form-item label="Item Number">
                <el-input v-model="item.item_number"  style="width:60%"></el-input>
                <el-button type="primary" @click="selectItem" ><span class="el-icon-search"></span></el-button>
            </el-form-item>
            <el-form-item label="Quantity">
                <el-input v-model="item.quantity"></el-input>
            </el-form-item>
            <el-form-item label="Unit">
                <el-input v-model="item.unit" ></el-input>
            </el-form-item>

          </el-col>
          <el-col :span="10" :sm="23">
            <el-form-item label="Description">
                <el-input v-model="item.description" ></el-input>
            </el-form-item>                  
            <el-form-item label="Price">
                <el-input v-model="item.price"  ></el-input>
            </el-form-item>
            <el-form-item label="Discount%">
                <el-input v-model="item.discount" ></el-input>
            </el-form-item>
          </el-col>
      </el-form>
      </el-row>
    </el-dialog>

    <LookupData ref='lov1' :afterSelect="onSelectItem"></LookupData>

 </div>
</template>
 
<script>

import { mapActions, mapState, mapMutations } from 'vuex'
import LookupData from '~/components/LookupData'
import axios from 'axios'

export default {
    name:"DialogItem",
    created() {
      console.log('dialogItem.created')  
    },
    props: {
        selected: {
            type: Object,
            default: null
        },
        afterSubmit:null,
        url_save:'',
        primary_key:'',
    },
    components: {
        LookupData
    },
    data() {
      return {
        mode:'add',  
        nomor_bukti: "",  
        dialogVisible: false,  
        item: {        
          item_number:'',
          description:'',
          quantity:'',
          unit:'',
          price:'',
          discount:'',
          total_price:'',
          line_number:'',
        },
        dlgItem:'',
        message:'',
      }
    },
    methods: {
      ...mapActions('DialogItem', ['storeData', 'updateData','showDialog']),

      showDialog(){
        console.log('DialogItem.selectItem')
        this.dialogVisible=true
      },
      onSubmit(){
        console.log('DialogItem.onSubmit')
        this.message="Saving..."
        const formData = new FormData()
        Object.keys(this.item).forEach((key) => {
            formData.append(key, this.item[key])
        })
        var fieldKey="purchase_order_number"
        if(this.primary_key){
          fieldKey=this.primary_key
        }
        formData.append(fieldKey,this.nomor_bukti)
        formData.append("mode",this.mode);

        var vUrl=vUrl='/api/purchase_order/save_item';
        if (this.url_save){
          vUrl=this.url_save
        } 

        axios.post(vUrl,formData)
            .then((Response) => {
                if(Response.data.success){
                  this.dialogVisible=false;
                  this.message="Success";
                  this.afterSubmit(Response.data);
                } else {
                  this.message=Response.data.msg;
                }
            })
            .catch((err) => {
                this.message=err
            })

      },
      handleClose(){
            console.log('DialogItem.handleClose')
            this.dialogVisible=false
      },
      selectItem(){
            console.log('DialogItem.selectItem')
            this.$refs.lov1.show()
      },
      onSelectItem(item) {
          this.message="Searching item..."
          this.item.item_number=item
          var vUrl='/api/inventory/find/'+this.item.item_number;
          axios.get(vUrl)
            .then((Response) => {
                this.message="Found item"
                var d=Response.data
                this.message=d.msg;
                this.item.description=d.description
                this.item.quantity=1
                this.item.price=d.retail
                this.item.unit=d.unit_of_measure
                this.item.discount=d.discount
            })
            .catch((err) => {
                this.message=err;
            })          
      }

    

    },
    updated() {
          //this.dialogVisible=$store.state.dialogVisible
    },
    mounted(){
        console.log('DialogItem.mounted')
        //this.$props.dialogVisible=false

    },

}
</script>