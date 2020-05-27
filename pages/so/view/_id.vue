<template>
  <div>
    <h2><span class='el-icon-paperclip'> Sales Order</span></h2>
    <template>
      <el-button @click="saveDoc()" size="mini" type="primary"><span class='el-icon-coin'> Save</span></el-button>
      <el-button @click="printDoc()" size="mini" type="warning"><span class='el-icon-printer'> Print</span></el-button>

    </template>
    <i style='color:red'>{{message}}</i>
    <el-divider></el-divider>
    <el-row>
      <el-col :md="23">
      <el-form ref="form" :model="form" label-width="120px">
          <el-col :md="11" :sm="23">
            <el-form-item label="Nomor SO#">
              <el-input v-model="form.sales_order_number"></el-input>
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
          </el-col>
          <el-col :md="12" :sm="23">
            <el-form-item label="Pelanggan">
                <el-input v-model="form.sold_to_customer"></el-input>
            </el-form-item>                  
            <el-form-item label="Salesman">
              <el-input v-model="form.salesman"></el-input>
            </el-form-item>
            <el-form-item label="Comments">
              <el-input v-model="form.comments" type="textarea"></el-input>
            </el-form-item>
          </el-col>
      </el-form>    
      </el-col>
    </el-row>
    <el-row>
      <el-col :md="23">
        <h3><span class='el-icon-tickets'> Data Items</span></h3>
        <el-button @click="addRow()" size="mini" type="primary"><span class='el-icon-document-add'> Add Row</span></el-button>
        <el-button @click="loadItems()" size="mini" type="success" ><span class='el-icon-refresh-left'> Refresh</span></el-button>

        <el-divider></el-divider>
        <el-table  :data="tableData" >
          <el-table-column v-for="col in columns"  :label="col.label" :prop="col.field" 
              v-bind:key="col"  v-model="tableColumn">
          </el-table-column>
          <el-table-column width="65">
            <template slot-scope="scope">
              <el-button @click.native.prevent="editRow(scope.$index, scope.row)" size="mini" type="primary" >Edit</el-button>
            </template>
          </el-table-column>
          <el-table-column width="65">
            <template slot-scope="scope">
              <el-button @click="deleteRow(scope.$index, scope.row)"  size="mini"  type="danger" >Del</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-col>
    </el-row>
    <DialogItem ref="dlgItemInput" 
      :afterSubmit="this.loadItems"
      url_save="/api/sales_order/save_item"      
      primary_key="sales_order_number"
      ></DialogItem>
  </div>
</template>

