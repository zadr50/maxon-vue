<template>
        <el-menu
          default-active="1"
          class="el-menu-vertical-demo"
          @open="handleOpen"
          @close="handleClose"
          :collapse="isCollapse"
          ref="menu"
          background-color="#545c64"
          text-color="#fff"
          active-text-color="#ffd04b">
          <el-menu-item index="2">
            <i class="el-icon-menu"></i>
            <el-link href="/" target="_self"> Dashboard</el-link>
          </el-menu-item>

          <el-submenu index="1" :is-opened="true" >
            <template slot="title">
              <i class="el-icon-location"></i>
              <span>Main Menu</span>
            </template>
            <el-menu-item-group title="Transaction">
              <el-menu-item index="1-1"><NLink to='/po/order'>Purchase Order</NLink></el-menu-item>
              <el-menu-item index="1-2"><NLink to='/so/order'>Sales Order</NLink></el-menu-item>
            </el-menu-item-group>
            <el-menu-item-group title="Master Data">
              <el-menu-item index="1-3"><NLink to='/customer'>Customers</NLink></el-menu-item>
              <el-menu-item index="1-4"><NLink to='/supplier'>Suppliers</NLink></el-menu-item>
              <el-menu-item index="1-5"><NLink to='/inventory'>Inventory</NLink></el-menu-item>
            </el-menu-item-group>
            <el-submenu index="1-4">
              <template slot="title">Laporan</template>
              <el-menu-item index="1-4-1">Laporan Penjualan</el-menu-item>
            </el-submenu>
          </el-submenu>
          <el-menu-item index="4">
            <i class="el-icon-setting"></i>
            <span>Setting</span>
          </el-menu-item>
        </el-menu>
</template>
<style>
  .el-menu-vertical-demo:not(.el-menu--collapse) {
    min-height: 400px;
  }
</style>
<script>
  export default {
    data() {
      return {
        isCollapse: false,
      };
    },
    mounted: function(){
        this.openMenu();
    },
    methods: {
      handleOpen(key, keyPath) {
        console.log(key, keyPath);
      },
      handleClose(key, keyPath) {
        console.log(key, keyPath);
      },
      openMenu(){
        this.$refs.menu.open(1);
      },
      onCollapse(){
        this.isCollapse=!this.isCollapse;
      }
    }
  }
</script>
<style>
.el-menu {
    border-right: 1px solid black;
    --background: url(https://image.freepik.com/free-photo/mysterious-dark-purple-smoke_23-2148231739.jpg);
    background:black;
    
}
.el-menu-item-group__title {
    padding: 7px 0 7px 20px;
    line-height: normal;
    font-size: 12px;
    color: #909399;
}
.el-submenu__title {
    font-size: 14px;
    color: #303133;
}
.el-menu-item:focus, .el-menu-item:hover {
    outline: 0;
    background-color: #66b1ff;
}
.el-link.el-link--default {
    color: #e4e7ed;
}
</style>