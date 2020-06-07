<template>
    <div>
        <el-card>
            <h1>Slider Picture</h1>
            <p>Slider 1</p>
            <el-input v-model="slider1" />
            <p>Slider 2</p>
            <el-input v-model="slider2" />
            <p>Slider 3</p>
            <el-input v-model="slider3" />
            <p>Slider 4</p>
            <el-input v-model="slider4" />
            <el-button @click="saveSlider" type="primary" style="margin-top:10px"> Save</el-button>

        </el-card>
    </div>
</template>
<script>
export default {
    data(){
        return {
            slider1:'',
            slider2:'',
            slider3:'',
            slider4:'',
        }
    },
    methods: {
        saveSlider(){
          
          return
        }
    }
}
</script>