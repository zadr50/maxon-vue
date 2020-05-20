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
    <el-table-column
      align="left">
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
    title="Master Data Inventory"
    :visible.sync="dialogVisible"
    width="60%"
    :before-close="handleClose">
          <el-divider></el-divider>
          <el-form ref="form" :model="form" label-width="120px">
          <el-form-item label="Kode">
              <el-input v-model="form.item_number"></el-input>
          </el-form-item>
          <el-form-item label="Nama Barang">
              <el-input v-model="form.description"></el-input>
          </el-form-item>
          <el-form-item label="Kategory">
              <el-input v-model="form.category"></el-input>
          </el-form-item>
          <el-form-item label="Satuan">
              <el-input v-model="form.unit_of_measure"></el-input>
          </el-form-item>
          <el-form-item label="Harga Jual">
              <el-input v-model="form.retail"></el-input>
          </el-form-item>
          <el-form-item label="Harga Beli">
              <el-input v-model="form.cost_from_mfg"></el-input>
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

        },
        columns: [
          {label: "Kode", field:"item_number"},
          {label: "Nama Barang", field:"description"},
          {label: "Satuan", field:"unit_of_measure"},
          {label: "Kategory", field:"category"},
          {label: "Harga Jual", field:"retail"},

        ]
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
        this.form.item_number=this.tableData[index].item_number;
        this.form.description=this.tableData[index].description;
        this.form.unit_of_measure=this.tableData[index].unit_of_measure;
        this.form.category=this.tableData[index].category;
        this.form.retail=this.tableData[index].retail;
        this.form.cost_from_mfg=this.tableData[index].cost_from_mfg;
        this.mode="edit";
      },
      handleDelete(index, row) {
        this.$confirm('Are you sure delete this item ?')
          .then(_ => {
          var vUrl='/api/inventory/delete/'+this.tableData[index].item_number;
          axios.get(vUrl)
            .then((Response) => {
                this.message=Response.data.msg;
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
        var vUrl='/api/inventory/browse_data/'+this.page;
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

        var vUrl='/api/inventory/save';

        axios.post(vUrl,formData)
            .then((Response) => {
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