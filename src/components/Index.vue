<template>
  <div id="index">
    <div class="index-container-item index-container-item1">
      <div class="index-container-item-title">
        数据统计
        <div class="index-container-item-line"></div>
      </div>
      <div class="index-container-item-mid">
        <div class="index-container-item-mid-item" :style="midItem1">
          <p>兑换数量</p>
          <p>{{totalList.exchangeCount}}</p>
        </div>
        <div class="index-container-item-mid-item" :style="midItem2">
          <p>学生数量</p>
          <p>{{totalList.studentCount}}</p>
        </div>
        <div class="index-container-item-mid-item" :style="midItem3">
          <p>老师数量</p>
          <p>{{totalList.teacherCount}}</p>
        </div>
        <div class="index-container-item-mid-item" :style="midItem4">
          <p>总商品数</p>
          <p>{{totalList.totalCommodities}}</p>
        </div>
      </div>
    </div>
    <div class="index-container-item">
      <div class="index-container-item-title">
        兑换数量
        <div class="index-container-item-line"></div>
      </div>
      <div class="index-container-item-mid index-container-item-mid1">
        <div id="exchangeNum" width="100%" height="100%"></div>
      </div>
    </div>
    <div class="index-container-item index-container-item2">
      <div class="index-container-item-item">
        <div class="index-container-item-title">
          积分数量
          <div class="index-container-item-line"></div>
        </div>
        <div class="index-container-item-mid index-container-item-mid1">
          <div id="integral" width="100%" height="100%"></div>
        </div>
      </div>
      <div class="index-container-item-item">
        <div class="index-container-item-title">
          学生数量
          <div class="index-container-item-line"></div>
        </div>
        <div class="index-container-item-mid index-container-item-mid1">
          <div id="student" width="100%" height="100%"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import echarts from "echarts";
  export default {
    name: 'index',
    data() {
      return {
        totalList:{},
        midItem1: {
          backgroundImage: "url(" + require("../assets/img/index/midItem1.png") + ")",
          backgroundRepeat: "no-repeat",
          backgroundSize: "100% 100%"
        },
        midItem2: {
          backgroundImage: "url(" + require("../assets/img/index/midItem2.png") + ")",
          backgroundRepeat: "no-repeat",
          backgroundSize: "100% 100%"
        },
        midItem3: {
          backgroundImage: "url(" + require("../assets/img/index/midItem3.png") + ")",
          backgroundRepeat: "no-repeat",
          backgroundSize: "100% 100%"
        },
        midItem4: {
          backgroundImage: "url(" + require("../assets/img/index/midItem4.png") + ")",
          backgroundRepeat: "no-repeat",
          backgroundSize: "100% 100%"
        }
      }
    },
    mounted() {
      var that = this;
      setTimeout(function() {
        that.dataTotal();
        that.getExchange();
        that.getIntegral();
        that.getStudent();
      }, 500)
    },
    methods: {
      dataTotal(){
        var that = this;
        that.$axios({
          url: that.$globalAPI + 'homepage/getDataStatistics',
          method: 'get',
          data: {},
        }).then(function(res) {
          that.totalList = res.data;
        }).catch(function(error) {
          console.log(error);
        });
      },
      getExchange: function() {
        var that = this;
        that.$axios({
          url: that.$globalAPI + 'homepage/getExchangeCount',
          method: 'get',
          data: {},
        }).then(function(res) {
          var yCounts = res.data.count;
          var xDays = res.data.days;
          setTimeout(function(){
            var exchangeNum = echarts.init(document.getElementById('exchangeNum'));
            var numOptions = {
              grid: {
                top: '15',
                left: '20',
                bottom: '20',
                width: "97%"
              },
              xAxis: {
                type: 'category',
                data: xDays,
                axisLine: {
                  lineStyle: {
                    color: '#99d9fe',
                  }
                },
                axisLabel: {
                  textStyle: {
                    color: '#333333'
                  }
                }
              },
              yAxis: {
                splitLine: {
                  show: true,
                  lineStyle: {
                    color: ['#99d9fe'],
                    width: 1,
                    type: 'solid'
                  }
                },
                axisLine: {
                  lineStyle: {
                    color: '#99d9fe',
                  }
                },
                axisLabel: {
                  textStyle: {
                    color: '#333333'
                  }
                }
              },
              series: [{
                data: yCounts,
                type: 'line',
                symbolSize: 6, //设定实心点的大小
                lineStyle: {
                  normal: {
                    color: '#ffb63f',
                    width: 3
                  }
                },
                itemStyle: {
                  normal: {
                    color: '#ffb63f',
                    width: 6
                  }
                },
                smooth: true
              }]
            };
            exchangeNum.setOption(numOptions);
          },500)
        }).catch(function(error) {
          console.log(error);
        });
      },
      getIntegral: function() {
        var that = this;
        that.$axios({
          url: that.$globalAPI + 'homepage/getIntegralTotal',
          method: 'get',
          data: {},
        }).then(function(res) {
          var yCounts = res.data.count;
          var xDays = res.data.grade;
          setTimeout(function(){
            var integralNum = echarts.init(document.getElementById('integral'));
            var integralOptions = {
              grid: {
                top: '15',
                left: '30',
                bottom: '20',
                width: "97%"
              },
              xAxis: {
                type: 'category',
                data: xDays,
                axisLine: {
                  lineStyle: {
                    color: '#99d9fe',
                  }
                },
                axisLabel: {
                  textStyle: {
                    color: '#333333'
                  }
                }
              },
              yAxis: {
                splitLine: {
                  show: true,
                  lineStyle: {
                    color: ['#99d9fe'],
                    width: 1,
                    type: 'solid'
                  }
                },
                axisLine: {
                  lineStyle: {
                    color: '#99d9fe',
                  }
                },
                axisLabel: {
                  textStyle: {
                    color: '#333333'
                  }
                }
              },
              series: [{
                data: yCounts,
                type: 'line',
                symbolSize: 6, //设定实心点的大小
                lineStyle: {
                  normal: {
                    color: '#ff52a9',
                    width: 3
                  }
                },
                itemStyle: {
                  normal: {
                    color: '#ffb63f',
                    width: 6
                  }
                },
                smooth: true
              }]
            };
            integralNum.setOption(integralOptions);
          },500)
        }).catch(function(error) {
          console.log(error);
        });
      },
      getStudent: function() {
        var that = this;
        that.$axios({
          url: that.$globalAPI + 'homepage/getStudentCount',
          method: 'get',
          data: {},
        }).then(function(res) {
          var yCounts = res.data.count;
          var xDays = res.data.grade;
          setTimeout(function(){
         var studentNum = echarts.init(document.getElementById('student'));
         var studentOptions = {
           grid: {
             top: '15',
             left: '30',
             bottom: '20',
             width: "97%"
           },
           xAxis: {
             type: 'category',
             data: xDays,
             axisLine: {
               lineStyle: {
                 color: '#99d9fe',
               }
             },
             axisLabel: {
               textStyle: {
                 color: '#333333'
               }
             }
           },
           yAxis: {
             splitLine: {
               show: true,
               lineStyle: {
                 color: ['#99d9fe'],
                 width: 1,
                 type: 'solid'
               }
             },
             axisLine: {
               lineStyle: {
                 color: '#99d9fe',
               }
             },
             axisLabel: {
               textStyle: {
                 color: '#333333'
               }
             }
           },
           series: [{
             data: yCounts,
             type: 'bar',
             barWidth: '25%',
             lineStyle: {
               normal: {
                 color: '#ff52a9',
                 width: 3
               }
             },
             itemStyle: {
               normal: {
                 barBorderRadius: [10, 10, 0, 0],
                 color: function(params) {
                   var colorList = ['#ffc745', '#53ff6b', '#42c2ff', '#5474ff', '#bd4cff', '#ff74e7'];
                   return colorList[params.dataIndex];
                 }
               }
             },
             smooth: true
           }]
         };
         studentNum.setOption(studentOptions);
          },500)
        }).catch(function(error) {
          console.log(error);
        });
      }
    }
  }
