import React from 'react'
import ReminderCard from './ReminderCard'

function View() {
  return (
    <div className='p-4 mt-4 shadow flex flex-col gap-4 '>
      <p>Already Existing Affiramations</p>
        <div className='flex flex-col gap-3 mt-2 '>
            <ReminderCard/>
            <ReminderCard/>
            <ReminderCard/>
            <ReminderCard/>
            <ReminderCard/>
            <ReminderCard/>
            <ReminderCard/>
        </div>
    </div>
  )
}

export default View
