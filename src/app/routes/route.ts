import express from 'express'
import { userorute } from '../modules/user/user.route'
import { authroute } from '../modules/auth/auth.routes'
import { vendorroute } from '../modules/vendor/vendor.route'
import { managerroute } from '../modules/manager/manager.route'
import { superadminroute } from '../modules/superadmin/superadmin.route'

const router = express.Router()


const moduleroutes = [
    {
        path: "/user" ,
        route:userorute
    },
    {
        path: "/auth",
        route: authroute
    },
    {
        path: "/vendor",
        route: vendorroute
    },
    {
        path: "/manager",
        route: managerroute
    },
    {
        path: '/superadmin',
        route: superadminroute
    }
]

moduleroutes.forEach(route => router.use(route.path, route.route))


export default router