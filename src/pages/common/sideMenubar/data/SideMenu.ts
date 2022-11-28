import loadable, { LoadableComponent } from '@loadable/component';

const Flyer = loadable(() => import('pages/list'));
const RegisterFlyer = loadable(() => import('pages/list/component/RegisterFlyer'));

// 사이드 메뉴
type SIDE_MENU_TYPE = {
    path: string,
    name: string,
    icon: string,
    id: number,
    component: LoadableComponent<any> | null,
    child: Array<Omit<SIDE_MENU_TYPE, 'child'>>
    addPath: string[],
}

const sideMenus: Array<SIDE_MENU_TYPE> = [
    {
        path: "/list",
        name: "HOME",
        icon: "vcard",
        id: 100,
        component: Flyer,
        child: [],
        addPath: []
    },
    {
        path: "/register",
        name: "등록하기",
        icon: "vcard",
        id: 200,
        component: RegisterFlyer,
        child: [],
        addPath: []
    },
];

export {
    sideMenus
}

export type {
    SIDE_MENU_TYPE
}
