<template>
  <div>
    <h1><span class='el-icon-paperclip'> Daftar Purchase Order</span></h1>
    <i style='color:red'>{{message}}</i>
    <el-divider></el-divider> 
    Date From: 
    <el-date-picker v-model="date1" type="datetime" size="mini"/>
    <el-date-picker v-model="date2" type="datetime" size="mini"/>
    <el-input v-model="search" size="mini" placeholder="Type to search" style="width:200px" />
    <el-button size="mini" type="success" @click="handleRefresh()"><span class='el-icon-refresh-left'> Refresh</span></el-button>
    <el-button size="mini" type="primary" @click="handleAdd()"><span class='el-icon-document-add'> Addnew</span></el-button>
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
            size="mini" type='warning'
            @click="handleEdit(scope.$index, scope.row)">Edit</el-button>
          <el-button
            size="mini"
            type="danger"
            @click="handleDelete(scope.$index, scope.row)">Delete</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination ref='pagination'  background
      layout="prev, pager, next" @current-change="handleCurrentChange"
      :total="100">
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
            <el-select v-model="form.supplier_number" placeholder="please select supplier">
              <el-option v-for="(sup,idx) in SupplierList" 
                  :label="sup.supplier_name" 
                  :value="sup.supplier_number" 
                  :key="idx" >
              </el-option>
            </el-select>

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
      <i style='color:red'>{{message}}</i>
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
        date1:new Date(),
        date2:new Date(),
        form: {
          purchase_order_number: 'AUTO',
          po_date: new Date(),
          terms: 'KREDIT',
          supplier_number: 'CASH',
          comments: '',
        },
        columns: [
          {label: "Nomor PO", field:"purchase_order_number"},
          {label: "Supplier", field:"supplier_name"},
          {label: "Tanggal", field:"po_date"},
          {label: "Termin", field:"terms"},
          {label: "Jumlah", field:"amount"},
        ],
        SupplierList: [{}],
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
        var vUrl="/po/view/"+this.tableData[index].purchase_order_number;
        window.open(vUrl,"_self");
      },
      handleDelete(index, row) {
        this.$confirm('Are you sure delete this supplier ?')
          .then(_ => {
          this.message="Execute...please wait!"        
          var vUrl='/api/purchase_order/delete/'+this.tableData[index].purchase_order_number;
          axios.get(vUrl)
            .then((Response) => {
                this.message=Response.data.msg;
                this.loadData();
                this.message="Ready"
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
        this.message="Execute...please wait!"        
        this.$toast.info(this.message)

        var vUrl='/api/purchase_order/browse_data/'+this.page+"?sid_date_from="+this.date1+"&sid_date_to="+this.date2;
        axios.get(vUrl)
            .then((Response) => {
                this.tableData = Response.data.rows;
                this.message="Ready."
                this.$toast.clear()
                this.pagination.total=Response.data.rows.length/10

            })
            .catch((err) => {
                console.log("Error")
            })
      },
      onSubmit() {
        this.message="Execute...please wait!"        
        this.$toast.info(this.message)
        const formData = new FormData()
        Object.keys(this.form).forEach((key) => {
          if(key=="po_date"){
            formData.append(key, formatDate(this.form[key]))
          } else {
            formData.append(key, this.form[key])
          }
        })
        formData.append("mode",this.mode);

        var vUrl='/api/purchase_order/save';

        axios.post(vUrl,formData)
            .then((Response) => {
                if(Response.data.success){
                  this.dialogVisible=false;
                  this.message="Ready";
                  this.$toast.clear();
                  this.form.purchase_order_number=Response.data.purchase_order_number;
                  vUrl="/po/view/"+Response.data.purchase_order_number;
                  window.open(vUrl,"_self");
                } else {
                  this.message=Response.data.msg;
                }
            })
            .catch((err) => {
                this.message='Error '+err
            })
        },
        handleSizeChange(val) {
          console.log(`${val} items per page`);
          
        },
        handleCurrentChange(val) {
          console.log(`current page: ${val}`);
          this.page=val;
          this.loadData();
        },
        SupplierListLoad(){
          this.message="Execute...please wait!"        
          var vUrl='/api/supplier/browse_data/1/1000';
          axios.get(vUrl)
              .then((Response) => {
                  this.SupplierList = Response.data.rows;
                  this.message='Ready'
              })
              .catch((err) => {
                  console.log("Error")
          })
      },

    },
    mounted: function(){
      var d=new Date();  var month = d.getMonth();  var day = d.getDate(); var year = d.getFullYear();
      if (month.length < 2)  month = '0' + month;  if (day.length < 2)    day = '0' + day;

      this.date1=[year,month,'01'].join('-')
      this.date2=[year,month+2,'01'].join('-')

      this.loadData()
      this.SupplierListLoad()

    },
       
  }
</script>