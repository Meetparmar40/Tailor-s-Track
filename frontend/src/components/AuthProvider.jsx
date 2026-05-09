import { useEffect, createContext, useContext, useState, useMemo } from 'react'
import { useUser, useAuth } from '@clerk/clerk-react'
import axios from 'axios'
import BASE_URL, { setAuthTokenProvider } from '@/lib/api'

const API_URL = `${BASE_URL}/api`

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const { user, isLoaded: isUserLoaded } = useUser()
  const { isSignedIn, isLoaded: isAuthLoaded, getToken } = useAuth()
  const [isSynced, setIsSynced] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [isAuthConfigured, setIsAuthConfigured] = useState(false)

  useEffect(() => {
    setAuthTokenProvider(isSignedIn ? getToken : null)
    setIsAuthConfigured(true)

    return () => setAuthTokenProvider(null)
  }, [getToken, isSignedIn])

  useEffect(() => {
    async function syncUserWithBackend() {
      if (!isUserLoaded || !isAuthLoaded || !isAuthConfigured) return

      if (!isSignedIn || !user) {
        setIsSynced(false)
        setIsLoading(false)
        return
      }

      try {
        // Sync user data with backend (creates user if doesn't exist)
        await axios.post(`${API_URL}/syncUser`)
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
  }, [user, isUserLoaded, isAuthLoaded, isAuthConfigured, isSignedIn])

  const isReady = isUserLoaded && isAuthLoaded && isAuthConfigured && !isLoading

  // Get effective userId (considering workspace switching)
  const effectiveUserId = useMemo(() => {
    const storedWorkspace = localStorage.getItem('currentWorkspace')
    if (storedWorkspace) {
      try {
        const workspace = JSON.parse(storedWorkspace)
        return workspace.workspaceOwnerId || user?.id || null
      } catch (e) {
        return user?.id || null
      }
    }
    return user?.id || null
  }, [user?.id])

  const value = {
    userId: isReady ? user?.id || null : null,
    effectiveUserId: isReady ? effectiveUserId : null, // The user ID to use for API calls (could be workspace owner)
    user: isReady ? user : null,
    isLoaded: isReady,
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
