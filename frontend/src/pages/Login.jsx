import React from 'react'

function Login() {
  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-base-100 px-4">
      <div className="w-full max-w-sm bg-white rounded-2xl shadow-xl p-8 flex flex-col items-center">
        <h1 className="text-3xl font-bold text-black mb-2">Welcome Back</h1>
        <p className="text-gray-500 mb-6 text-center">Sign in to continue to Tailor Track</p>
        <form className="w-full flex flex-col gap-4 mb-4">
          <input
            type="email"
            placeholder="Email"
            className="input input-bordered w-full rounded-lg bg-base-200 focus:outline-none focus:ring-2 focus:ring-primary text-base"
          />
          <input
            type="password"
            placeholder="Password"
            className="input input-bordered w-full rounded-lg bg-base-200 focus:outline-none focus:ring-2 focus:ring-primary text-base"
          />
          <button
            type="submit"
            className="btn btn-primary w-full rounded-lg font-bold text-base tracking-wide mt-2 shadow-md"
          >
            Sign In
          </button>
        </form>
        <div className="flex items-center w-full mb-4">
          <div className="flex-1 h-px bg-gray-200" />
          <span className="mx-2 text-gray-400 text-sm">or</span>
          <div className="flex-1 h-px bg-gray-200" />
        </div>
        <button
          className="btn w-full rounded-lg border border-gray-300 bg-white text-gray-700 font-semibold flex items-center justify-center gap-2 shadow-sm hover:bg-gray-50"
        >
          <svg className="h-5 w-5" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
            <g clipPath="url(#clip0_17_40)">
              <path d="M47.532 24.552c0-1.636-.146-3.2-.418-4.704H24.48v9.02h13.02c-.528 2.84-2.12 5.24-4.52 6.86v5.68h7.32c4.28-3.94 6.73-9.74 6.73-16.856z" fill="#4285F4"/>
              <path d="M24.48 48c6.12 0 11.26-2.04 15.01-5.54l-7.32-5.68c-2.04 1.36-4.66 2.18-7.69 2.18-5.92 0-10.94-4-12.74-9.36H4.24v5.86C7.98 43.98 15.62 48 24.48 48z" fill="#34A853"/>
              <path d="M11.74 29.6c-.48-1.36-.76-2.8-.76-4.28s.28-2.92.76-4.28v-5.86H4.24A23.98 23.98 0 0 0 0 24.48c0 3.98.96 7.74 2.64 11.02l7.32-5.86z" fill="#FBBC05"/>
              <path d="M24.48 9.52c3.34 0 6.32 1.14 8.68 3.38l6.48-6.48C35.74 2.18 30.6 0 24.48 0 15.62 0 7.98 4.02 4.24 10.14l7.32 5.86c1.8-5.36 6.82-9.36 12.92-9.36z" fill="#EA4335"/>
            </g>
            <defs>
              <clipPath id="clip0_17_40">
                <path fill="#fff" d="M0 0h48v48H0z"/>
              </clipPath>
            </defs>
          </svg>
          Continue with Google
        </button>
        <p className="text-gray-400 text-xs mt-6">Don't have an account? <a href="#" className="text-primary font-semibold">Sign up</a></p>
      </div>
    </div>
  )
}

export default Login