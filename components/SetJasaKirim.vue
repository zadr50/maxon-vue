<template>
    <div>
        <h1>Jasa Pengiriman</h1>
        <el-card>
            <p>Jasa Kirim 1</p>
            <el-input v-model="jasaKirim1" />
            <p>Jasa Kirim 2</p>
            <el-input v-model="jasaKirim2" />
            <p>Jasa Kirim 4</p>
            <el-input v-model="jasaKirim3" />
            <p>Jasa Kirim 5</p>
            <el-input v-model="jasaKirim4" />
            <el-button @click="saveJasaKirim" type="primary" style="margin-top:10px"> Save</el-button>

        </el-card>
    </div>
</template>
<script>
export default {
    data(){
        return {
            jasaKirim1:'',
            jasaKirim2:'',
            jasaKirim3:'',
            jasaKirim4:''
        }
    },
    methods: {
        saveJasaKirim(){
          
          return
        }
    }

}