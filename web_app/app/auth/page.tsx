'use client'

import React, { useState } from 'react'

function Auth() {
    const [isLogin,setIsLogin] = useState(true)
    const [message,setMessage] = useState(null)
    const [error,setError] = useState(null)
  return (
    <div className='w-[100vw] h-[100vh] bg-white flex flex-col items-center justify-center'>
        <div>
            <h1 className='text-2xl font-bold text-black'>{isLogin ? 'Login to your account' : 'Register your account'}</h1>
            
        </div>
    </div>
  )
}

export default Auth
