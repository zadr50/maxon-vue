<template>
  <el-aside style="width:200px;margin-right:20px" >
    <img src='@/assets/logo_maxon.png' width="98%" height="100"/>
    <el-menu
      default-active="1"
      class="el-menu-vertical-demo"
      @open="handleOpen"
      @close="handleClose"
      :collapse="isCollapse"
      ref="menu"
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
  </el-aside> 
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
      }
    }
  }
</script>