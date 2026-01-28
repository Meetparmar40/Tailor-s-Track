import { SignIn, SignUp } from '@clerk/clerk-react'
import { Link } from 'react-router-dom'
import { Scissors } from 'lucide-react'

function Login({ isSignUp = false }) {
  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gradient-to-b from-background to-muted/30 px-4 py-8">
      {/* Logo */}
      <Link to="/" className="flex items-center gap-2 mb-8">
        <div className="p-2 bg-primary rounded-xl">
          <Scissors className="w-5 h-5 text-primary-foreground" />
        </div>
        <span className="text-xl font-bold text-foreground">Tailor Track</span>
      </Link>

      {/* Clerk Auth Component */}
      {isSignUp ? (
        <SignUp 
          routing="path" 
          path="/signup" 
          signInUrl="/login"
          appearance={{
            elements: {
              rootBox: "mx-auto",
              card: "shadow-xl border border-border/50",
            }
          }}
        />
      ) : (
        <SignIn 
          routing="path" 
          path="/login" 
          signUpUrl="/signup"
          appearance={{
            elements: {
              rootBox: "mx-auto",
              card: "shadow-xl border border-border/50",
            }
          }}
        />
      )}
    </div>
  )
}

export default Login