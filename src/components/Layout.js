import React from 'react'
import Header from './Header'
import { Outlet } from 'react-router-dom'

const Layout = () => {
  return (
    <div className='font-roboto px-4 py-2'>
      <Header />
      <main>
        <Outlet />
      </main>
    </div>
  )
}

export default Layout