<template>
  <div>
    <!-- 面包屑导航区 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>数据统计</el-breadcrumb-item>
      <el-breadcrumb-item>部门人数</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图区:各部门人数汇总 -->
    <el-card style="height:500px;width:1100px">
      <div>
        <span class="titleClass">
          公司各部门人数总和，请选择汇总类型：
          <el-select v-model="selectPic" @change="selectChanged">
            <el-option
              v-for="item in pic"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </span>
      </div>
      <!-- 2.为ECharts准备一个具备大小（宽高）的Dom -->
      <div id="one" style="width: 750px;height:400px;" class="mainClass"></div>
    </el-card>

    <!-- 各个部门下各职位人数汇总 -->
    <el-card style="height:500px;width:1100px;margin-top: 25px;">
      <div style="width: 750px;height:400px;" class="mainClass">
        <!-- 2.为ECharts准备一个具备大小（宽高）的Dom -->
        公司各部门各职位人数总和，请选择部门：
        <el-cascader
          v-model="departmentsSelect"
          :options="departments"
          :props="moreSearchProps"
          style="width:300px"
          @change="cascaderChange"
        ></el-cascader>
        <br />
        <br />
        <span style="margin-left:225px">汇总类型：</span>
        <el-radio-group v-model="radio" >
          <el-radio :label="1">饼状图</el-radio>
        </el-radio-group>
        <div id="main" style="width: 750px;height:300px;margin-top: 25px"></div>
      </div>
    </el-card>
  </div>
