import { DashboardOutlined, ProjectOutlined, ShopOutlined } from "@ant-design/icons";
import { IResourceComponents } from "@refinedev/core";

export const resources: IResourceComponents[] = [
    {
        name: 'dashboard',
        list: '/',
        meta: {
            label: 'Dashboard',
            icon: <DashboardOutlined />
        }
    },
    {
        name: 'companies',
        list: 'companies',
        show: '/compamies/:id',
        create: '/companies/new',
        edit: '/companies/edit/:id',
        meta: {
            lable: 'Companies',
            icon: <ShopOutlined />
        }
    },
    {
        name: 'tasks',
        list: 'tasks',
        create: '/tasks/new',
        edit: '/tasks/edit/:id',
        meta: {
            lable: 'Tasks',
            icon: <ProjectOutlined />
        }
    }
]