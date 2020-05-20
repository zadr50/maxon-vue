<template>
  <div>
      <h1><span class='el-icon-paperclip'> Daftar Sales Order</span></h1>
      <p><i style='color:red'>{{message}}</i></p>
      <el-divider></el-divider> 
      Date From: 
      <el-date-picker v-model="date1" type="datetime" size="mini"/>
      <el-date-picker v-model="date2" type="datetime" size="mini"/>

      <el-input v-model="search" size="mini" placeholder="Type to search" style="width:200px" />
      <el-button size="mini" type="success" @click="handleRefresh()">Refresh</el-button>
      <el-button size="mini" type="primary" @click="handleAdd()">Addnew</el-button>

  <el-table :data="tableData.filter(data => !search || data.company.toLowerCase().includes(search.toLowerCase()))"
    style="width: 100%">
    <el-table-column v-for="col in columns"  :label="col.label" :prop="col.field" 
        v-bind:key="col"  v-model="tableColumn">
    </el-table-column>
    <el-table-column
      align="right">
      <template slot="header" >
      </template>
      <template slot-scope="scope">
        <el-button  size="mini" type="warning" @click="handleEdit(scope.$index, scope.row)">Edit</el-button>
        <el-button  size="mini"  type="danger" @click="handleDelete(scope.$index, scope.row)">Delete</el-button>
      </template>
    </el-table-column>
  </el-table>
  <el-pagination
      background layout="prev, pager, next"  @current-change="handleCurrentChange" :total="1000">
  </el-pagination>

  <el-dialog title="Master Sales Order"  :visible.sync="dialogVisible"
    width="60%" :before-close="handleClose">
    <el-divider></el-divider>
    <el-form ref="form" :model="form" label-width="120px">
        <el-form-item label="Bukti SO#">
            <el-input v-model="form.sales_order_number"></el-input>
        </el-form-item>
        <el-form-item label="Pelanggan">
            <el-select v-model="form.sold_to_customer" placeholder="please select customer">
              <el-option v-for="(cst,idx) in CustomerList" 
                  :label="cst.company" 
                  :value="cst.customer_number" 
                  :key="idx" >
              </el-option>
            </el-select>
          </el-form-item>                  
        <el-form-item label="Tanggal">
            <el-date-picker
              v-model="form.sales_date"
              type="datetime"
              placeholder="Select date and time"
              default-time="12:00:00">
            </el-date-picker>                              
        </el-form-item>
        <el-form-item label="Termin">
            <el-input v-model="form.payment_terms"></el-input>
        </el-form-item>
        <el-form-item label="Salesman">
            <el-input v-model="form.salesman"></el-input>
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
      title: 'Sales Order'
    },
    data() {
      return {
        tableData: [{sales_order_number: 'Loading...'}],
        search: '',        dialogVisible: false,
        message: "",       mode:"add",
        page:1,            date1: new Date(), date2: new Date(), 
        form: {
          sales_order_number: 'AUTO',
          sold_to_customer: 'CASH',
          sales_date: new Date(),
          salesman: 'OFFICE',
          payment_terms: 'KREDIT',
        },
        columns: [
          {label: "Nomor SO", field:"sales_order_number"},
          {label: "Customer", field:"company"},
          {label: "Tanggal", field:"sales_date"},
          {label: "Salesman", field:"salesman"},
          {label: "Jumlah", field:"amount"},
        ],
        custList: [{label:"",value:"Unknown"},{label:"",value:"CASH"}],
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
        var vUrl="/so/view/"+this.tableData[index].sales_order_number;
        window.open(vUrl,"_self");
      },
      handleDelete(index, row) {
        this.$confirm('Are you sure delete this document ?')
          .then(_ => {
          var vUrl='/api/sales_order/delete/'+this.tableData[index].sales_order_number;
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
        done();
      },
      loadData(){
        var vUrl='/api/sales_order/browse_data/'+this.page+"?sid_date_from="+this.date1+"&sid_date_to="+this.date2;
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

        var vUrl='/api/sales_order/save';

        axios.post(vUrl,formData)
            .then((Response) => {
              console.log(Response);
              if(Response.data.success){
                this.dialogVisible=false;
                this.message="Success";
                this.form.sales_order_number=Response.data.sales_order_number;
                vUrl="/so/view/"+Response.data.sales_order_number;
                window.open(vUrl,"_self");
              } else {
                this.message=Response.data.msg;
              }
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
      },
      CustomerListLoad(){
        var vUrl='/api/customer/browse_data/1/1000';
        axios.get(vUrl)
            .then((Response) => {
                this.CustomerList = Response.data.rows;
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
      this.loadData();
      this.CustomerListLoad();
    },
       
  } 
</script>