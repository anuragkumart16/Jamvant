'use client'

import React, { useEffect, useState } from 'react'

function Auth() {
  const [isLogin, setIsLogin] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')

  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8000'

  const validateFields = () => {
    if (!email || !password) {
      setError('Email and password are required.')
      return false
    }
    if (!isLogin && password !== confirmPassword) {
      setError('Passwords do not match.')
      return false
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters.')
      return false
    }
    setError('')
    return true
  }


  const handleLogin = async () => {
    if (!validateFields()) return

    try {
      const res = await fetch(`${backendUrl}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
        credentials: 'include', // allows cookies
      })

      const data = await res.json()
      if (!res.ok || !data.success) {
        setError(data.message || 'Login failed.')
        return
      }

      setMessage('Login successful!')
      setError('')
    } catch (err) {
      console.error(err)
      setError('Server error. Please try again later.')
    }
  }


  const handleSignup = async () => {
    if (!validateFields()) return

    try {
      const res = await fetch(`${backendUrl}/auth/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
        credentials: 'include',
      })

      const data = await res.json()
      if (!res.ok || !data.success) {
        setError(data.message || 'Signup failed.')
        return
      }

      setMessage('Account created successfully!')
      setError('')
      setIsLogin(true)
    } catch (err) {
      console.error(err)
      setError('Server error. Please try again later.')
    }
  }


  return (
    <div className="w-screen h-screen bg-white flex flex-col items-center justify-center">
      <div className="max-w-sm w-full p-6 rounded-xl">
        <h1 className="text-2xl font-bold text-black mb-4 text-center">
          {isLogin ? 'Login to your account' : 'Register your account'}
        </h1>

        {message && <p className="text-green-600 text-center mb-2">{message}</p>}
        {error && <p className="text-red-500 text-center mb-2">{error}</p>}

        <div className="flex flex-col gap-3">
          <input
            type="email"
            placeholder="Email"
            className="border rounded-md px-3 py-2 text-black"
            value={email}
            onChange={(e) => {
              const val = e.target.value
              setEmail(val)
              if (val && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val)) {
                setError('Invalid email format.')
              } else {
                setError('')
              }
            }}
          />

          <input
            type="password"
            placeholder="Password"
            className="border rounded-md px-3 py-2 text-black"
            value={password}
            onChange={(e) => {
              const val = e.target.value
              setPassword(val)
              if (val.length < 6) {
                setError('Password must be at least 6 characters.')
              } else {
                setError('')
              }
            }}
          />
          {!isLogin && (
            <input
              type="password"
              placeholder="Confirm Password"
              className="border rounded-md px-3 py-2 text-black"
              value={confirmPassword}
              onChange={(e) => {
                const val = e.target.value
                setConfirmPassword(val)
                if (val && val !== password) {
                  setError('Passwords do not match.')
                } else {
                  setError('')
                }
              }}
            />
          )}

          <button
            onClick={isLogin ? handleLogin : handleSignup}
            className="bg-black hover:bg-gray-800 transition text-white py-2 rounded-md"
          >
            {isLogin ? 'Login' : 'Register'}
          </button>

          <p className="text-black text-center">
            {isLogin
              ? <>Don&apos;t have an account?{' '}
                <span
                  className="text-blue-600 cursor-pointer hover:underline"
                  onClick={() => {
                    setIsLogin(false)
                    setMessage('')
                    setError('')
                  }}
                >
                  Register
                </span></>
              : <>Already have an account?{' '}
                <span
                  className="text-blue-600 cursor-pointer hover:underline"
                  onClick={() => {
                    setIsLogin(true)
                    setMessage('')
                    setError('')
                  }}
                >
                  Login
                </span></>}
          </p>
        </div>
      </div>
    </div>
  )
}

export default Auth
