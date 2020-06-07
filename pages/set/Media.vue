<template>
    <div>
        <el-row>
            <el-col >
              <el-card>  
                <p>{{message}}</p>  
                <el-upload
                class="upload-demo"
                drag
                action="../api/media/upload"
                :on-preview="handlePreview"
                :on-remove="handleRemove"
                :file-list="fileList"
                list-type="picture"
                multiple>
                <i class="el-icon-upload"></i>
                <div class="el-upload__text">Drop file here or <em>click to upload</em></div>
                <div class="el-upload__tip" slot="tip">jpg/png files with a size less than 500kb</div>
                </el-upload>
              </el-card>  
            </el-col>
        </el-row>

    </div>
</template>
<script>
export default {
    head: {
        title:'List Images',
    },
    data() {
        return {
            message:'',
            fileList:[]
        }
    },
    methods: {
        handlePreview() {

        },
        handleRemove(file, fileList) {
            console.log(file)
            var vUrl='/api/media/delete/'+file.name;
            this.message="Execute....please wait";
            this.$axios.get(vUrl)
                .then((Response) => {
                    var d=Response.data                
                    this.message=d.message
                })
                .catch((err) => {
                    this.message="Error"
                })

        },
        loadDirImage() {
            var vUrl='/api/media/';
            this.message="Execute....please wait";
            this.$axios.get(vUrl)
                .then((Response) => {
                    var d=Response.data
                    this.message=""
                    this.fileList=d.fileList
                })
                .catch((err) => {
                    this.message="Error"
                })

        }
    },
    mounted: function() {
        this.loadDirImage();
    }
}
</script>
<style scoped>
.el-upload-list--picture .el-upload-list__item {
    width:30%;
    float: left;
    margin-right: 10px;
}

</style>