<script>
  import axios from 'axios'
    import DialogItem from "~/components/DialogItem.vue";

  export default {
    components: {DialogItem},
    head: {
      title: 'Sales Order View'
    },
    data(){
      return {
        message:'',
        tableData: [{item_number: 'Loading...'}],
        form: {
          sales_order_number: this.$route.params.id,
          sold_to_customer: 'CASH',
          sales_date: new Date(),
          salesman: 'OFFICE',
          payment_terms: 'KREDIT',
          comments: '',
        },
        columns: [
          {label: "Item Number", field:"item_number"},
          {label: "Description", field:"description"},
          {label: "Qty", field:"quantity"},
          {label: "Unit", field:"unit"},
          {label: "Price", field:"price"},
          {label: "Disc%", field:"discount"},
          {label: "Jumlah", field:"amount"},
        ],
        addCount: 0,
        listItems: [],
        item_search: '',

      }  
    },
    mounted() {
      this.getData();
      this.loadItems();
    },
    methods: {
      saveDoc() {
        const formData = new FormData()
        Object.keys(this.form).forEach((key) => {
            if(key=="po_date"){
            formData.append(key, formatDate(this.form[key]))

            } else {
            formData.append(key, this.form[key])

            }
        })
        formData.append("mode",this.mode);

        var vUrl='/api/sales_order/save';
        this.message="Saving..."
        axios.post(vUrl,formData)
            .then((Response) => {
              console.log(Response);
              if(Response.data.success){
                this.message="Ready";
              } else {
                this.message=Response.data.msg;
              }
            })
            .catch((err) => {
                this.message=err
            })        
      },
      printDoc() {
        var vUrl='/api/sales_order/print_so/'+this.form.sales_order_number;
        window.open(vUrl,"_blank")

      },
      deleteDoc() {
        this.$confirm('Are you sure delete?')
          .then(_ => {
          var vUrl='/api/sales_order/delete/'+this.form.sales_order_number;
          this.message="Delete...please wait !"
          axios.get(vUrl)
            .then((Response) => {
                this.message=Response.data.msg;
                window.open("/api/sales_order","_self");
            })
            .catch((err) => {
                this.message=err;
            })
        })
        .catch(_ => {});        
      },
      getData(){
        var vUrl='/api/sales_order/view/'+this.form.sales_order_number+"?json=true";
        this.message="Loading...please wait !"
        axios.get(vUrl)
        .then((Response) => {
            this.form.sales_order_number = Response.data.sales_order_number;
            this.form.sales_date=Response.data.sales_date;
            this.form.sold_to_customer=Response.data.sold_to_customer;
            this.form.payment_terms=Response.data.payment_terms;
            this.form.salesman=Response.data.salesman;
            this.form.comments=Response.data.comments;
            this.message="Ready"
        })
        .catch((err) => {
            this.message=err;
        })
      },
      handleOpen(key, keyPath) {
        console.log(key, keyPath);
      },
      handleClose(key, keyPath) {
        console.log(key, keyPath);
      },            
      loadItems(){
        this.message="Loading...please wait !";
        var vUrl='/api/sales_order/items/'+this.form.sales_order_number+"?json=true";
        axios.get(vUrl)
          .then((Response) => {
              this.tableData = Response.data.rows;
              this.message="Ready.";
          })
          .catch((err) => {
              this.message=err;
          })        
      },
      addRow:function(){
        var dlg = this.$refs.dlgItemInput
        dlg.nomor_bukti=this.form.sales_order_number
        dlg.item.item_number=""
        dlg.item.description=""
        dlg.item.quantity=""
        dlg.item.unit=""
        dlg.item.price=""
        dlg.item.discount=""
        dlg.item.amount=""
        dlg.item.line_number=""

        this.dialogVisible=true;
        dlg.showDialog()
      },
      editRow(index,row){
        var dlg = this.$refs.dlgItemInput
        dlg.nomor_bukti=this.form.sales_order_number
        dlg.item.item_number=row.item_number
        dlg.item.description=row.description
        dlg.item.quantity=row.quantity
        dlg.item.unit=row.unit
        dlg.item.price=row.price 
        dlg.item.discount=row.discount
        //dlg.item.total_price=row.amounttotal_price
        dlg.item.line_number=row.line_number

        this.dialogVisible=true
        dlg.showDialog()

      },
      saveRow(index, rows) { 
        var vUrl='/api/sales_order/save_item';
        var formData = new FormData()
        formData.append("sales_order_number",this.form.sales_order_number);
        formData.append("item_number",rows.item_number);
        formData.append("description",rows.description);
        formData.append("quantity",rows.quantity);
        formData.append("unit",rows.unit);
        formData.append("price",rows.price);
        formData.append("amount",rows.amount);
        if(rows.line_number) {
          formData.append("mode","edit");
          formData.append("line_number",rows.line_number);
        } else {
          formData.append("mode","add");
        } 

        this.message="Saving...please wait !";
        axios.post(vUrl,formData)
          .then((Response) => {              
              this.loadItems();
              this.message="Ready"  ;
          })
          .catch((err) => {
              this.message=err;
          })
      },
      deleteRow(index, row) {
        this.$confirm('Are you sure delete ?')
          .then(_ => {
          var vUrl='/api/sales_order/delete_item/'+this.tableData[index].line_number;
          this.message="Execute...please wait!"
          axios.get(vUrl)
            .then((Response) => {
                this.message=Response.data.msg;
                this.loadItems();
            })
            .catch((err) => {
                this.message=err;
            })
        })
        .catch(_ => {});
      },
    },
  }


</script>
<style>
.el-table__row .el-input .el-input__inner{
  border-style:solid 1px black;
}
.hover-row .el-input .el-input__inner{
  border-style:solid;   
}

</style>