</script>

<style scope>
  #index {
    width: 100%;
    height: 100%;
    display: flex;
    flex-wrap: wrap;
    align-content: space-between;
  }

  .index-container-item {
    padding: 0 0.28rem;
    width: 100%;
    height: 35.2%;
    background-color: #fff;
    border-radius: 0.1rem;
  }

  .index-container-item1 {
    height: 27.8%;
  }

  .index-container-item2 {
    padding: 0;
    background-color: transparent;
    display: flex;
    justify-content: space-between;
  }

  .index-container-item-title {
    position: relative;
    width: 100%;
    height: .76rem;
    line-height: 0.76rem;
    font-size: 0.24rem;
    background-image: linear-gradient(135deg, #34b1fd, #4e76ff);
    -webkit-background-clip: text;
    color: transparent;
    font-weight: bold;
  }

  .index-container-item-line {
    position: absolute;
    bottom: 0.2rem;
    width: 0.97rem;
    height: 0.03rem;
    background: linear-gradient(to right, #34b1fd, #4e76ff);
  }

  .index-container-item-mid {
    width: 100%;
    height: 58%;
    display: flex;
    justify-content: space-evenly;
    align-items: center;
  }

  .index-container-item-mid-item {
    width: 23%;
    height: 100%;
    border-radius: 0.1rem;
  }

  .index-container-item-mid-item p {
    text-align: center;
    font-size: 0.26rem !important;
    font-weight: bolder;
    color: #fff;
  }

  .index-container-item-mid-item p:first-child {
    margin-top: 0.35rem;
    line-height: 60%;
    font-weight: 400;
  }

  .index-container-item-mid-item p:last-child {
    margin-top: 0.1rem;
    line-height: 40%;
    font-weight: bold;
  }

  .index-container-item-mid1 {
    height: 65%;
  }

  #exchangeNum,
  #integral,
  #student {
    width: 100%;
    height: 100%;
  }

  .index-container-item-item {
    padding: 0 0.2rem;
    width: 46.8%;
    height: 100%;
    border-radius: 0.1rem;
    background-color: #fff;
  }
</style>
