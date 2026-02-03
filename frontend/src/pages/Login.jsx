import { SignIn, SignUp } from '@clerk/clerk-react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import logo from '@/assets/images/logo.png'
import { FloatingOrbs } from '@/components/ui/animated-components'

function Login({ isSignUp = false }) {
  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-white px-4 py-8 relative overflow-hidden">
      {/* Background Effects */}
      <FloatingOrbs />
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#e5e7eb_1px,transparent_1px),linear-gradient(to_bottom,#e5e7eb_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_80%_80%_at_50%_50%,#000_40%,transparent_100%)] opacity-40" />
      
      {/* Logo */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Link to="/" className="flex items-center gap-3 mb-8 relative z-10">
          <motion.img
            src={logo}
            alt="Mentro Logo"
            className="h-12 w-auto"
            whileHover={{ scale: 1.05, rotate: -5 }}
            transition={{ type: "spring", stiffness: 300 }}
          />
          <span className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent">
            Mentro
          </span>
        </Link>
      </motion.div>

      {/* Clerk Auth Component */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="relative z-10"
      >
        {isSignUp ? (
          <SignUp 
            routing="path" 
            path="/signup" 
            signInUrl="/login"
            appearance={{
              elements: {
                rootBox: "mx-auto",
                card: "shadow-2xl border border-gray-100 rounded-2xl",
                headerTitle: "text-gray-900",
                headerSubtitle: "text-gray-500",
                socialButtonsBlockButton: "border-gray-200 hover:bg-gray-50",
                formFieldInput: "border-gray-200 focus:border-indigo-500 focus:ring-indigo-500",
                formButtonPrimary: "bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700",
                footerActionLink: "text-indigo-600 hover:text-indigo-700",
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
                card: "shadow-2xl border border-gray-100 rounded-2xl",
                headerTitle: "text-gray-900",
                headerSubtitle: "text-gray-500",
                socialButtonsBlockButton: "border-gray-200 hover:bg-gray-50",
                formFieldInput: "border-gray-200 focus:border-indigo-500 focus:ring-indigo-500",
                formButtonPrimary: "bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700",
                footerActionLink: "text-indigo-600 hover:text-indigo-700",
              }
            }}
          />
        )}
      </motion.div>

      {/* Decorative Elements */}
      <motion.div
        className="absolute top-1/4 -left-20 w-72 h-72 bg-gradient-to-br from-indigo-200/30 to-violet-200/30 rounded-full blur-3xl"
        animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
        transition={{ duration: 8, repeat: Infinity }}
      />
      <motion.div
        className="absolute bottom-1/4 -right-20 w-96 h-96 bg-gradient-to-br from-violet-200/30 to-pink-200/30 rounded-full blur-3xl"
        animate={{ scale: [1.2, 1, 1.2], opacity: [0.3, 0.5, 0.3] }}
        transition={{ duration: 10, repeat: Infinity }}
      />
    </div>
  )
}

export default Login