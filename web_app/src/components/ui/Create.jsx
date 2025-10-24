import React from 'react'

function Create() {
  return (
    <div className='flex flex-col justify-between  pb-4 pt-4 mt-4 shadow  px-4'>
      <p>Create a new Reminder</p>
      <textarea name="" id="" placeholder='Start Writing...' className='border rounded mt-4 p-2 italic '></textarea>
      <button className='border-none bg-black text-white py-3 rounded-lg mt-4 shadow'>Create</button>
    </div>
  )
}

export default Create
