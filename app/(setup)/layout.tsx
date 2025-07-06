import Header from '@/components/headers/header'
import React from 'react'

const SetupLayout = ({ children }: { children: React.ReactNode }) => {
    return (
        <div>
            <Header />
            {children}
        </div>
    )
}

export default SetupLayout
