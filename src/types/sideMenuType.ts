
// 사이드 메뉴 타입
type SIDE_MENU_TYPE = {
    path: string,
    name: string,
    icon: string,
    id : number,
    child: Array<SIDE_MENU_TYPE>
}
 
export type { SIDE_MENU_TYPE }