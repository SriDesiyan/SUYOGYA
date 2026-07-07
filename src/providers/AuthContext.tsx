import { createContext, useContext, useEffect, useState, useCallback } from 'react'

export interface User {
  id: string
  name: string
  email: string
  role: 'Relationship Manager' | 'Wealth Administrator' | 'Branch Head' | 'Guest'
  createdAt: string
}

export interface DecodedToken {
  sub: string
  name: string
  email: string
  role: string
  iat: number
  exp: number
}

interface AuthContextType {
  user: User | null
  token: string | null
  isAuthenticated: boolean
  isLoading: boolean
  tempUser: Omit<User, 'id' | 'role' | 'createdAt'> & { password?: string } | null
  login: (email: string, password: string) => Promise<User>
  registerUser: (name: string, email: string, password?: string) => Promise<void>
  verifyOTP: (code: string) => Promise<boolean>
  selectRole: (role: User['role']) => Promise<User>
  logout: () => void
  mockTokenPayload: DecodedToken | null
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

// Simple helpers to base64 encode/decode strings (safely handling Unicode)
const encodeBase64 = (str: string) => {
  return window.btoa(encodeURIComponent(str).replace(/%([0-9A-F]{2})/g, (_, p1) => {
    return String.fromCharCode(parseInt(p1, 16))
  }))
}

const decodeBase64 = (str: string) => {
  return decodeURIComponent(
    window.atob(str)
      .split('')
      .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
      .join(''),
  )
}

// Generate a simulated JWT token string (Header.Payload.Signature)
const generateMockJWT = (user: User): string => {
  const header = { alg: 'HS256', typ: 'JWT' }
  const iat = Math.floor(Date.now() / 1000)
  const exp = iat + 60 * 60 * 24 // 24 hours validity
  const payload: DecodedToken = {
    sub: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    iat,
    exp,
  }

  const encodedHeader = encodeBase64(JSON.stringify(header))
  const encodedPayload = encodeBase64(JSON.stringify(payload))
  const signature = encodeBase64(`${encodedHeader}.${encodedPayload}.suyogya_secret_key`)

  return `${encodedHeader}.${encodedPayload}.${signature}`
}

// Decode and parse payload from simulated JWT token
export const decodeMockJWT = (token: string): DecodedToken | null => {
  try {
    const parts = token.split('.')
    if (parts.length !== 3) return null
    const payloadJson = decodeBase64(parts[1])
    return JSON.parse(payloadJson) as DecodedToken
  } catch {
    return null
  }
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [token, setToken] = useState<string | null>(null)
  const [tempUser, setTempUser] = useState<AuthContextType['tempUser']>(null)
  const [isLoading, setIsLoading] = useState(true)

  // Initialize session from localStorage on mount
  useEffect(() => {
    const storedToken = localStorage.getItem('suyogya-session-token')
    const storedUser = localStorage.getItem('suyogya-session-user')

    if (storedToken && storedUser) {
      try {
        const decoded = decodeMockJWT(storedToken)
        if (decoded && decoded.exp > Date.now() / 1000) {
          setUser(JSON.parse(storedUser))
          setToken(storedToken)
        } else {
          // Clean up expired session
          localStorage.removeItem('suyogya-session-token')
          localStorage.removeItem('suyogya-session-user')
        }
      } catch {
        localStorage.removeItem('suyogya-session-token')
        localStorage.removeItem('suyogya-session-user')
      }
    }
    setIsLoading(false)
  }, [])

  // Helper: Retrieve all registered mock accounts in local storage
  const getMockAccounts = useCallback((): (User & { password?: string })[] => {
    const accounts = localStorage.getItem('suyogya-accounts-db')
    if (accounts) {
      try {
        return JSON.parse(accounts)
      } catch {
        return []
      }
    }
    // Default mock accounts
    const defaults: (User & { password?: string })[] = [
      {
        id: 'user-01',
        name: 'Sri Desiyan',
        email: 'desiy@sbi.co.in',
        role: 'Relationship Manager',
        createdAt: new Date().toISOString(),
        password: 'Password123',
      },
    ]
    localStorage.setItem('suyogya-accounts-db', JSON.stringify(defaults))
    return defaults
  }, [])

  // Login handler
  const login = useCallback(async (email: string, password: string): Promise<User> => {
    await new Promise((r) => setTimeout(r, 1200)) // simulated API delay

    const accounts = getMockAccounts()
    const match = accounts.find((a) => a.email.toLowerCase() === email.toLowerCase())

    if (!match || match.password !== password) {
      throw new Error('Invalid email or password combination.')
    }

    const cleanUser: User = {
      id: match.id,
      name: match.name,
      email: match.email,
      role: match.role,
      createdAt: match.createdAt,
    }

    const signedToken = generateMockJWT(cleanUser)

    setUser(cleanUser)
    setToken(signedToken)
    localStorage.setItem('suyogya-session-token', signedToken)
    localStorage.setItem('suyogya-session-user', JSON.stringify(cleanUser))

    return cleanUser;
  }, [getMockAccounts])

  // Register temp details
  const registerUser = useCallback(async (name: string, email: string, password?: string): Promise<void> => {
    await new Promise((r) => setTimeout(r, 800))
    const accounts = getMockAccounts()
    const exists = accounts.some((a) => a.email.toLowerCase() === email.toLowerCase())

    if (exists) {
      throw new Error('This email address is already registered.')
    }

    setTempUser({ name, email, password })
  }, [getMockAccounts])

  // OTP Validation Simulation
  const verifyOTP = useCallback(async (code: string): Promise<boolean> => {
    await new Promise((r) => setTimeout(r, 1000))
    // Standard mock pass code is '1234'
    if (code === '1234') {
      return true
    }
    throw new Error('Verification code is invalid or has expired.')
  }, [])

  // Complete Role selection and register new account
  const selectRole = useCallback(async (role: User['role']): Promise<User> => {
    await new Promise((r) => setTimeout(r, 1000))
    if (!tempUser) {
      throw new Error('Registration flow interrupted. Please register again.')
    }

    const newUser: User & { password?: string } = {
      id: `user-${Math.random().toString(36).substr(2, 9)}`,
      name: tempUser.name,
      email: tempUser.email,
      role: role,
      createdAt: new Date().toISOString(),
      password: tempUser.password || 'Password123',
    }

    // Write to Mock DB
    const accounts = getMockAccounts()
    accounts.push(newUser)
    localStorage.setItem('suyogya-accounts-db', JSON.stringify(accounts))

    const cleanUser: User = {
      id: newUser.id,
      name: newUser.name,
      email: newUser.email,
      role: newUser.role,
      createdAt: newUser.createdAt,
    }

    const signedToken = generateMockJWT(cleanUser)

    setUser(cleanUser)
    setToken(signedToken)
    setTempUser(null)
    localStorage.setItem('suyogya-session-token', signedToken)
    localStorage.setItem('suyogya-session-user', JSON.stringify(cleanUser))

    return cleanUser
  }, [tempUser, getMockAccounts])

  // Sign out handler
  const logout = useCallback(() => {
    setUser(null)
    setToken(null)
    localStorage.removeItem('suyogya-session-token')
    localStorage.removeItem('suyogya-session-user')
  }, [])

  // Decoded payload cached
  const mockTokenPayload = token ? decodeMockJWT(token) : null

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!user,
        isLoading,
        tempUser,
        login,
        registerUser,
        verifyOTP,
        selectRole,
        logout,
        mockTokenPayload,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
