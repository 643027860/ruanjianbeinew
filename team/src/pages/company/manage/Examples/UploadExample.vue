<template>
  <div class="myGraphicalData"
       v-loading="loading"
       element-loading-text="数据加载中"
       element-loading-spinner="el-icon-loading"
       element-loading-background="rgba(0, 0, 0, 0.3)">
    <el-dialog title="模型分析" :visible.sync="dialogExampleVisible" top="30vh" width="500px">
      <el-form ref="form"v-model="analyzeForm" label-width="80px">
        <el-form-item label="分析名称">
          <el-input v-model="analyzeForm.aeName" :fous="analyzeForm.errorTip = ''"></el-input>
        </el-form-item>
        <el-form-item label="模型算法">
          <el-select v-model="analyzeForm.mlAlgo" placeholder="请选择模型算法"  :fous="analyzeForm.errorTip = ''">
            <el-option label="Python" value="Python"></el-option>
            <el-option label="R" value="R"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="数据模型">
          <el-select v-model="analyzeForm.mlId" placeholder="请选择数据模型"  :fous="analyzeForm.errorTip = ''">
            <el-option
              v-for="model in modellist"
              :key="model.mlId"
              :label="model.mlName"
              :value="model.mlId">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="数据匹配">
          <div style="margin-bottom: 10px;" v-for="(name,index) in analyzeForm.qu.nameData" :key="index">
            <el-select style="width: 43%!important;" clearable v-model="analyzeForm.analyzeSmallDTOS[index].qsField" :disable="true" placeholder="请选择数据模型">
              <el-option :label="name.fdName" :value="name.fdName"></el-option>
            </el-select>
            <span style="display:inline-block;width: 10%!important;text-align: center;">-</span>
            <el-select style="width: 43%!important;" clearable v-model="analyzeForm.analyzeSmallDTOS[index].msName" placeholder="请选择匹配参数">
              <el-option
                v-for="model in analyzeForm.modelSmallVOS"
                :key="model.msId"
                :label="model.msName"
                :value="model.msName">
              </el-option>
            </el-select>
          </div>
        </el-form-item>
        <p style="text-align: center;margin: 0px;margin-bottom: 6px;color: red;" v-if="analyzeForm.errorTip">{{analyzeForm.errorTip}}</p>
        <el-form-item>
          <el-button style="width: 100%;" type="primary" @click="analyze()">立即分析</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
    <el-dialog title="参数限制" :visible.sync="dialogCreateVisible" top="30vh" width="1000px">
      <el-table
        :data="quData"
        empty-text="暂无参数"
        class="myTable">
        <el-table-column
          type="index"
          width="50">
        </el-table-column>
        <el-table-column
          prop="name"
          label="参数名"
          min-width="100">
        </el-table-column>
        <el-table-column
          prop="type"
          label="参数类型"
          min-width="100">
        </el-table-column>
        <el-table-column
          label="限制参数"
          min-width="220">
          <template slot-scope="scope">
            <el-select  v-model="quData[scope.$index].pmName" placeholder="请选择限制参数" @change="pmNameChange(scope.$index)">
              <el-option v-for="(tag,index) in quData[scope.$index].tags" :key="index" :label="tag.fdName" :value="tag.fdName"></el-option>
            </el-select>
          </template>
        </el-table-column>
        <el-table-column
          label="限制类型"
          min-width="100">
          <template slot-scope="scope">
            <span>{{quData[scope.$index].pmtype}}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="限制条件"
          min-width="220">
          <template slot-scope="scope">
            <el-select v-model="quData[scope.$index].judgeType" placeholder="请选择限制判断条件">
              <el-option v-for="(judgeType,index) in quData[scope.$index].judges" :key="index" :label="judgeType" :value="judgeType == '精准'?'equal':judgeType"></el-option>
            </el-select>
          </template>
        </el-table-column>
        <el-table-column
          label="限制值"
          min-width="500">
          <template slot-scope="scope">
            <el-input v-if="scope.row.pmtype == '字符串' || scope.row.pmtype == '数字'" placeholder="请输入参数限制值" v-model="quData[scope.$index].pmValue"></el-input>
            <el-date-picker
              v-if="scope.row.pmtype == '时间' && scope.row.judgeType == 'equal'"
              v-model="quData[scope.$index].pmValue"
              type="datetime"
              placeholder="请选择限制日期"
              format="yyyy-MM-dd HH:mm:ss"
              value-format="yyyy-MM-dd HH:mm:ss"
            >
            </el-date-picker>
            <el-date-picker
              v-if="scope.row.pmtype == '时间' && scope.row.judgeType == '模糊'"
              v-model="quData[scope.$index].pmValue1"
              type="datetime"
              placeholder="请选择最早限制日期"
              format="yyyy-MM-dd HH:mm:ss"
              value-format="yyyy-MM-dd HH:mm:ss"
            >
            </el-date-picker>
            <el-date-picker
              v-if="scope.row.pmtype == '时间' && scope.row.judgeType == '模糊'"
              v-model="quData[scope.$index].pmValue2"
              type="datetime"
              placeholder="请选择最晚限制日期"
              format="yyyy-MM-dd HH:mm:ss"
              value-format="yyyy-MM-dd HH:mm:ss"
            >
            </el-date-picker>
            <el-select v-if="scope.row.pmtype == 'bool'" v-model="quData[scope.$index].pmValue" placeholder="请选择参数限制值">
              <el-option label="false" :value="false"></el-option>
              <el-option label="true" :value="true"></el-option>
            </el-select>
          </template>
        </el-table-column>
      </el-table>
      <div style="text-align: right;margin-top: 20px">
        <el-button style="padding: 10px 16px;" type="primary" @click="createTu">确认创建</el-button>
      </div>
    </el-dialog>
    <el-row :gutter="15">
      <el-col :xs="24" :sm="24" :md="18" :lg="18" :xl="18" v-show="myDatas.length > 0">
        <div class="graphicalDiv" v-for="(myData,index) in myDatas" :key="index">
          <div v-if="!myData.loading">
            <div class="titleDiv dataTitleDiv" >
              <p class="titleP clearFloat" style="line-height: 48px;">
                {{myData.queryName}}
                <span class="titleIconSpan">
                  <i class="el-icon-delete" @click="deleteTu(myData.id)"></i>
                  <el-button type="text" @click="toAnalyze(myData)">模型分析</el-button>
                  <a class="myFileLink" :href="myData.data.quUrl">数据集</a>
                </span>
              </p>
            </div>
            <div class="contentDiv">
              <MyLine :MyLineId="myData.id" :myData="myData" v-if="myData.chartType=='折线图'"></MyLine>
              <MyPie :myPieId="myData.id" :myData="myData" v-if="myData.chartType=='饼图'"></MyPie>
              <MyBar :MyBarId="myData.id" :myData="myData" v-if="myData.chartType=='柱形图'"></MyBar>
            </div>
          </div>
          <div v-else
               style="height: 100%"
               v-loading="myData.loading"
               element-loading-text="数据拼命拉取中"
               element-loading-spinner="el-icon-loading"
               element-loading-background="rgba(0, 0, 0, 0)">
          </div>
        </div>
      </el-col>
      <el-col :xs="24" :sm="24" :md="18" :lg="18" :xl="18" v-show="myDatas.length == 0">
        <div class="graphicalDiv emptyGraphicalDiv">
          <div class="titleDiv">
            <p class="titleP clearFloat">
              新增实例
              <span class="titleIconSpan">
                <i class="el-icon-plus" @click="addActiveName"></i>
              </span>
            </p>
          </div>
        </div>
      </el-col>
      <el-col :xs="24" :sm="24" :md="6" :lg="6" :xl="6" class="el-collapse-margin">
        <el-collapse v-model="activeNames">
          <el-collapse-item title="新增实例" name="0" class="createDiv">
            <div class="searchGraphicalDiv">
              <el-form :model="createForm" label-width="65px">
                <el-form-item label="实例名" class="searchInput">
                  <el-input v-model="createForm.queryName" placeholder="请输入实例名"></el-input>
                </el-form-item>
                <el-form-item label="图类型">
                  <el-select v-model="createForm.chartType" placeholder="请选择基本表">
                    <el-option label="折线图" value="折线图"></el-option>
                    <el-option label="饼图" value="饼图"></el-option>
                    <el-option label="柱形图" value="柱形图"></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="X轴字段" class="createX">
                  <el-tag
                    v-for="tag in createForm.xData"
                    :key="tag.fdId"
                    v-show="tag.fdName"
                    closable
                    @close="handleXClose(tag)"
                  >
                    {{tag.fdName}}
                  </el-tag>
                  <el-tag
                    v-if="xData.fdName"
                    style="opacity: 0.5;transition: 0s;margin: 0;"
                  >
                    {{xData.fdName}}
                  </el-tag>
                </el-form-item>
                <el-form-item label="Y轴字段" class="createY">
                  <el-tag
                    v-for="tag in createForm.yData"
                    :key="tag.fdId"
                    v-show="tag.fdName"
                    closable
                    @close="handleYClose(tag)"
                  >
                    {{tag.fdName}}
                  </el-tag>
                  <el-tag
                    v-if="yData.fdName"
                    style="opacity: 0.5;transition: 0s;margin: 0;"
                  >
                    {{yData.fdName}}
                  </el-tag>
                </el-form-item>
                <el-form-item>
                  <div class="buttonDiv">
                    <el-button size="small" @click="resetCreateForm" style="width: 40%;" class="searchButton">重置</el-button>
                    <el-button size="small" type="primary" @click="toCreateTu" style="width: 40%;" class="searchButton searchButtonRight">下一步</el-button>
                  </div>
                </el-form-item>
              </el-form>
            </div>
          </el-collapse-item>
        </el-collapse>
        <el-collapse v-model="activeNames">
          <el-collapse-item title="筛选数据" name="1">
            <div class="searchGraphicalDiv">
              <el-form :model="searchForm" label-width="60px">
                <el-form-item label="数据库">
                  <el-select v-model="searchForm.dbType" placeholder="请选择数据库">
                    <el-option label="mysql" value="mysql"></el-option>
                    <el-option label="postgresql" value="postgresql"></el-option>
                    <el-option label="sqlserver" value="sqlserver"></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="数据源">
                  <el-select v-model="searchForm.dbId" placeholder="请选择数据源">
                    <el-option :label="source.dbName" :value="source.dbId" v-for="(source,index) in sources" :key="index"></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="基本表">
                  <el-select v-model="searchForm.dtId" placeholder="请选择基本表">
                    <el-option :label="dtName.dtName" :value="dtName.dtId" v-for="(dtName,index) in dtNames" :key="index"></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item>
                  <el-button size="small" type="primary" style="width: 100%;" class="searchButton" @click="reqAll">查询</el-button>
                </el-form-item>
              </el-form>
            </div>
          </el-collapse-item>
        </el-collapse>
        <el-collapse class="overPointr" v-model="activeNames" v-for="(collapse,index) in collapses" :key="index" v-if="collapse.tags && collapse.tags.length > 0">
          <el-collapse-item :title="collapse.dbName + ' / ' + collapse.dtName" :name="index+2">
            <div class="searchGraphicalDiv">
              <div v-for="(tag,index1) in collapse.tags" :key="index1">
                <p class="tagP overPointr">
                  <el-tag
                    @mousedown.native="moveTag($event,tag,collapse.tags)"
                  >
                    {{tag.fdName}}
                  </el-tag>
                  <span style="margin: 0px;">
                    ：
                  </span>
                  <span>
                    {{tag.fdComment}}
                  </span>
                </p>
              </div>
            </div>
          </el-collapse-item>
        </el-collapse>
      </el-col>
    </el-row>
  </div>
