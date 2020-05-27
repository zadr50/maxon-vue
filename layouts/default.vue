<template>
  <div>
    <el-container>
      <app-sidebar ref="appSidebar"></app-sidebar>
      <el-col >
        <el-header>
          <div >
            <el-col :sm="2">
              <span @click="onCollapse" class="el-icon-s-fold" style="padding-top:20px;font-size:30px;cursor:pointer"></span>
            </el-col>
            <el-col :span="22">
            <h2><span class='el-icon-folder-opened'> MaxonErp</span></h2>
            <h5>Software Bisnis</h5>
            </el-col>
          </div>           
        </el-header>
        <el-row>
            <el-col :span="24" style="padding-left:20px;background: white;">
              <nuxt />
            </el-col>
        </el-row>
      </el-col>
    </el-container>
  </div>
</template>

<script>

  import { mapStateMutations,mapState } from 'vuex'
  import Menu from '~/components/Menu.vue'
  export default {
    data() {
      return {
        isLoggedIn: true,
      };
    },
    components:{
      "app-sidebar":Menu
    },
    methods: {
      onCollapse() {
        this.$refs.appSidebar.onCollapse()      
      }
    }
  };
</script>

<style>
html {
  font-family: 'Source Sans Pro', -apple-system, BlinkMacSystemFont, 'Segoe UI',
    Roboto, 'Helvetica Neue', Arial, sans-serif;
  font-size: 16px;
  word-spacing: 1px;
  -ms-text-size-adjust: 100%;
  -webkit-text-size-adjust: 100%;
  -moz-osx-font-smoothing: grayscale;
  -webkit-font-smoothing: antialiased;
  box-sizing: border-box;
}

*,
*:before,
*:after {
  box-sizing: border-box;
  margin: 0;
}

.button--green {
  display: inline-block;
  border-radius: 4px;
  border: 1px solid #3b8070;
  color: #3b8070;
  text-decoration: none;
  padding: 10px 30px;
}

.button--green:hover {
  color: #fff;
  background-color: #3b8070;
}

.button--grey {
  display: inline-block;
  border-radius: 4px;
  border: 1px solid #35495e;
  color: #35495e;
  text-decoration: none;
  padding: 10px 30px;
  margin-left: 15px;
}

.button--grey:hover {
  color: #fff;
  background-color: #35495e;
}
.el-header {
    color: white;
    background-color: #545c64;
    border-bottom: #f56c6c 2px solid;
}
.el-menu-item a {
    color: white;
    text-decoration: none;
}
.el-container {
  min-height: 900px;
}
</style>
