import React from 'react'
import { MdDelete } from "react-icons/md";
import { MdEdit } from "react-icons/md";

function ReminderCard({name}) {
    const [isEditing, setIsEditing] = React.useState(false);
  return (
    <div className='border flex flex-row items-center justify-between rounded p-2 py-4'>
        <input type="text" defaultValue={name ? name : "No Name"} className='outline-none w-80' disabled={!isEditing}/>
        <div className='flex gap-2'>
        <MdEdit className='self-end' size={20} onClick={() => setIsEditing(!isEditing)} />
            <MdDelete className='self-end' size={20} />
        </div>
    </div>
  )
}

export default ReminderCard
