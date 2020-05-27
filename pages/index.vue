<template>
    <el-main>
      <el-row>
        <h1>DASHBOARD</h1>        
        <i style='color:red'>{{message}}</i>
        <el-divider></el-divider>
      </el-row>
      <el-row>
        <el-col :span="10" class="box1">
          <el-card class="box-card">            
            <div slot="header" class="clearfix">
              <span><b>PURCHASE</b></span>
              <el-button style="float: right; padding: 3px 0" type="text"> Detail</el-button>
            </div>            
            <div class="text-head">
              {{ total_purchase }}
            </div>
          </el-card>
        </el-col>
        <el-col :span="10" class="box1">
          <el-card class="box-card">
            <div slot="header" class="clearfix">
              <span><b>SALES</b></span>
              <el-button style="float: right; padding: 3px 0" type="text"> Detail</el-button>
            </div>
            <div class="text-head">
              {{ total_sales }}
            </div>
          </el-card>
        </el-col>        
      </el-row>
      <el-row>
        <el-col :span="11" style="margin:10px">
           <el-card>
            <div id="chartColumn" style="width:95%; height:300px;"></div>
           </el-card>
        </el-col>
        <el-col :span="10"  style="margin:10px">
           <el-card>
            <div id="chartBar" style="width:95%; height:300px;"></div>
           </el-card>
        </el-col>
        <el-col :span="11"  style="margin:10px">
            <el-card>
            <div id="chartLine" style="width:95%; height:300px;"></div>
            </el-card>

        </el-col>
        <el-col :span="10"  style="margin:10px">
           <el-card>
            <div id="chartPie" style="width:95%; height:300px;"></div>
           </el-card>
        </el-col>
      </el-row>
    </el-main>
</template>

<script>
  import echarts from 'echarts'
  import axios from 'axios'
  import DialogItem from "@/components/DialogItem.vue";

  export default {
    head: {
      title: 'Dashboard'
    },
    components: {
      DialogItem
    },
    data() {

      return {
        message:'',
        total_purchase:0,
        total_sales:0,
        chartColumn: null,
        chartBar: null,
        chartLine: null,
        chartPie: null,
        supplierDataChartX: [],
        supplierDataChartSeries: [],
        barLegend:[],
        barYAxis:[],
        barSeris:[],
        lineLegend:[],
        lineXAxis:[],
        lineSeries: [],
        pieLegend: [],
        pieSeries: [],
      }
    },
    methods: {
      drawColumnChart() {
                this.chartColumn = echarts.init(document.getElementById('chartColumn'));
                this.chartColumn.setOption({
                  title: { text: 'Purchase' },
                  tooltip: {},
                  xAxis: {
                      data: this.supplierDataChartX
                  },
                  yAxis: {},
                  series: [{
                      name: 'Supplier',
                      type: 'bar',
                      data: this.supplierDataChartSeries 
                    }]
                });
            },
      drawBarChart() {
          this.chartBar = echarts.init(document.getElementById('chartBar'));
          this.chartBar.setOption({
              title: {
                  text: 'Purchase',
                  subtext: 'Yearly'
              },
              tooltip: {
                  trigger: 'axis',
                  axisPointer: {
                      type: 'shadow'
                  }
              },
              legend: {
                  data: this.barLegend
              },
              grid: {
                  left: '3%',
                  right: '4%',
                  bottom: '3%',
                  containLabel: true
              },
              xAxis: {
                  type: 'value',
                  boundaryGap: [0, 0.01]
              },
              yAxis: {
                  type: 'category',
                  data: this.barYAxis 
              },
              series: this.barSeries,

          });
      },
      drawLineChart() {
          this.chartLine = echarts.init(document.getElementById('chartLine'));
          this.chartLine.setOption({
              title: {
                  text: 'Sales'
              },
              tooltip: {
                  trigger: 'axis'
              },
              legend: {
                  data: this.lineLegend
              },
              grid: {
                  left: '3%',
                  right: '4%',
                  bottom: '3%',
                  containLabel: true
              },
              xAxis: {
                  type: 'category',
                  boundaryGap: false,
                  data: this.lineXAxis
              },
              yAxis: {
                  type: 'value'
              },
              series: this.lineSeries 
          });
      },
      drawPieChart() {
          this.chartPie = echarts.init(document.getElementById('chartPie'));
          this.chartPie.setOption({
              title: {
                  text: 'Sales Year',
                  subtext: 'by Customer',
                  x: 'center'
              },
              tooltip: {
                  trigger: 'item',
                  formatter: "{a} <br/>{b} : {c} ({d}%)"
              },
              legend: {
                  orient: 'vertical',
                  left: 'left',
                  data: this.pieLegend
              },
              series: this.pieSeries 
          });
      },
      drawCharts() {
          this.drawColumnChart()
          this.drawBarChart()
          this.drawLineChart()
          this.drawPieChart()
      },
      dashboardData(){
        var vUrl='/api/dashboard/getData';
        axios.get(vUrl)
        .then((Response) => {
            var d = Response.data 
            this.total_purchase=d.total_purchase
            this.total_sales = d.total_sales 

            this.supplierDataChartX=d.supplierDataChartX;
            this.supplierDataChartSeries=d.supplierDataChartSeries;
            
            this.drawColumnChart()

            this.barLegend=d.barLegend;
            this.barYAxis=d.barYAxis;
            this.barSeries=d.barSeries;

            this.drawBarChart()

            this.lineLegend=d.lineLegend;
            this.lineXAxis=d.lineXAxis;
            this.lineSeries=d.lineSeries;

            this.drawLineChart();

            this.pieLegend=d.pieLegend;
            this.pieSeries=d.pieSeries;

            this.drawPieChart();

        })
        .catch((err) => {
            this.message=err;
        })

      }
    },
    mounted: function () {
      this.dashboardData()
    },
    updated: function () {
      this.dashboardData()
    },

  };
</script>
<style>
.box1 {
  padding:10px;
  margin:10px;
}
.text-head {
  font-size: x-large;
}
</style>