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
    <el-form ref="form" :model="form" label-width="120px" enctype="multipart/form-data">
      <el-row>
        <el-col :span=10 :xs=23>
          <el-form-item label="Kode">
              <el-input v-model="form.item_number" size="small"></el-input>
          </el-form-item>
          <el-form-item label="Nama Barang">
              <el-input v-model="form.description" size="small"></el-input>
          </el-form-item>
          <el-form-item label="Kategori">
              <el-input v-model="form.category" size="small"></el-input>
          </el-form-item>
          <el-form-item label="Satuan">
              <el-input v-model="form.unit_of_measure" size="small"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span=10 :xs=23>
          <el-form-item label="Supplier">
              <el-input v-model="form.supplier_number" size="small"></el-input>
          </el-form-item>
          <el-form-item label="Harga Jual">
              <el-input v-model="form.retail"  size="small"></el-input>
          </el-form-item>
          <el-form-item label="Harga Beli">
              <el-input v-model="form.cost_from_mfg"  size="small"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span=23>
          <el-col :span=12>
            <el-form-item label="Picture">
             <el-input v-model="form.item_picture"  size="small" style="display:none" />         
             {{form.item_picture}}     
              <input type="file" ref="file1" v-on:change="handleFileUpload(1)"/>              
            </el-form-item>
          </el-col>
          <el-col :span=10>
            <el-form-item label="Picture2">
                <el-input  v-model="form.item_picture2" size="small" style="display:none"></el-input>
                {{form.item_picture2}}     
                <input type="file" ref="file2" v-on:change="handleFileUpload(2)"/>              
            </el-form-item>
          </el-col>
        </el-col>
        <el-col :span=23>
          <el-col :span=12>
            <el-form-item label="Picture3">
                <el-input   v-model="form.item_picture3" size="small" style="display:none"></el-input>
                {{form.item_picture3}}     
                <input type="file" ref="file3" v-on:change="handleFileUpload(3)"/>              
            </el-form-item>
          </el-col>
          <el-col :span=10>
            <el-form-item label="Picture4">
                <el-input   v-model="form.item_picture4" size="small" style='display:none'></el-input>
                {{form.item_picture4}}     
                <input type="file" ref="file4" v-on:change="handleFileUpload(4)"/>              
            </el-form-item>
          </el-col>
        </el-col>
        <el-col :span=23>
          <el-form-item label="Deskripsi Barang">
              <el-input  type="textarea" v-model="form.special_features" size="small"></el-input>
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
        file:null,
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
      handleFileUpload(idx){
        if(idx==1) {
          this.file = this.$refs.file1.files[0];
          this.form.item_picture=this.file.name
        }
        if(idx==2) {
          this.file = this.$refs.file2.files[0];
          this.form.item_picture2=this.file.name
        }
        if(idx==3) {
          this.file = this.$refs.file3.files[0];
          this.form.item_picture3=this.file.name
        }
        if(idx==4) {
          this.file = this.$refs.file4.files[0];
          this.form.item_picture4=this.file.name
        }               
        this.submitFile()
      },
      submitFile(){
        /*
                Initialize the form data
            */
            let formData = new FormData();

            /*
                Add the form data we need to submit
            */
            formData.append('userfile', this.file);

        /*
          Make the request to the POST /single-file URL
        */
            axios.post( this.siteUrl + '/index.php/inventory/do_upload_picture',
                formData,
                {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Access-Control-Allow-Origin': "*"
                }
              }
            ).then(function(Response){
              console.log(Response)
              this.message='Success Upload ' + this.file.name;
            })
            .catch(function(){
              
              this.message='Failure upload!';
            });
      },
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
        this.file=null;
        this.$refs.file1=null
        this.$refs.file2=null
        this.$refs.file3=null
        this.$refs.file4=null
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
    computed: {
       siteUrl() { return process.env.siteUrl }      
    },
       
  }
</script>
<style scoped>
.el-form-item {
    margin-bottom: 3px;
}
</style>