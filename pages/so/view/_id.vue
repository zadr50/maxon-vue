<template>
  <div>
    <h2>Sales Order</h2>
    <template>
      <el-button @click="saveDoc()" size="mini" type="primary">Save</el-button>
      <el-button @click="printDoc()" size="mini" type="warning">Print</el-button>
    </template>
    <i style='color:red'>{{message}}</i>
    <el-divider></el-divider>
    <el-row>
      <el-col :span="20">
      <el-form ref="form" :model="form" label-width="120px">
          <el-col :span="10">
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
          <el-col :span="14">
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
      <h3>Data Items</h3>
      <el-button @click="addRow()" size="mini" type="primary">Add Row</el-button>
      <el-button @click="loadItems()" size="mini" type="success" >Refresh</el-button>
      <el-divider></el-divider>
      <el-table style="width: 100%" :data="tableData">
        <el-table-column label="Kode Barang" prop="item_number">
              <template slot-scope="scope" >
                  <el-input size="small" style="text-align:center"  v-model="scope.row.item_number"  />
              </template>
        </el-table-column>
        <el-table-column label="Nama Barang" prop="description">
              <template slot-scope="scope" >
                <el-input size="small" style="text-align:center"  v-model="scope.row.description"  />
              </template>
        </el-table-column>
        <el-table-column label="Quantity" prop="quantity" width="100px">
              <template slot-scope="scope" >
                <el-input size="small" style="text-align:center"  v-model="scope.row.quantity"  />
              </template>
        </el-table-column>
        <el-table-column label="Satuan" prop="unit" width="100px">
              <template slot-scope="scope" >
                <el-input size="small" style="text-align:center"  v-model="scope.row.unit"  />
              </template>
        </el-table-column>
        <el-table-column label="Harga" prop="price" width="120px">
              <template slot-scope="scope" >
                <el-input size="small" style="text-align:right"  v-model="scope.row.price"  />
              </template>
        </el-table-column>
        <el-table-column label="Jumlah" prop="amount" width="120px">
              <template slot-scope="scope" style="text-align:right" >
                <el-input size="small" style="text-align:right"  v-model="scope.row.amount"  />
              </template>
        </el-table-column>
        <el-table-column>
          <template slot-scope="scope">
            <el-button @click.native.prevent="saveRow(scope.$index, scope.row)" size="mini" type="primary" >Save</el-button>
            <el-button @click="deleteRow(scope.$index, scope.row)"  size="mini"  type="danger" >Delete</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-row>
    <el-dialog title="Line Items"  :visible.sync="dialogVisible"
      width="60%" :before-close="handleClose">
      <el-divider></el-divider>
      <el-form ref="form" :model="form" label-width="120px">
          <el-form-item label="Item Number">
              <el-input v-model="form_item.item_number"></el-input>
          </el-form-item>
          <el-form-item label="Description">
              <el-input v-model="form_item.description"></el-input>
          </el-form-item>                  
          <el-form-item label="Quantity">
              <el-input v-model="form_item.quantity"></el-input>
          </el-form-item>
          <el-form-item label="Unit">
              <el-input v-model="form_item.unit"></el-input>
          </el-form-item>
          <el-form-item label="Price">
              <el-input v-model="form_item.price"></el-input>
          </el-form-item>
          <el-form-item label="Discount%">
              <el-input v-model="form_item.discount"></el-input>
          </el-form-item>
          <el-form-item label="Amount">
              <el-input v-model="form_item.amount"></el-input>
          </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">Cancel</el-button>
        <el-button type="primary" @click="onSubmit">Confirm</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
  import axios from 'axios'
  export default {
    components: {
    },
    head: {
      title: 'Sales Order View'
    },
    data(){
      return {
        message:'',
        dialogVisible:false,
        tableData: [{item_number: 'Loading...'}],
        form: {
          sales_order_number: this.$route.params.id,
          sold_to_customer: 'CASH',
          sales_date: new Date(),
          salesman: 'OFFICE',
          payment_terms: 'KREDIT',
          comments: '',
        },
        form_item: {
          item_number:'',
          description:'',
          quantity:'',
          unit:'',
          price:'',
          discount:'',
          amount:'',
          line_number:'',
        },
        columns: [
          {label: "Item Number", field:"item_number"},
          {label: "Description", field:"description"},
          {label: "Qty", field:"quantity"},
          {label: "Unit", field:"unit"},
          {label: "Price", field:"price"},
          {label: "Disc%", field:"discount"},
          {label: "Jumlah", field:"amount"},
          {label: "Line", field:"line_number"},
        ],
        addCount: 0,

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
            formData.append(key, this.form[key])
        })
        formData.append("mode",this.mode);

        var vUrl='/api/sales_order/save';

        axios.post(vUrl,formData)
            .then((Response) => {
              console.log(Response);
              if(Response.data.success){
                this.message="Success";
                alert("Data sudah disimpan");
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
        this.$confirm('Are you sure delete this document ?')
          .then(_ => {
          var vUrl='/api/sales_order/delete/'+this.form.sales_order_number;
          axios.get(vUrl)
            .then((Response) => {
                this.message=Response.data.msg;
                window.open("/api/sales_order","_selft");
            })
            .catch((err) => {
                this.message=err;
            })
        })
        .catch(_ => {});        
      },
      getData(){
        var vUrl='/api/sales_order/view/'+this.form.sales_order_number+"?json=true";
        axios.get(vUrl)
        .then((Response) => {
            this.form.sales_order_number = Response.data.sales_order_number;
            this.form.sales_date=Response.data.sales_date;
            this.form.sold_to_customer=Response.data.sold_to_customer;
            this.form.payment_terms=Response.data.payment_terms;
            this.form.salesman=Response.data.salesman;
            this.form.comments=Response.data.comments;
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
        this.message="Loading...";
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
        let newRow  = {label:"",prop:""};
        this.tableData = [newRow,...this.tableData];
        ++ this.addCount;
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

        this.message="Saving...";
        axios.post(vUrl,formData)
          .then((Response) => {              
              this.loadItems();
              this.message="Data sudah tersimpan."  ;
          })
          .catch((err) => {
              this.message=err;
          })
      },
      deleteRow(index, row) {
        this.$confirm('Are you sure delete this supplier ?')
          .then(_ => {
          var vUrl='/api/sales_order/delete_item/'+this.tableData[index].line_number;
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