<template>
  <div>
      <h1>Daftar Master Inventory</h1>
      <el-divider></el-divider>
      <el-col :span="24"> 
      <el-input v-model="search" size="mini" placeholder="Type to search" style="width:200px" />
      <el-button size="mini" type="primary" @click="handleAdd()">Addnew</el-button>
      <el-button size="mini" type="success" @click="handleRefresh()">Refresh</el-button>
      <el-button size="mini" type="info" @click="handlePrint()">Print</el-button>
      </el-col>
      <el-col :span="24">
        <div class="alert alert-error">{{message}}</div>  
      </el-col>

  <el-table :data="tableData.filter(data => !search || data.description.toLowerCase().includes(search.toLowerCase()))"
    style="width: 99%">
    <el-table-column v-for="col in columns"  :label="col.label" :prop="col.field" 
        v-bind:key="col"  v-model="tableColumn">
    </el-table-column>
    <el-table-column width=70>
      <template slot-scope="scope">
        <el-button size="mini" @click="handleEdit(scope.$index, scope.row)">Edit</el-button>
      </template>
    </el-table-column>
    <el-table-column width=70>
      <template slot-scope="scope">
        <el-button size="mini" type="danger" @click="handleDelete(scope.$index, scope.row)">Del</el-button>
      </template>
    </el-table-column>
  </el-table>
  <el-pagination  background  layout="prev, pager, next" ref='pagination'
      @current-change="handleCurrentChange" 
      :total="this.rowCount" >
  </el-pagination>

  <el-dialog
    title="Master Data Inventory"
    :visible.sync="dialogVisible"  width="60%"
    :before-close="handleClose">
    <el-form ref="form" :model="form" label-width="120px">
      <el-row>
        <el-col :span=10 :xs=23>
          <el-form-item label="Kode">
              <el-input v-model="form.item_number"></el-input>
          </el-form-item>
          <el-form-item label="Nama Barang">
              <el-input v-model="form.description"></el-input>
          </el-form-item>
          <el-form-item label="Kategori">
              <el-input v-model="form.category"></el-input>
          </el-form-item>
          <el-form-item label="Satuan">
              <el-input v-model="form.unit_of_measure"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span=10 :xs=23>
          <el-form-item label="Supplier">
              <el-input v-model="form.supplier_number"></el-input>
          </el-form-item>
          <el-form-item label="Harga Jual">
              <el-input v-model="form.retail"></el-input>
          </el-form-item>
          <el-form-item label="Harga Beli">
              <el-input v-model="form.cost_from_mfg"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span=23>
          <el-col :span=8>
            <el-form-item label="Picture">
                <el-input v-model="form.item_picture"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span=7>
            <el-form-item label="Picture2">
                <el-input v-model="form.item_picture2"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span=8>
            <el-form-item label="Picture3">
                <el-input v-model="form.item_picture3"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span=7>
            <el-form-item label="Picture4">
                <el-input v-model="form.item_picture4"></el-input>
            </el-form-item>
          </el-col>
        </el-col>
        <el-col :span=23>
          <el-form-item label="Deskripsi Barang">
              <el-input type="textarea" v-model="form.special_features"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    
    <span slot="footer" class="dialog-footer">
      <span>{{message}}</span>
      <el-button @click="dialogVisible = false">Cancel</el-button>
      <el-button type="primary" @click="onSubmit">Confirm</el-button>
    </span>
  </el-dialog>

  </div>
</template>

