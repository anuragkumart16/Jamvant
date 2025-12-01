import React, { useEffect, useState } from 'react'
import { View, ActivityIndicator } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useRouter } from 'expo-router'
import * as SecureStore from 'expo-secure-store'

function Index() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    checkToken()
  }, [])

  const checkToken = async () => {
    try {
      const token = await SecureStore.getItemAsync('authToken')
      if (token) {
        router.replace('/dashboard')
      } else {
        router.replace('/auth')
      }
    } catch (error) {
      console.error('Error checking token:', error)
      router.replace('/auth')
    } finally {
      setLoading(false)
    }
  }

  return (
    <SafeAreaView style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#000' }}>
      <ActivityIndicator size="large" color="#fff" />
    </SafeAreaView>
  )
}

export default Index