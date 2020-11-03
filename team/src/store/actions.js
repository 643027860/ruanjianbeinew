import {CHOICEMENUID,REQMENUS1,OCMENUS} from './mutation_types'

export default {
  //是否打开菜单
  ocmenus({commit}){
    commit(OCMENUS)
  },
  //获取菜单数组
  reqMenus1({commit},menus){
    commit(REQMENUS1,menus)
  },
  //选择菜单ID
  choiceMenuId({commit},id){
    commit(CHOICEMENUID,id)
  },
}
