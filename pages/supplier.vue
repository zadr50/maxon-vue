<template>
  <div>
      <h1>Master Data Supplier</h1>
      <el-alert v-show="showAlert" ref="alert"
        title="Message"
        type="error"
        description="more text description"
        show-icon>
      </el-alert>
    
      <el-divider></el-divider> 

      <el-input v-model="search" size="mini" placeholder="Type to search" style="width:200px" />
      <el-button size="mini" type="primary" @click="handleAdd()">Addnew</el-button>
      <el-button size="mini" type="success" @click="handleRefresh()">Refresh</el-button>
      <el-button size="mini" type="info" @click="handlePrint()">Print</el-button>

  <el-table :data="tableData.filter(data => !search || data.supplier_name.toLowerCase().includes(search.toLowerCase()))"
    style="width: 99%">
    <el-table-column v-for="col in columns"  :label="col.label" :prop="col.field" 
        v-bind:key="col"  >
    </el-table-column>
    <el-table-column
      align="right">
      <template slot="header" >
      </template>
      <template slot-scope="scope">
        <el-button
          size="mini"
          @click="handleEdit(scope.$index, scope.row)">Edit</el-button>
        <el-button
          size="mini"
          type="danger"
          @click="handleDelete(scope.$index, scope.row)">Delete</el-button>
      </template>
    </el-table-column>
  </el-table>
  <el-pagination
      background
      layout="prev, pager, next"
      @current-change="handleCurrentChange"
      :total="1000">
  </el-pagination>

  <el-dialog
    title="Master Data Supplier"
    :visible.sync="dialogVisible"
    width="60%"
    :before-close="handleClose">
          <el-divider></el-divider>
          <el-form ref="form" :model="form" label-width="120px">
          <el-form-item label="Kode">
              <el-input v-model="form.supplier_number"></el-input>
          </el-form-item>
          <el-form-item label="Nama Suplier">
              <el-input v-model="form.supplier_name"></el-input>
          </el-form-item>
          <el-form-item label="Kota">
              <el-input v-model="form.city"></el-input>
          </el-form-item>
          <el-form-item label="Alamat">
              <el-input type="textarea" v-model="form.street"></el-input>
          </el-form-item>
          </el-form>
    
    <span slot="footer" class="dialog-footer">
      <el-button @click="dialogVisible = false">Cancel</el-button>
      <el-button type="primary" @click="onSubmit">Confirm</el-button>
      <span>{{message}}</span>
    </span>
  </el-dialog>
  </div>
</template>

<script>
  import axios from 'axios';
  
  export default {
    head: {
      title: 'Master Supplier'
    },
    data() {
      return {
        tableData: [{supplier_number: 'Loading...'}],
        search: '',
        dialogVisible: false,
        message: "",  
        mode:"add",
        page: 1,
        form: {
          supplier_number: '',
          supplier_name: '',
          city: '',
          street: ''
        },
        columns: [
          {label: "Kode", field:"supplier_number"},
          {label: "Nama Supplier", field:"supplier_name"},
          {label: "Kota", field:"city"},
          {label: "Alamat", field:"street"}
        ],
        showAlert: false,
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
        console.log(index, row);
        this.dialogVisible=true;
        this.form.supplier_number=this.tableData[index].supplier_number;
        this.form.supplier_name=this.tableData[index].supplier_name;
        this.form.city=this.tableData[index].city;
        this.form.street=this.tableData[index].street;
        this.mode="edit";
      },
      handleDelete(index, row) {
        this.$confirm('Are you sure delete this supplier ?')
          .then(_ => {
          var vUrl='/api/supplier/delete/'+this.tableData[index].supplier_number;
          axios.get(vUrl)
            .then((Response) => {
                this.message=Response.data.msg;
                //done();
                this.loadData();
            })
            .catch((err) => {
                console.log(err)
                this.message=err;
            })
        })
        .catch(_ => {});
      },
      handleAdd() {
        this.dialogVisible=true;
        this.mode="add";
      },
      handleClose(done) {
        this.$confirm('Are you sure to close this dialog?')
          .then(_ => {
            done();
          })
          .catch(_ => {});
      },
      loadData(){
        var vUrl='/api/supplier/browse_data/'+this.page;
        
        axios.get(vUrl)
            .then((Response) => {
                this.tableData = Response.data.rows;
            })
            .catch((err) => {
                ///this.errors.push(err)
                console.log("Error")
            })

      },
      onSubmit() {
        const formData = new FormData()
        Object.keys(this.form).forEach((key) => {
            formData.append(key, this.form[key])
        })
        formData.append("mode",this.mode);

        var vUrl='/api/supplier/save';

        axios.post(vUrl,formData)
            .then((Response) => {
                //this.showAlert=true;
                //this.$refs.alert="dddddddddddddddd";
                this.dialogVisible=false;
                this.message="Success";
                this.loadData();
            })
            .catch((err) => {
                ///this.errors.push(err)
                console.log(err)
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