</template>

<script>
  import MyLine from '../../../../components/ChangeCharts/myLine'
  import MyPie from '../../../../components/ChangeCharts/myPie'
  import MyBar from '../../../../components/ChangeCharts/myBar'
  import {REQDATASOURCEDBTYPE,REQAllTABLE,REQAll,UPLOADONEINTER,REQONEINTER} from '../../../../api/types'
  import {REQALLMODEL,REQONEMODEL,UPLOADANALYZE} from '../../../../api/types'
  import {REQPARAMS,REQPARAMSJUDGE} from '../../../../api/types'
   import {mapState,mapActions} from 'vuex'
  export default {
    name:'ExampleList',
    components: {MyLine,MyPie,MyBar},
    data () {
      return {
        xData:'',                           //虚拟X字段数据
        yData:'',                           //虚拟Y字段数据
        sources:[],                         //数据源
        dtNames:[],                         //数据源下的基本表
                                            //创建实例的表单
        createForm:{
          queryName:'',                     //查询实例名
          chartType:'折线图',               //图表类型，默认为折线图
          yData:[],                         //Y轴参数
          xData:[],                         //X轴参数
        },
        dialogCreateVisible:false,          //设置字段限制
        quData:[],                          //参数总集合，用于挑选限制参数

        paramsType:{},                      //限制参数类型

                                            //查询字段表单，数据源Id，基本表id，数据库类型
        searchForm:{
          dbType:'mysql',
          dbId:'',
          dtId:'',
        },
                                            //数据分析表单
        analyzeForm:{
          mlAlgo:'Python',                  //模型算法
          aeName:'',                        //分析名称
          mlId:'',                          //模型ID
          quId:'',                          //实例ID
          qu:{},                            //实例
          modelSmallVOS:{},                 //模型参数
          analyzeSmallDTOS:[]               //匹配数组
        },

        myDatas:[],                         //展示数据

        dialogExampleVisible:false,         //是否弹出选择模型弹窗
        modelList:[],                       //模型列表
        modellist:[],                       //条件模型列表

        activeNames:['1'],                  //搜索框折叠面板
        collapses: [],                      //字段组合

        loading:false,
      }
    },
    methods: {
      ...mapActions(['choiceMenuId']),

      //查看数据源列表
      async reqDataSourceList(){
        var pageNum = 1
        var pageSize = 100
        var{dbType} = this.searchForm
        var result = await REQDATASOURCEDBTYPE({pageNum,pageSize},dbType)
        if(result.status === 0){
          this.sources = result.data.databaseVOS
          if(this.sources[0]){
            this.searchForm.dbId = this.sources[0].dbId       //默认选中第一个数据源
          }
        }else{
          if(result.msg){
            var message = result.msg
          }else{
            var message = '获取数据源失败，请重试'
          }
          this.message(message,'error',1500)
        }
      },
      //查看某个数据源中所有的表
      async reqAllTables(dbId){
        var result = await REQAllTABLE(dbId)
        if(result.status === 0){
          this.dtNames = result.data
          if(this.dtNames[0]){
            this.searchForm.dtId = this.dtNames[0].dtId       //默认选中第一个表的Id
          }
        }else{
          if(result.msg){
            var message = result.msg
          }else{
            var message = '获取该数据源下的基本表失败，请重试'
          }
          //this.message(message,'error',1500)
        }
      },
      //查看某个表中所有的字段
      async reqAll(){
        var {collapses,sources,dtNames} = this
        var {dbId,dtId} = this.searchForm
        if(dtId){
          var had = false    //标志是否请求过改表字段
          collapses.map(item => {
            if(item.dtId == dtId && item.dbId == dbId){
              had = true
            }
          })
          var dbName = sources.find(source => {
            return source.dbId == dbId
          }).dbName
          var dtName = dtNames.find(dtName => {
            return dtName.dtId == dtId
          }).dtName
          if (!had){
            var result = await REQAll(dtId)
            if(result && result.status === 0){
              var tags = result.data.sort((p, n) => p.fdName.length - n.fdName.length)   //按长度排序
              this.collapses.unshift({dbName,dtName,dbId,dtId,tags})
            }else{
              if(result.msg){
                var message = result.msg
              }else{
                var message = '获取字段失败，请重试'
              }
              this.message(message,'error',1500)
            }
          }
        }
      },

      //获取限制参数类型
      async reqParamsType(){
        var result = await REQPARAMS()
        if(result && result.status === 0){
          this.paramsType = result.data
        }
      },
      //前往下一步创建图表
      toCreateTu(){
        var {quData} = this
        var {queryName,chartType,yData,xData} = this.createForm
        if(yData.length > 0 && xData.length > 0  && chartType && queryName){
          //进行下一步限制参数进行创建图表的时候，将右侧的条件全部收缩，在展开最上方的创建图表
          this.activeNames = this.activeNames.filter(item => item == '0')
          this.dialogCreateVisible = true
        }else{
          this.message('请输入所有条件再进行查询实例','warning',1500)
        }
      },
      //创建图表,生成实例
      async createTu(){
        var {quData} = this
        var {queryName,chartType,yData,xData} = this.createForm
        if(yData.length > 0 && xData.length > 0 && quData.length > 0 && chartType && queryName){
          this.dialogCreateVisible = false
          var queryDTOS = []
          var param = {}
          var nameData = []                                                 //所有参数名数组，用于之后表格显示参数所用
          quData.map(item => {
            param = {}
            param.chartType = chartType
            param.chartOption = item.chartOption
            param.fdId = item.fdId
            if(item.pmValue1 || item.pmValue2){
              param.params = []
              if(item.pmValue1){
                param.params.push({
                  judgeType: 'bigger',
                  pmName: item.pmName,
                  pmType: item.pmType,
                  pmValue:item.pmValue1
                })
              }
              if(item.pmValue2){
                param.params.push({
                  judgeType: 'smaller',
                  pmName: item.pmName,
                  pmType: item.pmType,
                  pmValue:item.pmValue2
                })
              }
              queryDTOS.push(param)
            }else{
              if(item.pmType == '数值'){
                var pmValue = item.pmValue * 1
              }else{
                var pmValue = item.pmValue
              }
              param.params = [{
                judgeType: item.judgeType,
                pmName: item.pmName,
                pmType: item.pmType,
                pmValue:pmValue
              }]
              queryDTOS.push(param)
            }
            nameData.push(item)
          })
          this.myDatas.push({loading:true})                                 //为了显示拉取数据中而加入的空数据
          var result = await UPLOADONEINTER(queryDTOS,queryName)
          if(result.status === 0){
            this.resetCreateForm()
            this.reqFieldList(result.data,xData,yData,nameData,chartType,queryName)   //获取到参数进行查询数据
          }else{
            this.myDatas = this.myDatas.filter(myData => !myData.loading)   //请求失败后，去掉为了显示拉取数据中的空数据
            if(result.msg){
              var message = result.msg
            }else{
              var message = '生成实例失败，请重试'
            }
            this.message(message,'error',1500)
          }
        }else{
          this.message('请输入所有条件再进行查询实例','warning',1500)
        }
      },
      //查询实例，生成图表
      async reqFieldList(quId,xData,yData,nameData,chartType='折线图',queryName){
        var result = await REQONEINTER(quId)
        var id = new Date().getTime() + ''                                          //用于标识该表ID
        this.myDatas = this.myDatas.filter(myData => !myData.loading)               //去掉为了显示拉取数据中的空数据
        if(result && result.status == 0){
          //获取数据之后进行处理，横坐标放X轴，纵坐标放Y轴,y轴属性名放yNameData，x轴属性名放xNameData,全部字段名放nameData,chartType图表类型,quId列表查询ID,id改图标的id,data包含所有返回数据,saveTag为拖动tag时显示的虚影数据,
          //queryName为实例名
          var myData = {data:result.data,x:[],y:[],yNameData:[],xNameData:[],nameData,chartType,quId,id,saveTag:{},queryName}
          var qsVOMap = result.data.qsVOMap
          Object.keys(qsVOMap).forEach(key => {
            var isX = false
            xData.map(x => {
              if(x.fdName == key){
                isX = true
              }
            })
            if(!isX){
              myData.y.push(qsVOMap[key].fieldValues)
              myData.yNameData.push(key)
            }else{
              myData.x.push(qsVOMap[key].fieldValues)
              myData.xNameData.push(key)
            }
          })
          this.myDatas.push(myData)
        }else{
          if(result.msg){
            var message = result.msg
          }else {
            var message = '列表生成查询失败'
          }
          this.message(message,'error',1500)
        }
      },


      //获取大数据模型列表,传入num的话就请求num页数据，否则请求第一页数据
      async reqModels(){
        var pageNum = 1
        var pageSize = 100
        var showFlag = 1
        var result = await REQALLMODEL({pageNum,pageSize,showFlag})
        if(result && result.status === 0){
          this.modelList = result.data
          this.selectModelList()
        }
      },
      //根据选择的算法筛选出对应的模型列表
      selectModelList(){
        var {modelList,analyzeForm} = this
        this.analyzeForm.mlId = ''
        this.modellist = modelList.modelListVOS.filter(item => analyzeForm.mlAlgo == item.mlAlgo)
      },
      //根据模型ID获取模型参数
      async reqOneModel(mlId){
        this.analyzeForm.modelSmallVOS = []
        this.analyzeForm.analyzeSmallDTOS.map(item => {
          item.msName = ''
        })
        if(mlId){
          var result = await REQONEMODEL(mlId)
          if(result && result.status === 0){
            var model = result.data
            this.analyzeForm.modelSmallVOS = model.modelSmallVOS
          }
        }
      },

      //准备对实例进行分析
      toAnalyze(qu){
        this.reqModels()               //获取模型列表
        this.analyzeForm.qu = qu       //保存需要进行分析的实例
        qu.nameData.map(item => {
          this.analyzeForm.analyzeSmallDTOS.push({qsField:item.fdName,msName:''})
        })
        this.dialogExampleVisible = true //打开选择模型弹窗
       },
      //对实例进行分析
      async analyze(){
        var {mlId,qu,aeName,analyzeSmallDTOS} = this.analyzeForm
        var {quId} = qu
        analyzeSmallDTOS = analyzeSmallDTOS.filter(item => {
          if(item.qsField && item.msName){
            return item
          }
        })
        if(mlId.trim() && quId && aeName.trim() && analyzeSmallDTOS.length){
          //获取大数据模型详情
          this.loading = true
          this.dialogExampleVisible = false
          var result = await UPLOADANALYZE({aeName,analyzeSmallDTOS,mlId,quId})
          this.loading = false
          if(result && result.status === 0){
            this.empetyAnalyzeForm()
          }else{
            if(result.msg){
              var message = result.msg
            }else{
              var message = '数据分析失败'
            }
            this.message(message,'error',1500)
          }
        }else{
          this.analyzeForm.errorTip = '请输入完整信息再进行分析'
        }
      },

      //生成实例时限制参数变化
      async pmNameChange(index){
        var pmtype = ''            //保存限制参数类型的中文名
        var pmType = ''            //保存限制参数类型的英文名
        this.quData[index].tags.map(item => {
          if(this.quData[index].pmName === item.fdName){
            pmtype = item.fdType
          }
        })
        this.quData[index].pmtype = pmtype
        if(pmtype === '时间'){
          this.quData[index].judges = ['精准','模糊']
          this.quData[index].pmType = 'DATE'
        }else{
          var {paramsType} = this
          Object.keys(paramsType).forEach(key => {
            if(paramsType[key] === pmtype+'类型'){
              pmType = key
            }
          })
          this.quData[index].pmType = pmType
          var result = await REQPARAMSJUDGE(pmType)
          if(result && result.status === 0){
            this.quData[index].judges = result.data
          }
        }
        this.$set(this.quData,index,this.quData[index])
      },
      //删除所选的图
      deleteTu(id){
        this.myDatas = this.myDatas.filter(myData => myData.id != id)
      },
      //拖动字段以达到选择字段
      moveTag(e,tag,tags){
        //根据传入的值创建一个tag组件
        var span = document.createElement('span')
        tag.type = tag.fdType                  //参数类型
        tag.name = tag.fdName                  //参数名
        tag.tags = tags                        //同库下的其他字段数组
        span.className = 'el-tag el-tag--light'
        span.id = 'newSpan'
        span.innerText = tag.fdName
        span.style.position = 'absolute'            //设置绝对定位是为了之后移动
        span.style.pointerEvents = 'none'           //pointer-events:none可以让鼠标事件无效，从而不影响层级下面的组件鼠标事件，但是，这不能使其键盘事件无效。
        span.style.transition = '0'
        e = e || window.event

        //参照相对位置在页面的位置
        var position = document.getElementsByClassName('myGraphicalData')[0].getBoundingClientRect()
        //鼠标点击tag内的位置
        var myX = e.offsetX || e.layerX
        var myY = e.offsetY || e.layerY
        //鼠标的位置
        var allX = e.clientX
        var allY = e.clientY
        //为了使创造的DOM元素位置是鼠标按下的地方，所以就是鼠标位置-参照位置-鼠标点击tag内位置
        span.style.left = allX - position.x - myX + 'px'
        span.style.top = allY - position.y - myY + 'px'
        //父元素插入新子元素
        document.getElementsByClassName('myGraphicalData')[0].appendChild(span)

        //在按下事件内绑定页面鼠标移动事件，使新建元素随鼠标移动而移动
        document.onmousemove = (e) => {
          //鼠标每次移动都更新一下鼠标的位置
          var my_main = document.getElementsByClassName('myGraphicalData')[0].getBoundingClientRect()
          var my_span = document.getElementById('newSpan').getBoundingClientRect()
          var allX = e.clientX
          var allY = e.clientY
          //为了使创造的DOM元素位置是鼠标按下的地方，所以就是鼠标位置-参照位置-鼠标点击tag内位置
          let left = allX - position.x - myX
          let top = allY  - my_main.y - myY
          //加之判断,防止越界，因为容器有15px左右padding，我想控制其padding内，所以就减去15px
          //X轴方向
          if(left <= 0){
            left = 0
          }
          if(left >= my_main.width - my_span.width - 15){
            left = my_main.width - my_span.width - 15
          }
          //Y轴方向,向上滚动时，my_main.y为负值，所以真正的高还要-y
          if(top <= 0){
            top = 0
          }
          if(top >= my_main.height - my_span.height){
            top = my_main.height - my_span.height
          }
          //设置当前元素的left/top以实现移动效果
          $('#newSpan').css('left',left)
          $('#newSpan').css('top', top)
        }
        //拖动这tag时，如果创建表折叠起来则自动打开
        document.getElementsByClassName('createDiv')[0].onmouseover = (e) => {
          if(this.activeNames.indexOf('0') == -1){
            this.activeNames.push('0')
          }
        }
        //拖动这tag到X轴字段时，X轴出现一个虚影组件
        document.getElementsByClassName('createX')[0].onmouseover = (e) => {
          this.xData = tag
        }
        //拖动这tag到Y轴字段时，Y轴出现一个虚影组件
        document.getElementsByClassName('createY')[0].onmouseover = (e) => {
          this.yData = tag
        }
        //拖动这tag离开X轴字段时，X轴虚影组件消失
        document.getElementsByClassName('createX')[0].onmouseout = (e) => {
          this.xData = ''
        }
        //拖动这tag离开Y轴字段时，Y轴虚影组件消失
        document.getElementsByClassName('createY')[0].onmouseout = (e) => {
          this.yData = ''
        }

        //为每个图都加上移进移出事件，便于拖动更改数据
        let list = document.getElementsByClassName('dataTitleDiv')
        if(list && list.length > 0){
          for(var i = 0;i <= list.length;i++){
            if(document.getElementsByClassName('dataTitleDiv')[i]){
              document.getElementsByClassName('dataTitleDiv')[i].onmouseover = (e) => {
                /*因为id有图的下标 + 该图的id组成，所以要找到对应的图标修改字段，则要提取图的下标*/
                var index = e.target.id.indexOf('-')
                var id = e.target.id.slice(0,index) * 1
                this.myDatas[id].saveTag = tag
              }
              document.getElementsByClassName('dataTitleDiv')[i].onmouseout = (e) => {
                /*因为id有图的下标 + 该图的id组成，所以要找到对应的图标修改字段，则要提取图的下标*/
                var index = e.target.id.indexOf('-')
                var id = e.target.id.slice(0,index) * 1
                this.myDatas[id].saveTag = {}
              }
            }
          }
        }

        //在按下事件内绑定页面鼠标松开事件，父元素移出新建元素，并解除之前绑定的鼠标按下/移动事件
        document.onmouseup = (e) => {
          var span = document.getElementById('newSpan')
          if(span){
            document.getElementsByClassName('myGraphicalData')[0].removeChild(span)
          }
          //鼠标松开时，如果虚拟xData/yData还有值的话代表鼠标并未移开x/y字段，这是就要判断之前是否获取过该字段了，如果获取过则不添加进真实xData/yData里，反之则添加，以实现拖拽字段添加入x/y字段区的效果
          if(this.xData){
            var hadName = this.createForm.xData.find(item => {
              return item.fdId == this.xData.fdId
            })
            if(!hadName){
              var xData = this.xData
              this.xData = ''
              this.createForm.xData.push(xData)
              xData.chartOption = '横轴'
              this.quData.push(xData)
            }
          }
          if(this.yData){
            var hadName = this.createForm.yData.find(item => {
              return item.fdId == this.yData.fdId
            })
            if(!hadName){
              var yData = this.yData
              this.yData = ''
              this.createForm.yData.push(yData)
              yData.chartOption = '纵轴'
              this.quData.push(yData)
            }
          }
          document.onmousemove = null
          document.onmouseup = null
          document.getElementsByClassName('createDiv')[0].onmouseover = null
          document.getElementsByClassName('createX')[0].onmouseover = null
          document.getElementsByClassName('createY')[0].onmouseover = null
          //给每个图解除绑定监听事件
          if(list && list.length > 0){
            for(var i = 0;i <= list.length;i++){
              if(document.getElementsByClassName('dataTitleDiv')[i]){
                document.getElementsByClassName('dataTitleDiv')[i].onmouseover = null
                document.getElementsByClassName('dataTitleDiv')[i].onmouseout = null
                //如果鼠标拖动tag进入图区域时，则判断该图是否已经有该字段，如果没有则加入此字段，反之不加，并清除暂存字段nameData1
                if(this.myDatas[i].saveTag){
                  var had = false
                  this.myDatas[i].nameData.map(item => {
                    if(item.fdId === this.myDatas[i].saveTag.fdId){
                      had = true
                    }
                  })
                  if(!had){
                    this.myDatas[i].nameData.push(this.myDatas[i].saveTag)
                  }
                  this.myDatas[i].saveTag = {}
                }
              }
            }
          }
        }
      },
      //删除创建表的字段
      handleXClose(tag){
        this.createForm.xData.map((item,index) => {
          if(item.fdId === tag.fdId){
            this.createForm.xData.splice(index, 1)
          }
        })
        this.quData.map((item,index) => {
          if(item.fdId === tag.fdId){
            this.quData.splice(index, 1)
          }
        })
      },
      handleYClose(tag){
        this.createForm.yData.map((item,index) => {
          if(item.fdId === tag.fdId){
            this.createForm.yData.splice(index, 1)
          }
        })
        this.quData.map((item,index) => {
          if(item.fdId === tag.fdId){
            this.quData.splice(index, 1)
          }
        })
      },

      //返回各个表的标题
      getTtitleP(data){
        let dataStr = ''
        if(data!=={}){
          data.yNameData.forEach(key => {
            dataStr += key + '、'
          })
          if (dataStr !== '') {
            dataStr = dataStr.substring(0, dataStr.lastIndexOf('、'))
          }
          dataStr += ' / '
          data.xNameData.forEach(key => {
            dataStr += key + '、'
          })
          if (dataStr !== '') {
            dataStr = dataStr.substring(0, dataStr.lastIndexOf('、'))
          }
        }
        if(dataStr === ''){
          dataStr = 'CPU、内存的利用率'
        }
        return dataStr
      },
      //清空创建表单内容
      resetCreateForm(){
        this.quData = []
        this.createForm.queryName = ''
        this.createForm.chartOption = '折线图'
        this.createForm.yData = []
        this.createForm.xData = []
      },
      //清空选择模型表单内容
      empetyAnalyzeForm(){
        this.analyzeForm = {
          mlAlgo:'Python',
          aeName:'',
          mlId:'',
          quId:'',
          qu:{},
          modelSmallVOS:{},
          analyzeSmallDTOS:[]
        }
      },
      //消息提示
      message(message,type,duration){
        this.$message({
          message,type,duration
        })
      }
    },
    computed:{
      //表为空时点击+打开创建表的侧栏
      addActiveName(){
        return ()=>{
          if(this.activeNames.indexOf('0') == -1){
            this.activeNames.push('0')
          }
        }
      }
    },
    watch: {
      //分析实例的时候改变模型算法的时候更新对应模型
      'analyzeForm.mlAlgo'(newval,oldval){
        this.selectModelList()
      },
      //
      'analyzeForm.mlId'(newval,oldval){
        this.reqOneModel(newval)
      },
      //查询字段的时候，数据库类型/表变化，其余数据也要变化
      'searchForm.dbType'(newval,oldval){
        this.dtNames = []
        this.sources = []
        this.searchForm.dbId = ''                        //修改数据源则重置表名
        this.searchForm.dtId = ''                        //修改数据源则重置表名
        this.reqDataSourceList()                         //获取对应数据源
      },
      'searchForm.dbId'(newval,oldval){
        this.searchForm.dtId = ''                        //修改数据源则重置表名
        if(newval){
          this.reqAllTables(newval)                      //获取对应数据源的所有表
        }
      },
      dialogExampleVisible(newval,oldval){
        if(!newval){
          this.empetyAnalyzeForm()
        }
      },
      dialogCreateVisible(newval,oldval){
        if(!newval){
          this.quData.map(item => {
            item.pmName = ''
            item.pmtype = ''
            item.pmType = ''
            item.pmValue = ''
            item.pmValue1 = ''
            item.pmValue2 = ''
            item.judgeType = ''
          })
        }
      }
    },
    mounted () {
      this.reqDataSourceList()               //获取数据源列表
      this.reqParamsType()                   //获取实例限制参数类型
    },
    activated () {
      this.choiceMenuId('UploadExample')     //初始更新侧边导航栏的选中
    }
  }
