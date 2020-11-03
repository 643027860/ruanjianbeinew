import ajax from './ajax'

//const Base = "http://172.17.0.1:8218"
//const Base = "http://lidengyin.nat300.top"
const Base = "http://192.168.3.7:8218"

export const LOGIN = (data) => ajax(Base+"/user-server/login",data,'POST')                                                      //用户登录
export const REGISTER = (data) => ajax(Base+"/user-server/register",data,'POST')                                                //用户注册
export const REQUSERS = () => ajax(Base+"/user-server/role/find/page",{},'POST')                                          //获取用户列表
export const REQONEUSER = (data) => ajax(Base+"/user-server/user/find/id",data,'POST')                                          //获取单一用户
export const UPDATEONEUSER = (data) => ajax(Base+"/user-server/user/update",data,'PUT')                                         //修改单一用户

export const REQDATASOURCELIST = (data) => ajax(Base+"/iso-datasource/dynamics/",data,'GET')                                                                     //查看数据源列表
export const REQDONEATASOURCE = (dbId) => ajax(Base+"/iso-datasource/dynamics/"+dbId,{},'GET')                                                             //查看单一数据源
export const REQDATASOURCEDBTYPE = (data,dbType) => ajax(Base+"/iso-datasource/dynamic/dbType"+'/'+dbType,data,'GET')                                            //根据dbtype查看数据源列表
export const REQDATASOURCEDBTYPEBASE = (data,dbType,dbDatabase) => ajax(Base+"/iso-datasource/dynamic/dbType"+'/'+dbType+'/dbDatabase/'+dbDatabase,data,'GET')   //根据dbtype和dbDatabase查看数据源列表
export const UPLOADDYNAMIC = (data) => ajax(Base+"/iso-datasource/dynamics",data,'POST')                                                                         //动态上传数据源存储
export const REQONEDYNAMIC = (dbId) => ajax(Base+"/iso-datasource/dynamics"+'/'+dbId,{},'GET')                                                             //动态查询语句，使用数据源编号
export const DELETEDYNAMIC = (dbIds) => ajax(Base+"/iso-datasource/dynamics/dbIds/"+dbIds,{},'DELETE')                                                     //数据源列表删除

//字段查询
export const REQAllTABLE = (dbId) => ajax(Base+"/iso-datatable/datatables/dbId/"+dbId)                                        //查看某个数据库的所有数据表
export const REQAll = (dtId) => ajax(Base+"/iso-datafield/fields/dbId/dtId/"+dtId)                                            //查看某个表中所有的字段

//实例查询
export const REQAllINTER = (data) => ajax(Base+"/iso-dataquery/interaction",data)                                             //查看实例列表
export const REQONEINTER = (quId) => ajax(Base+"/iso-dataquery/interaction/"+quId)                                            //查看一个实例
export const REQONEINTERDETAIL = (quId) => ajax(Base+"/iso-dataquery/interaction/querySmall/"+quId)                           //查看一个实例的参数
export const REQPARAMS = () => ajax(Base+"/iso-dataquery/interaction/params")                                                 //生成实例时弹出的限制参数类型
export const REQPARAMSJUDGE = (pmName) => ajax(Base+"/iso-dataquery/interaction/params/judges/"+pmName)                       //生成实例时弹出的限制参数比较方式
export const UPLOADONEINTER = (data,queryName) => ajax(Base+"/iso-dataquery/interaction/"+queryName,data,'POST')        //生成查询实例

//大数据模型
export const REQALLMODEL = (data) => ajax(Base+"/iso-model/models/",data)                                                     //查询大数据模型列表
export const REQALLMODELBYALGO = (data,mlAlgo) => ajax(Base+"/iso-model/models/mlAlgo/"+mlAlgo,data)                          //根据算法语言查询大数据模型列表
export const REQONEMODEL = (mlId) => ajax(Base+"/iso-model/models/mlId/"+mlId)                                                //查询一个大数据模型
export const REQONEMODELDETAIL = (mlId) => ajax(Base+"/iso-model/models/modelSmall/mlId/"+mlId)                               //查询一个大数据模型参数
export const UPLOADONEMODEL = (data) => ajax(Base+"/iso-model/models/",data,'POST')                                     //上传一个大数据模型
export const UPDATEONEMODEL = (data,mlId) => ajax(Base+"/iso-model/models/mlId/"+mlId,data,'PUT')                       //修改一个大数据模型参数

//大数据分析控制器
export const REQALLANALYZE = (data,showFlag) => ajax(Base+"/iso-analyze/analyzes/showFlag/"+showFlag,data)                    //查询大数据分析列表
export const UPLOADANALYZE = (data) => ajax(Base+"/iso-analyze/analyzes",data,'POST')                                   //生成大数据分析
export const UPDATEANALYZE = (data,aeId) => ajax(Base+"/iso-analyze/analyzes/aeId/"+aeId,data,'PUT')                    //修改大数据分析




