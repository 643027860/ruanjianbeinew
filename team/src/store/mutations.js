import {CHOICEMENUID,REQMENUS1, OCMENUS} from './mutation_types'

export default {
  //折叠菜单
  [OCMENUS](state){
    state.isCollapse = !state.isCollapse
  },
  //获取菜单数组
  [REQMENUS1](state,menus){
    state.menus = menus
  },
  //改变菜单ID
  [CHOICEMENUID](state,id){
    state.menuId = id
  },
}
