<template>
  <div>
      <h1>Daftar Purchase Order</h1>
      <el-divider></el-divider> 
      <el-input v-model="search" size="mini" placeholder="Type to search" style="width:200px" />
      <el-button size="mini" type="primary" @click="handleAdd()">Addnew</el-button>
      <el-button size="mini" type="success" @click="handleRefresh()">Refresh</el-button>
      <el-button size="mini" type="info" @click="handlePrint()">Print</el-button>
      <div class="alert alert-error">{{message}}</div>  

  <el-table :data="tableData.filter(data => !search || data.supplier_name.toLowerCase().includes(search.toLowerCase()))"
    style="width: 99%">
    <el-table-column v-for="col in columns"  :label="col.label" :prop="col.field" 
        v-bind:key="col"  v-model="tableColumn">
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
    title="Master Sales Order"
    :visible.sync="dialogVisible"
    width="60%"
    :before-close="handleClose">
    <el-divider></el-divider>
    <el-form ref="form" :model="form" label-width="120px">
        <el-form-item label="Nomor Bukti">
            <el-input v-model="form.purchase_order_number"></el-input>
        </el-form-item>
        <el-form-item label="Kode Supplier">
            <el-input v-model="form.supplier_number"></el-input>
        </el-form-item>
        <el-form-item label="Tanggal">
            <el-date-picker
            v-model="form.po_date"
            type="datetime"
            placeholder="Select date and time"
            default-time="12:00:00">
            </el-date-picker>                              
        </el-form-item>
        <el-form-item label="Termin">
            <el-input v-model="form.terms"></el-input>
        </el-form-item>
        <el-form-item label="Catatan">
            <el-input v-model="form.comments" type="textarea"></el-input>
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
      title: 'Purchase Order'
    },
    data() {
      return {
        tableData: [{purchase_order_number: 'Loading...'}],
        search: '',
        dialogVisible: false,
        message: "",  
        mode:"add",
        page:1,
        form: {
          purchase_order_number: '',
          sales_date: '',
          terms: '',
          supplier_number: '',
          comments: '',
        },
        columns: [
          {label: "Nomor PO", field:"purchase_order_number"},
          {label: "Supplier", field:"supplier_name"},
          {label: "Tanggal", field:"po_date"},
          {label: "Termin", field:"terms"},
          {label: "Jumlah", field:"amount"},
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
        this.form.purchase_order_number=this.tableData[index].purchase_order_number;
        this.form.po_date=this.tableData[index].po_date;
        this.form.terms=this.tableData[index].terms;
        this.form.supplier_number=this.tableData[index].supplier_number;
        this.form.comments=this.tableData[index].comments;
        this.mode="view";
      },
      handleDelete(index, row) {
        this.$confirm('Are you sure delete this supplier ?')
          .then(_ => {
          var vUrl='/api/purchase_order/delete/'+this.tableData[index].purchase_order_number;
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
        var vUrl='/api/purchase_order/browse_data/'+this.page;
        axios.get(vUrl)
            .then((Response) => {
                this.tableData = Response.data.rows;
            })
            .catch((err) => {
                console.log("Error")
            })
      },
      onSubmit() {
        const formData = new FormData()
        Object.keys(this.form).forEach((key) => {
            formData.append(key, this.form[key])
        })
        formData.append("mode",this.mode);

        var vUrl='/api/purchase_order/save';

        axios.post(vUrl,formData)
            .then((Response) => {
                this.dialogVisible=false;
                this.message="Success";
                this.loadData();
            })
            .catch((err) => {
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