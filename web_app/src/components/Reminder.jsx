import React from 'react'
import Navbar from './ui/Navbar'
import Create from './ui/Create'
import View from './ui/View'

function Reminder() {
  return (
    <div className='h-[100vh] w-[100vw]'>
        <Navbar/>
        <Create/>
        <View/>
    </div>
  )
}

export default Reminder
