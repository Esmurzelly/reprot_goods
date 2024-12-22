import React from 'react'
import Header from './Header'
import { Outlet } from 'react-router-dom'

const Layout = () => {
  return (
    <div>
      <header className='bg-red-700'>
        <p>Layoutasd</p>
        <div className='p-10'>123123</div>
        <Header />
      </header>
      <main>
        <Outlet />
      </main>
    </div>
  )
}

export default Layout