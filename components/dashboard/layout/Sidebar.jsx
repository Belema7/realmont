import Link from 'next/link'
import React from 'react'

const Sidebar = () => {
  return (
    <div className='min-h-screen bg-(--bg-secondary) dark:bg-(--bg-secondary) flex flex-col items-center py-4'>
        <h1 className='text-2xl font-bold text-(--text-primary) dark:text-(--text-primary) mb-6'>Sidebar</h1>
        <nav className='flex flex-col space-y-4'>
            <Link href='/dashboard' className='text-(--text-primary) dark:text-(--text-primary) hover:text-(--primary) dark:hover:text-(--primary-hover)'>Dashboard</Link>
            <Link href='/dashboard/mylist' className='text-(--text-primary) dark:text-(--text-primary) hover:text-(--primary) dark:hover:text-(--primary-hover)'>My List</Link>
            <Link href='/dashboard/create-list' className='text-(--text-primary) dark:text-(--text-primary) hover:text-(--primary) dark:hover:text-(--primary-hover)'>Create List</Link>
        </nav>

    </div>
  )
}

export default Sidebar