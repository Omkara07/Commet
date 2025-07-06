import Header from '@/components/headers/header'
import NavigationSidebar from '@/components/navigation/navigation-sidebar'
import React from 'react'

const MainLayout = ({ children }: { children: React.ReactNode }) => {
    return (
        <div className='h-full'>
            <div className='hidden md:flex h-full w-[72px] inset-y-0 z-30 flex-col fixed border-r-2 transition-all duration-300 rounded-br-xl rounded-tr-xl'>
                <NavigationSidebar />
            </div>
            <main className='h-full md:pl-[72px]'>
                <Header />
                {children}
            </main>

        </div>
    )
}

export default MainLayout
