import { Outlet } from 'react-router-dom'
import Card from './Card'
import { AdminSideNav } from './AdminSidenav'


export const  AdminLayout =() =>{
    return (
        <div className='flex max-h-fit min-h-full bg-gradient-to-br from-orange-50 via-amber-50 to-orange-100 '>
            <div className='min-w-[12%]  '>
                <AdminSideNav />
            </div>
            <div className='flex flex-col min-w-[80%] '>
                <div className="h-fit">
                    <Card>
                        <Outlet />
                    </Card>
                </div>
            </div>
        </div>
    )
}