</script>

<style lang="less">
  @import "../../../../assets/css/el-collapse/el-collapse";
  @import "../../../../assets/css/el-tag/el-tag";
  @import "../../../../assets/css/input/input";
  @import "../../../../assets/css/el-dialog/el-dialog";
  @media (any-hover: hover){
    .myGraphicalData{
      .graphicalDiv{
        .titleDiv{
          .titleP{
            .titleIconSpan{
              &:hover{
                cursor: pointer;
              }
              button{
                color: white;
                font-size: 16px;
                &:hover{
                  color: greenyellow !important;
                }
              }
              i{
                &:hover{
                  font-weight: bold;
                  color: rgb(64,158,255) !important;
                }
              }
            }
          }
        }
      }
    }
  }
  .myGraphicalData{
    position: relative;
    min-height: calc(100vh - 100px);
    .emptyGraphicalDiv{
      height: 48px!important;
      overflow: hidden;
      .titleDiv{
        .titleP{
          margin: 0;
          line-height: 48px;
        }
      }
    }
    .graphicalDiv{
      position: relative;
      height: 430px;
      margin-bottom: 23px;
      &:nth-last-child(1){
        margin-bottom: 0px;
      }
      background-color: rgba(0,0,0,0.25);
      border: 1px solid rgb(128,128,128);
      transition: 0.3s;
      .titleDiv{
        border-bottom: 1px solid rgb(128,128,128);
        .titleP{
          height: 48px;
          font-size: 16px;
          display: block;
          padding: 0 10px;
          margin: 0;
          .el-tag{
            margin-top: 9px!important;
            transition: 0s!important;
          }
          .titleIconSpan{
            display: inline-block;
            float: right;
            line-height: 48px;
            margin-right: 5px;
            i{
              font-size: 18px;
              margin: 0 5px;
              cursor: pointer;
              transition: 0.2s;
            }
            .myFileLink{
              font-size: 16px;
              line-height: 48px;
              margin: 0 10px;
            }
          }
        }
      }
      .contentDiv{
        height: 380px;
        padding: 20px;
      }
    }
    .searchGraphicalDiv{
      padding: 20px;
      background-color: rgba(0,0,0,0.25);
      border: 1px solid rgb(128,128,128);
      .tagP{
        margin: 0px;
        color: white;
      }
      .buttonDiv{
        text-align: left!important;
      }
      .searchInput,.el-select{
        width: 100% !important;
        input{
          width: 100%!important;
        }
      }
      .createX,.createY{
        z-index: 2;
        .el-tag{
          margin-left: 0!important;
          margin-right: 15px!important;
        }
      }
      /*因为创建拖动的tag，z-index为-1，为了监听tag移进事件，所以给以下两个样式加z-index为2*/
      .createDiv{
        z-index: 2;
      }
    }
  }
  @media screen and(max-width: 767px){
    .myGraphicalData{
      max-width: 100vw;
      overflow: hidden;
      .graphicalDiv{
        height: 383px;
        margin-bottom: 15px;
        .titleDiv{
          p{
            height: 20px;
            line-height: 20px;
            font-size: 14px;
          }
        }
        .contentDiv{
          height: 340px;
          padding: 10px;
        }
      }
    }
  }
</style>