</template>
<script>
// 1.导入
import echarts from "echarts";
export default {
  data() {
    return {
      selectPic: "",
      //公司总人数
      headcount: 0,
      departments: [],
      departmentsSelect: [],
      radio: 1,
      moreSearchProps: {
        value: "name",
        label: "name",
        children: "firstChildren",
        expandTrigger: "hover"
      },
      //图形选择
      pic: [
        {
          value: 1,
          label: "条形图"
        },
        {
          value: 2,
          label: "饼状图"
        }
      ],
      //柱状图
      option: {
        color: ["#3398DB"],
        tooltip: {
          trigger: "axis",
          axisPointer: {
            // 坐标轴指示器，坐标轴触发有效
            type: "shadow" // 默认为直线，可选为：'line' | 'shadow'
          }
        },
        grid: {
          left: "20%",
          right: "4%",
          bottom: "1%",
          containLabel: true
        },
        xAxis: [
          {
            type: "category",
            data: [],
            axisTick: {
              alignWithLabel: true
            },
            axisLabel: {
              rotate: 30,
              interval: 0,
              textStyle: {
                fontSize: "14px"
              },
              formatter: function(params) {
                var newParamsName = "";
                var paramsNameNumber = params.length;
                var provideNumber = 23; //一行显示几个字
                var rowNumber = Math.ceil(paramsNameNumber / provideNumber);
                if (paramsNameNumber > provideNumber) {
                  for (var p = 0; p < rowNumber; p++) {
                    var tempStr = "";
                    var start = p * provideNumber;
                    var end = start + provideNumber;
                    if (p == rowNumber - 1) {
                      tempStr = params.substring(start, paramsNameNumber);
                    } else {
                      tempStr = params.substring(start, end) + "\n";
                    }
                    newParamsName += tempStr;
                  }
                } else {
                  newParamsName = params;
                }
                return newParamsName;
              }
            }
          }
        ],
        yAxis: [
          {
            type: "value"
          }
        ],
        series: [
          {
            name: "部门人数",
            type: "bar",
            barWidth: "50%",
            data: []
          }
        ]
      },
      //饼图1
      option2: {
        backgroundColor: "#2c343c",
        title: {
          text: "部门人数汇总",
          left: "center",
          top: 20,
          textStyle: {
            color: "#ccc"
          }
        },

        tooltip: {
          trigger: "item",
          formatter: "{a} <br/>{b} : {c} ({d}%)"
        },

        visualMap: {
          show: false,
          min: 0,
          max: 0,
          inRange: {
            colorLightness: [0, 1]
          }
        },
        series: [
          {
            name: "各部门人数",
            type: "pie",
            radius: "55%",
            center: ["50%", "50%"],
            data: [].sort(function(a, b) {
              return a.value - b.value;
            }),
            roseType: "radius",
            label: {
              color: "rgba(255, 255, 255, 0.3)"
            },
            labelLine: {
              lineStyle: {
                color: "rgba(255, 255, 255, 0.3)"
              },
              smooth: 0.2,
              length: 10,
              length2: 20
            },
            itemStyle: {
              color: "#c23531",
              shadowBlur: 200,
              shadowColor: "rgba(0, 0, 0, 0.5)"
            },

            animationType: "scale",
            animationEasing: "elasticOut",
            animationDelay: function(idx) {
              return Math.random() * 200;
            }
          }
        ]
      },
      //饼图2
      option3: {
        title: {
          text: "各部门各职位人数汇总",
          subtext: "纯属虚构",
          left: "center"
        },
        tooltip: {
          trigger: "item",
          formatter: "{a} <br/>{b} : {c} ({d}%)"
        },
        legend: {
          orient: "vertical",
          left: "left",
          data: []
        },
        series: [
          {
            name: "访问来源",
            type: "pie",
            radius: "55%",
            center: ["50%", "60%"],
            data: [],
            emphasis: {
              itemStyle: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: "rgba(0, 0, 0, 0.5)"
              }
            }
          }
        ]
      }
    };
  },
  created() {
    this.getHeadNumber();
    this.getDepartments();
  },
  mounted() {},
  methods: {
    //条形图
    async total() {
      // 3.基于准备好的dom，初始化echarts实例
      var myChart = echarts.init(document.getElementById("one"));
      //5.展示,使用刚指定的配置项和数据显示图表。
      myChart.setOption(this.option, true);
    },
    //select选择框改变事件
    selectChanged() {
      if (this.selectPic === 1) {
        this.total();
      } else {
        this.pie();
      }
    },
    //饼状图
    async pie() {
      // 3.基于准备好的dom，初始化echarts实例
      var myChart = echarts.init(document.getElementById("one"));
      //5.展示,使用刚指定的配置项和数据显示图表,true表示数据不合并。
      myChart.setOption(this.option2, true);
    },
    //获取数据
    async getHeadNumber() {
      const { data: res } = await this.$http.get("total/report");
      if (res.status === 200) {
        //员工总数
        for (var i = 0; i < res.obj.number.length; i++) {
          this.headcount = this.headcount + res.obj.number[i];
        }
        //条形图数据
        this.option.xAxis[0].data = res.obj.department;
        this.option.series[0].data = res.obj.number;

        //饼状图数据
        for (var j = 0; j < res.obj.number.length; j++) {
          if (res.obj.number[j] > this.option2.visualMap.max) {
            this.option2.visualMap.max = res.obj.number[j];
          }
        }
        this.option2.visualMap.max = this.option2.visualMap.max + 1;
        for (var i = 0; i < res.obj.department.length; i++) {
          this.option2.series[0].data[i] = {
            value: res.obj.number[i],
            name: res.obj.department[i]
          };
        }
      } else {
        return this.$message.error("获取总人数失败！");
      }
    },
    //获取部门信息
    async getDepartments() {
      const { data: res } = await this.$http.get(
        " grade/getDepartmentsNotlevel2"
      );
      if (res.status === 200) {
        this.departments = res.obj;
      } else {
        return this.$message.error("加载失败！");
      }
    },
    //级联选择器改变事件
    async cascaderChange() {
      this.option3.legend.data = [];
      this.option3.series[0].data = [];
      if (this.radio === 1) {
        //获取各部门下各职位人数的统计数据
        const { data: res } = await this.$http.post("total/departPeopleTotal", {
          departmentName: this.departmentsSelect.join("/")
        });
        if (res.status === 200) {
          this.option3.legend.data = res.obj.department;
          for (var i = 0; i < res.obj.department.length; i++) {
            this.option3.series[0].data[i] = {
              value: res.obj.number[i],
              name: res.obj.department[i]
            };
          }
        } else {
          return this.$message.error("获取数据失败!");
        }
        // 3.基于准备好的dom，初始化echarts实例
        var myChart = echarts.init(document.getElementById("main"));
        //5.展示,使用刚指定的配置项和数据显示图表,true表示数据不合并。
        myChart.setOption(this.option3, true);
      } else {
        return this.$message.error("请先选择统计的类型！");
      }
    }
  }
};
</script>
<style lang="less" scoped>
.titleClass {
  margin-left: 150px;
}
.mainClass {
  margin-top: 25px;
  margin-left: 150px;
}
</style>