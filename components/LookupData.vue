<template>
    <div>
    <el-dialog title="Daftar Pilihan"  v-model='dlgItem' v-bind='dlgItem' 
      :visible.sync=dialogVisible  width="60%" :before-close="handleClose">

      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false" size="mini">Cancel</el-button>
      </span>      
      <el-input v-model="search" placeholder="Ketik dan tekan ENTER"  @keyup.native.enter="load_items" />
      <el-table :data="tableData">
        <el-table-column v-for="col in columns"  :label="col.label" :prop="col.field" 
            v-bind:key="col"  v-model="tableColumn">
        </el-table-column>
        <el-table-column>
            <template slot="header" >
           </template>
            <template slot-scope="scope">
                <el-button
                    size="mini" type='success'
                    @click="onSelect(scope.$index, scope.row)">Pilih</el-button>
            </template>
        </el-table-column>
     </el-table>
     <el-pagination
        background
        layout="prev, pager, next"
        @current-change="load_items_page"
        :total="1000">
     </el-pagination>
    </el-dialog>
  </div>
</template>

<script>
//.filter(data => !search || data.supplier_name.toLowerCase().includes(search.toLowerCase()))
import axios from 'axios'

export default {
    props: {
        afterSelect:'',
    },
    data() {
        return {
            page: 1,
            search:'',
            dialogVisible:false,
            tableData:[],
            columns: [
                {label: "Item Number", field:"item_number"},
                {label: "Description", field:"description"},
            ],
            
        }
    },
    methods: {
        show(){
            this.dialogVisible=true
        },
        afterSelect(val){
            console.log('LookupData.afterSelect: '+val)
        },
        onSelect(index,row) {
            this.dialogVisible =false 
            this.afterSelect(row.item_number)
            console.log('selected: '+row.item_number)
            
        },
        load_items_page(val){
            this.page=val;
            this.message="Loading...page: "+this.page;
            this.load_items()
        },
        load_items() {
            var vUrl='/api/inventory/browse_data/'+this.page+'?json=true&tb_search='+this.search;
            axios.get(vUrl)
            .then((Response) => {
                this.tableData = Response.data.rows;
                this.message="Ready.";
            })
            .catch((err) => {
                this.message=err;
            })        


        }
    },
    mounted() {
        this.load_items()
    }
}
</script>