<script>
  import axios from 'axios';
  
  export default {
    head: {
      title: 'Master Barang'
    },
    data() {
      return {
        tableData: [{item_number: 'Loading...'}],
        search: '',
        dialogVisible: false,
        message: "",  
        mode:"add",
        page: 1,
        form: {
          item_number: '',
          description: '',
          unit_of_measure: '',
          category: '',
          retail: '',
          cost_from_mfg: '',
          special_features:'',
          supplier_number:'',
          item_picture:'',
          item_picture2:'',
          item_picture3: '',
          item_picture4: ''
        },
        columns: [
          {label: "Kode", field:"item_number"},
          {label: "Nama Barang", field:"description"},
          {label: "Satuan", field:"unit_of_measure"},
          {label: "Kategori", field:"category"},
          {label: "Harga Jual", field:"retail"},
        ],
        rowCount:100,

      }
    },
    methods: {
      handlePrint(){
        alert("Not Available")
      },
      handleRefresh(){
         this.loadData()
      },
      handleEdit(index, row) {
        this.clear();
        this.dialogVisible=true;
        this.form.item_number=this.tableData[index].item_number;
        this.form.description=this.tableData[index].description;
        this.form.unit_of_measure=this.tableData[index].unit_of_measure;
        this.form.category=this.tableData[index].category;
        this.form.retail=this.tableData[index].retail;
        this.mode="edit";
        this.$toast.show("Execute...please wait!")
          var vUrl='/api/inventory/find/'+this.tableData[index].item_number;
          axios.get(vUrl)
            .then((Response) => {
                var o=Response.data;
                this.form.supplier_number=o.supplier_number;
                this.form.special_features=o.special_features;
                this.form.item_picture=o.item_picture                         
                this.form.cost_from_mfg=o.cost_from_mfg;
                this.form.item_picture2=o.item_picture2                         
                this.form.item_picture3=o.item_picture3                         
                this.form.item_picture4=o.item_picture4                         
                this.$toast.clear()
            })
            .catch((err) => {
                this.$toast.show(err);
                this.message=err;
            })

      },
      handleDelete(index, row) {
        this.$confirm('Are you sure delete this item ?')
          .then(_ => {

          this.$toast.show("Execute...please wait!")
          var vUrl='/api/inventory/delete/'+this.tableData[index].item_number;
          axios.get(vUrl)
            .then((Response) => {
                this.message=Response.data.msg;
                this.loadData();
            })
            .catch((err) => {
                this.$toast.show(err);
                this.message=err;
            })
        })
        .catch(_ => {});
      },
      handleAdd() {
        this.dialogVisible=true;
        this.mode="add";
        this.clear();
      },
      clear(){
        this.message='';
        this.form.item_number="AUTO";
        this.form.description="";
        this.form.special_features="";
        this.form.supplier_number="";
        this.form.unit_of_measure="";
        this.form.category="";
        this.form.retail=0;
        this.form.cost_from_mfg=0;
        this.form.item_picture="";
        this.form.item_picture2="";
        this.form.item_picture3="";
        this.form.item_picture4="";

      },
      handleClose(done) {
        done();
      },
      loadData(){
        var vUrl='/api/inventory/browse_data/'+this.page+'/?tb_search='+this.search;
        this.$toast.show("Execute...please wait!");
        axios.get(vUrl)
            .then((Response) => {
                this.tableData = Response.data.rows;
                this.$refs.pagination.total=Response.data.rows.length/10
                this.$toast.clear();
            })
            .catch((err) => {
                this.$toast.show(err);
            })
      },
      onSubmit() {
        const formData = new FormData()
        Object.keys(this.form).forEach((key) => {
            formData.append(key, this.form[key])
        })
        formData.append("mode",this.mode);

        var vUrl='/api/inventory/save';
        this.$toast.show("Execute...please wait !");
        axios.post(vUrl,formData)
            .then((Response) => {
                this.dialogVisible=false;
                this.message="Success";
                this.$toast.clear();
                this.loadData();
            })
            .catch((err) => {
                this.$toast.show(err);
                this.message='Error'
            })
        },
        handleSizeChange(val) {
          console.log(`${val} items per page`);
          
        },
        handleCurrentChange(val) {
          console.log(`current page: ${val}`);
          this.page=val;
          this.loadData();
        }
        
    },
    mounted: function(){
      this.loadData()
    },
       
  }
</script>