'use client'

import React, { useState } from 'react'

function Auth() {
  const [isLogin, setIsLogin] = useState(true)
  const [message, setMessage] = useState(null)
  const [error, setError] = useState(null)

  const [email,setEmail] = useState('')
  const [password,setPassword] = useState('')
  const [confirmPassword,setConfirmPassword] = useState('')


  function handlelogin(){
    console.log('login')
  }
  function handleSignup(){
    console.log('login')
  }
  return (
    <div className='w-[100vw] h-[100vh] bg-white flex flex-col items-center justify-center'>
      <div>
        <h1 className='text-2xl font-bold text-black'>{isLogin ? 'Login to your account' : 'Register your account'}</h1>
        <div className='flex flex-col gap-3'>
          <div>
            {message && <p className='text-green-600'>{message}</p>}
            {error && <p className='text-red-400'>{error}</p>}
          </div>
          <div className='flex flex-col gap-2'>
            <label htmlFor="" className='text-black'>Email:</label>
            <input type="email" className='border rounded-md px-2' value={email} onChange={(e) => setEmail(e.target.value)}/>
          </div>
          <div className='flex flex-col gap-2'>
            <label htmlFor="" className='text-black'>Password:</label>
            <input type="password" className='border rounded-md px-2' value={password} onChange={(e)=>setPassword(e.target.value)}/>
          </div>
          {
            !isLogin && (<div className='flex flex-col gap-2'>
              <label htmlFor="" className='text-black'>Confirm Password:</label>
              <input type="password" className='border px-2 rounded-md' value={confirmPassword} onChange={(e)=>setConfirmPassword(e.target.value)} />
            </div>)
          }
          {
            isLogin ? (
              <button className='bg-black text-white p-2 rounded-md' onClick={() => {}}>Login</button>
            ) : (
              <button className='bg-black text-white p-2 rounded-md' onClick={() => {}}>Register</button>
            )
          }
          {
            isLogin ? (<p className='text-black'> Don't have an account? <span className='text-blue-600 cursor-pointer' onClick={() => setIsLogin(false)}>Register</span></p>) :
            (<p className='text-black'> Already have an account? <span className='text-blue-600 cursor-pointer' onClick={() => setIsLogin(true)}>Login</span></p>) 
          }
        </div>
      </div>
    </div>
  )
}

export default Auth
