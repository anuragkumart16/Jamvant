import React from 'react'

function Navbar() {
    const [user, setUser] = React.useState(null);

    return (
        <div className='flex flex-row justify-between items-center border-b px-4 pb-3 pt-4 w-full'>
            <p className='text-xl text-orange-600 font-bold'>Jamvant </p>
            <div className='rounded-[50%] h-[5vh] w-[5vh] bg-amber-950'>

            </div>
        </div>
    )
}

export default Navbar
