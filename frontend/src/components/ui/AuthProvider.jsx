import { useEffect, createContext, useContext, useState } from 'react'
import { useUser, useAuth } from '@clerk/clerk-react'
import axios from 'axios'

const API_URL = import.meta.env.MODE === "development" 
  ? `http://${window.location.hostname}:3000/api` 
  : '/api'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const { user, isLoaded: isUserLoaded } = useUser()
  const { isSignedIn, isLoaded: isAuthLoaded } = useAuth()
  const [isSynced, setIsSynced] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function syncUserWithBackend() {
      if (!isUserLoaded || !isAuthLoaded) return

      if (!isSignedIn || !user) {
        setIsSynced(false)
        setIsLoading(false)
        return
      }

      try {
        // Sync user data with backend (creates user if doesn't exist)
        await axios.post(`${API_URL}/syncUser`, {
          userId: user.id,
          email: user.primaryEmailAddress?.emailAddress,
          firstName: user.firstName,
          lastName: user.lastName,
          imageUrl: user.imageUrl
        })
        setIsSynced(true)
      } catch (error) {
        console.error('Failed to sync user with backend:', error)
        // Still allow the user to use the app even if sync fails
        setIsSynced(true)
      } finally {
        setIsLoading(false)
      }
    }

    syncUserWithBackend()
  }, [user, isUserLoaded, isAuthLoaded, isSignedIn])

  const value = {
    userId: user?.id || null,
    user,
    isLoaded: isUserLoaded && isAuthLoaded && !isLoading,
    isSignedIn,
    isSynced
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuthContext() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuthContext must be used within an AuthProvider')
  }
  return context
}