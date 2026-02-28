import React from 'react'
import Navbar from '../../../components/dashboard/layout/Navbar'
import Sidebar from '../../../components/dashboard/layout/Sidebar'
const layout = ({children}) => {
  return (
    <div className='min-h-screen bg-(--bg-primary) dark:bg-(--bg-primary) flex'>
        <div className='w-1/8 bg-(--bg-secondary) dark:bg-(--bg-secondary)'>
            <Sidebar className='w-6 h-6' />
        </div>
        <div className='w-5/6'>
            <Navbar />
            {children}  
        </div>
    </div>
  )
}

export default layout