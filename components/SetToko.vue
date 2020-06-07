<template>
    <div>
        <h1>Seting Toko</h1>
        <el-col>
          <el-card>
            <p>Nama Toko</p>
            <el-input v-model="nama_toko" />
            <p>Nomor Telpon</p>
            <el-input v-model="nomor_telp" />
            <p>Nama Kontak</p>
            <el-input v-model="nama_kontak" />
            <p>Slogan</p>
            <el-input v-model="slogan" />
            <p>Email</p>
            <el-input type='email' v-model="email" />
            <p>Alamat</p>
            <el-input type="textarea" v-model="alamat" />
            <el-button @click="saveToko" type="primary" style="margin-top:10px"> Save</el-button>
          </el-card>
        </el-col>
    </div>
</template>
<script>

export default {
    data(){
        return {
            nama_toko:'',
            alamat:'',
            nomor_telp:'',
            nama_kontak:'',
            slogan:'',  
            email:'',
        }
    },
    mounted: function(){
        this.loadToko()
    },
    methods: {
      saveToko() {
        const formData = new FormData()
        formData.append("mode","edit");
        formData.append("company_name",this.nama_toko);
        formData.append("street",this.alamat);
        formData.append("invoice_contact",this.nama_kontak);
        formData.append("phone_number",this.nomor_telp);
        formData.append("slogan",this.slogan);
        formData.append("email",this.email);

        var vUrl='/api/company/update_json';
        this.$toast.show("Execute...please wait !").goAway(6000);
        this.$axios.post(vUrl,formData)
            .then((Response) => {
                var d=Response.data
                this.$toast.show("Success").goAway(6000)   
            })
            .catch((err) => {
                this.$toast.show(err).goAway(6000);
                this.message='Error'
            })

        },
        loadToko(){
            var vUrl='/api/company/view_json/';
            this.$toast.show("Execute...please wait!").goAway(6000);
            this.$axios.get(vUrl)
                .then((Response) => {
                    var d=Response.data
                    if(d.success){
                        this.nama_toko=d.row.company_name
                        this.alamat=d.row.street
                        this.nama_kontak = d.row.invoice_contact
                        this.nomor_telp=d.row.phone_number
                        this.slogan=d.row.slogan
                        this.email=d.row.email
                    } else {
                        this.$toast.show("Errror!"+d.message).goAway(6000);
                    }
                })
                .catch((err) => {
                    this.$toast.show(err).goAway(6000);
                })
        },

    }  
}
</script>