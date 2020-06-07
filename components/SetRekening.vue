<template>
    <div>
            <el-col>
                <h1>Seting Rekening</h1>
                <el-card>
                <p>Rekening 1</p>
                <el-input size="mini" v-model="rekening[0].nomor" placeholder="Nomor"/>
                <el-input size="mini" v-model="rekening[0].nama" placeholder="Nama Pemilik" />
                <el-input size="mini" v-model="rekening[0].bank" placeholder="Bank" />
                <el-input size="mini" v-model="rekening[0].cabang" placeholder="Cabang" />

                <p>Rekening 2</p>
                <el-input size="mini" v-model="rekening[1].nomor" placeholder="Nomor" />
                <el-input size="mini" v-model="rekening[1].nama" placeholder="Nama Pemilik" />
                <el-input size="mini" v-model="rekening[1].bank" placeholder="Bank" />
                <el-input size="mini" v-model="rekening[1].cabang" placeholder="Cabang" />

                <el-button @click="saveRekening" type="primary" style="margin-top:10px"> Save</el-button>

                </el-card>

            </el-col>

    </div>
</template>
<script>
export default {
    data(){
        return {
            rekening:[
                {bank:'',nomor:'',cabang:'',nama:''},
                {bank:'',nomor:'',cabang:'',nama:''},
            ],

        }
    },
    methods: {
        saveRekening(){
          
          return
        }
    }

}
</script>