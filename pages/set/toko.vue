<template>
    <div>
        <el-tabs :tab-position="tabPosition" >
            <el-tab-pane label="Nama Toko">
                    <mpo-set-toko />
            </el-tab-pane>
            <el-tab-pane label="Rekening">            
                <mpo-set-rekening />
            </el-tab-pane>
            <el-tab-pane label="Pengiriman">
                <mpo-set-jasa-kirim />
            </el-tab-pane>
            <el-tab-pane label="Slider">
                <mpo-set-slider />
            </el-tab-pane>
        </el-tabs>
    </div>
</template>
<script>
import setToko from '~/components/SetToko'
import setRekening from '~/components/SetRekening'
import setJasaKirim from '~/components/SetJasaKirim'
import setSlider from '~/components/SetSlider'
export default {
    head: {
        title:'Setting Toko'
    },
    components:{
        'mpo-set-toko':setToko,
        'mpo-set-rekening':setRekening,
        'mpo-set-jasa-kirim':setJasaKirim,
        'mpo-set-slider':setSlider
    },
    data(){
        return {
            tabPosition: 'right'
        }
    }
}
</script>