<template>
  <div>
    <!--面包屑导航-->
    <el-breadcrumb separator-class='el-icon-arrow-right'>
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>数据统计</el-breadcrumb-item>
      <el-breadcrumb-item>数据报表</el-breadcrumb-item>
    </el-breadcrumb>

    <el-card>
      <div id='main' style='width: 800px;height: 550px;'></div>
    </el-card>
  </div>
</template>

<script>
import { _getReport } from '../../network/report'
import * as echarts from 'echarts'
import _ from 'lodash'

export default {
  name: 'Reports',
  data () {
    return {
      options: {
        title: {
          text: '用户来源'
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross',
            label: {
              backgroundColor: '#E9EEF3'
            }
          }
        }
      }
    }
  },
  mounted () {
    const myChart = echarts.init(document.getElementById('main'))
    _getReport().then(res => {
      console.log(res)
      const result = _.merge(res.data, this.options)
      myChart.setOption(result)
    })
  }
}
</script>

<style lang='less' scoped>

</style>
