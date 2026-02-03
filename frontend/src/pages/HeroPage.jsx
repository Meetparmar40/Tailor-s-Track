import { Link } from 'react-router-dom'
import { motion, useScroll, useTransform, useInView } from 'framer-motion'
import {
    Users,
    ClipboardList,
    Ruler,
    ArrowRight,
    Zap,
    Shield,
    Clock,
    Star,
    ChevronRight,
    Play,
    Sparkles,
    Globe,
    MessageSquare,
    UserPlus,
    Share2,
    Bell
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
    GridBackground,
    FloatingOrbs,
    GradientText,
    BentoCard,
    MagneticButton,
    TypewriterEffect,
    Marquee,
    AnimatedBorderCard,
    TiltCard,
    AnimatedCounter
} from '@/components/ui/animated-components'
import logo from '@/assets/images/logo.png'
import dashboardScreenshot from '@/assets/images/Screenshot_Dashboard.png'
import * as React from 'react'
import { OrbitingCircles } from "@/registry/magicui/orbiting-circles"

// Profile pictures for realistic avatars
const profilePics = [
    'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=face',
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face',
    'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face',
    'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face',
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&crop=face',
    'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=face',
    'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100&h=100&fit=crop&crop=face',
    'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=100&h=100&fit=crop&crop=face',
]

const features = [
    {
        icon: ClipboardList,
        title: 'Smart Order Management',
        description: 'Track orders with intuitive Kanban boards. Drag, drop, and never miss a deadline again.',
        color: 'from-teal-500 to-cyan-500',
        direction: 'left'
    },
    {
        icon: Users,
        title: 'Customer Intelligence',
        description: 'Store customer details, preferences, and history in one beautifully organized place.',
        color: 'from-cyan-500 to-sky-500',
        direction: 'right'
    },
    {
        icon: Ruler,
        title: 'Digital Measurements',
        description: 'Save and access measurements digitally anytime, anywhere. No more lost papers.',
        color: 'from-sky-500 to-blue-500',
        direction: 'left'
    },
    {
        icon: Zap,
        title: 'Lightning Fast',
        description: 'Built for speed. Find any order or customer in milliseconds.',
        color: 'from-amber-500 to-orange-500',
        direction: 'right'
    },
    {
        icon: Shield,
        title: 'Secure & Private',
        description: 'Your data is encrypted and stored securely. We take privacy seriously.',
        color: 'from-emerald-500 to-teal-500',
        direction: 'left'
    },
    {
        icon: Clock,
        title: '24/7 Access',
        description: 'Access your dashboard from anywhere, on any device, at any time.',
        color: 'from-rose-500 to-pink-500',
        direction: 'right'
    }
]

const collaborativeFeatures = [
    {
        icon: Globe,
        title: 'Real-time Sync',
        description: 'All changes sync instantly across devices and team members.',
        gradient: 'from-teal-400 to-cyan-400'
    },
    {
        icon: UserPlus,
        title: 'Team Workspaces',
        description: 'Invite team members and assign roles with granular permissions.',
        gradient: 'from-cyan-400 to-sky-400'
    },
    {
        icon: Share2,
        title: 'Seamless Handoffs',
        description: 'Transfer orders between team members without losing context.',
        gradient: 'from-sky-400 to-blue-400'
    },
    {
        icon: Bell,
        title: 'Smart Notifications',
        description: 'Get notified about order updates, deadlines, and team activity.',
        gradient: 'from-emerald-400 to-teal-400'
    }
]

const testimonials = [
    { name: "Sarah M.", role: "Fashion Designer", text: "Mentro transformed how I manage my orders. It's incredible!", image: profilePics[0] },
    { name: "James K.", role: "Tailor Shop Owner", text: "Best investment for my business. Saved hours every week.", image: profilePics[5] },
    { name: "Lisa P.", role: "Boutique Owner", text: "Finally, a tool that understands what tailors actually need.", image: profilePics[2] },
    { name: "Michael R.", role: "Custom Clothier", text: "The Kanban board is a game changer. Love it!", image: profilePics[6] },
    { name: "Emma T.", role: "Alterations Specialist", text: "So easy to use. My team picked it up in minutes.", image: profilePics[3] },
]

const stats = [
    { value: 10000, label: "Orders Tracked", suffix: "+" },
    { value: 500, label: "Happy Tailors", suffix: "+" },
    { value: 99, label: "Uptime", suffix: "%" },
    { value: 24, label: "Support", suffix: "/7" },
]

// Parallax card component with scroll-based transforms
function ParallaxCard({ children, direction = 'left', index }) {
    const ref = React.useRef(null)
    const isInView = useInView(ref, { once: false, margin: "-100px" })
    
    const variants = {
        hidden: { 
            opacity: 0, 
            x: direction === 'left' ? -100 : 100,
            rotateY: direction === 'left' ? -15 : 15,
            scale: 0.8
        },
        visible: { 
            opacity: 1, 
            x: 0,
            rotateY: 0,
            scale: 1,
            transition: {
                type: "spring",
                stiffness: 100,
                damping: 20,
                delay: index * 0.1
            }
        }
    }

    return (
        <motion.div
            ref={ref}
            variants={variants}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
            style={{ perspective: 1000 }}
        >
            {children}
        </motion.div>
    )
}

// Floating particles background
function ParticleField() {
    const particles = React.useMemo(() => 
        [...Array(30)].map((_, i) => ({
            id: i,
            x: Math.random() * 100,
            y: Math.random() * 100,
            size: Math.random() * 4 + 2,
            duration: Math.random() * 20 + 10,
            delay: Math.random() * 5
        })), []
    )

    return (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {particles.map((particle) => (
                <motion.div
                    key={particle.id}
                    className="absolute rounded-full bg-gradient-to-r from-teal-500/40 to-cyan-500/40"
                    style={{
                        width: particle.size,
                        height: particle.size,
                        left: `${particle.x}%`,
                        top: `${particle.y}%`,
                    }}
                    animate={{
                        y: [0, -100, 0],
                        opacity: [0, 1, 0],
                        scale: [0, 1, 0]
                    }}
                    transition={{
                        duration: particle.duration,
                        delay: particle.delay,
                        repeat: Infinity,
                        ease: "easeInOut"
                    }}
                />
            ))}
        </div>
    )
}

// Glowing line animation
function GlowingLine() {
    return (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <motion.div
                className="absolute h-[2px] w-96 bg-gradient-to-r from-transparent via-teal-400 to-transparent opacity-60"
                style={{ top: '30%', left: '-20%' }}
                animate={{ x: ['0%', '150%'] }}
                transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
            />
            <motion.div
                className="absolute h-[2px] w-64 bg-gradient-to-r from-transparent via-cyan-400 to-transparent opacity-60"
                style={{ top: '60%', right: '-10%' }}
                animate={{ x: ['0%', '-150%'] }}
                transition={{ duration: 6, repeat: Infinity, ease: "linear", delay: 2 }}
            />
        </div>
    )
}

// Glowing line animation that goes smoothly around the hero section border
function GlowingBorderLine() {
    return (
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
            {/* Single continuous glow orb that travels around the border */}
            <motion.div
                className="absolute w-24 h-24 rounded-full"
                style={{
                    background: 'radial-gradient(circle, rgba(20,184,166,0.8) 0%, rgba(6,182,212,0.4) 40%, transparent 70%)',
                    filter: 'blur(8px)',
                }}
                animate={{
                    offsetDistance: ['0%', '100%'],
                }}
                transition={{
                    duration: 8,
                    repeat: Infinity,
                    ease: 'linear',
                }}
                initial={{ offsetPath: 'path("M 0,0 L 100%,0 L 100%,100% L 0,100% Z")' }}
            />
            
            {/* SVG path-based animation for smooth continuous movement */}
            <svg className="absolute inset-0 w-full h-full" style={{ overflow: 'visible' }}>
                <defs>
                    <linearGradient id="glowGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="transparent" />
                        <stop offset="40%" stopColor="#14b8a6" />
                        <stop offset="60%" stopColor="#06b6d4" />
                        <stop offset="100%" stopColor="transparent" />
                    </linearGradient>
                    <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
                        <feGaussianBlur stdDeviation="4" result="coloredBlur"/>
                        <feMerge>
                            <feMergeNode in="coloredBlur"/>
                            <feMergeNode in="SourceGraphic"/>
                        </feMerge>
                    </filter>
                </defs>
                
                {/* Animated glow line traveling along the border */}
                <motion.rect
                    width="120"
                    height="4"
                    rx="2"
                    fill="url(#glowGradient)"
                    filter="url(#glow)"
                    initial={{ opacity: 0.8 }}
                    animate={{
                        x: ['0%', '100%', '100%', '0%', '0%'],
                        y: ['0%', '0%', '100%', '100%', '0%'],
                        rotate: [0, 0, 90, 90, 180, 180, 270, 270, 360],
                    }}
                    transition={{
                        duration: 12,
                        repeat: Infinity,
                        ease: 'linear',
                        times: [0, 0.25, 0.5, 0.75, 1],
                    }}
                />
            </svg>
            
            {/* Trailing glow effect */}
            <motion.div
                className="absolute w-40 h-1 bg-gradient-to-r from-transparent via-teal-400/60 to-transparent blur-sm"
                animate={{
                    left: ['0%', '100%'],
                    top: '0%',
                }}
                transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: 'linear',
                }}
            />
            <motion.div
                className="absolute w-1 h-40 bg-gradient-to-b from-transparent via-cyan-400/60 to-transparent blur-sm"
                style={{ right: 0 }}
                animate={{
                    top: ['0%', '100%'],
                }}
                transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: 'linear',
                    delay: 3,
                }}
            />
            <motion.div
                className="absolute w-40 h-1 bg-gradient-to-r from-transparent via-teal-400/60 to-transparent blur-sm"
                style={{ bottom: 0 }}
                animate={{
                    right: ['0%', '100%'],
                }}
                transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: 'linear',
                    delay: 6,
                }}
            />
            <motion.div
                className="absolute w-1 h-40 bg-gradient-to-b from-transparent via-cyan-400/60 to-transparent blur-sm"
                style={{ left: 0 }}
                animate={{
                    bottom: ['0%', '100%'],
                }}
                transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: 'linear',
                    delay: 9,
                }}
            />
        </div>
    )
}

// Mesh gradient background
function MeshGradient() {
    return (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute top-0 -left-1/4 w-1/2 h-1/2 bg-gradient-to-br from-teal-200/50 to-transparent rounded-full blur-3xl" />
            <div className="absolute top-1/4 -right-1/4 w-1/2 h-1/2 bg-gradient-to-bl from-cyan-200/50 to-transparent rounded-full blur-3xl" />
            <div className="absolute -bottom-1/4 left-1/3 w-1/2 h-1/2 bg-gradient-to-tr from-sky-200/40 to-transparent rounded-full blur-3xl" />
        </div>
    )
}

export default function HeroPage() {
    const { scrollYProgress } = useScroll()
    const heroOpacity = useTransform(scrollYProgress, [0, 0.2], [1, 0])
    const heroScale = useTransform(scrollYProgress, [0, 0.2], [1, 0.95])
    const dashboardY = useTransform(scrollYProgress, [0.1, 0.4], [100, 0])
    const dashboardOpacity = useTransform(scrollYProgress, [0.1, 0.3], [0, 1])
    const dashboardRotate = useTransform(scrollYProgress, [0.1, 0.4], [10, 0])

    return (
        <div className="min-h-screen bg-gradient-to-b from-white via-gray-50/50 to-white overflow-x-hidden">
            {/* Navigation */}
            <motion.nav
                initial={{ y: -100 }}
                animate={{ y: 0 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-xl border-b border-gray-200/50 shadow-sm"
            >
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">
                        {/* Logo */}
                        <Link to="/" className="flex items-center gap-3">
                            <motion.img
                                src={logo}
                                alt="Mentro Logo"
                                className="h-10 w-auto"
                                whileHover={{ scale: 1.05, rotate: -5 }}
                                transition={{ type: "spring", stiffness: 300 }}
                            />
                            <span className="text-xl font-bold bg-gradient-to-r from-teal-600 to-cyan-600 bg-clip-text text-transparent">
                                Mentro
                            </span>
                        </Link>

                        {/* Auth Buttons */}
                        <div className="flex items-center gap-3">
                            <Button variant="ghost" className="text-gray-600 hover:text-teal-600" asChild>
                                <Link to="/login">Sign In</Link>
                            </Button>
                            <MagneticButton>
                                <Button 
                                    className="bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-600 hover:to-cyan-600 text-white shadow-md shadow-teal-500/25"
                                    asChild
                                >
                                    <Link to="/signup">
                                        Get Started Free
                                        <ArrowRight className="w-4 h-4 ml-2" />
                                    </Link>
                                </Button>
                            </MagneticButton>
                        </div>
                    </div>
                </div>
            </motion.nav>

            {/* Hero Section */}
            <section className="relative pt-32 pb-20 px-4 sm:px-6 lg:px-8 min-h-screen flex items-center">
                <MeshGradient />
                <ParticleField />
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#f0fdfa_1px,transparent_1px),linear-gradient(to_bottom,#f0fdfa_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_110%)] opacity-70" />
                
                {/* Outer container with border for glow line */}
                <div className="absolute inset-8 border border-teal-200/30 rounded-3xl overflow-hidden">
                    <GlowingBorderLine />
                </div>
                
                <motion.div 
                    className="max-w-7xl mx-auto relative z-10 w-full"
                    style={{ opacity: heroOpacity, scale: heroScale }}
                >
                    <div className="text-center max-w-5xl mx-auto">
                        {/* Announcement Badge */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6 }}
                        >
                            <Link to="/signup" className="group inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-teal-50 to-cyan-50 rounded-full text-sm font-medium mb-8 border border-teal-200 hover:border-teal-300 hover:shadow-md transition-all">
                                <motion.span 
                                    className="flex items-center gap-1.5 text-teal-600"
                                    animate={{ scale: [1, 1.05, 1] }}
                                    transition={{ duration: 2, repeat: Infinity }}
                                >
                                    <Sparkles className="w-4 h-4" />
                                    New: Collaborative Workspaces
                                </motion.span>
                                <ChevronRight className="w-4 h-4 text-teal-500 group-hover:translate-x-1 transition-transform" />
                            </Link>
                        </motion.div>

                        {/* Main Headline */}
                        <motion.h1
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.2 }}
                            className="text-5xl sm:text-6xl lg:text-7xl font-bold text-gray-900 tracking-tight mb-6 leading-[1.1]"
                        >
                            Manage Your Business
                            <br />
                            <span className="relative inline-block">
                                <span className="bg-gradient-to-r from-teal-500 via-cyan-500 to-sky-500 bg-clip-text text-transparent">
                                    <TypewriterEffect 
                                        words={['Effortlessly', 'Beautifully', 'Together', 'Smartly']}
                                    />
                                </span>
                                <motion.span
                                    className="absolute -bottom-2 left-0 right-0 h-1 bg-gradient-to-r from-teal-500 to-cyan-500 rounded-full"
                                    initial={{ scaleX: 0 }}
                                    animate={{ scaleX: 1 }}
                                    transition={{ duration: 1, delay: 1 }}
                                />
                            </span>
                        </motion.h1>

                        {/* Subheadline */}
                        <motion.p
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.4 }}
                            className="text-xl sm:text-2xl text-slate-600 max-w-3xl mx-auto mb-12 leading-relaxed"
                        >
                            The all-in-one platform for tailors and fashion designers.
                            <span className="text-slate-400 font-medium"> Track orders, store measurements, and collaborate seamlessly.</span>
                        </motion.p>

                        {/* CTA Buttons */}
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.6 }}
                            className="flex flex-col sm:flex-row items-center justify-center gap-4"
                        >
                            <MagneticButton>
                                <Button 
                                    size="lg" 
                                    className="w-full sm:w-auto text-lg px-8 py-6 bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-600 hover:to-cyan-600 shadow-2xl shadow-teal-500/30 rounded-xl group"
                                    asChild
                                >
                                    <Link to="/signup">
                                        Start Free — No Credit Card
                                        <motion.span
                                            className="ml-2 inline-block"
                                            animate={{ x: [0, 5, 0] }}
                                            transition={{ duration: 1.5, repeat: Infinity }}
                                        >
                                            <ArrowRight className="w-5 h-5" />
                                        </motion.span>
                                    </Link>
                                </Button>
                            </MagneticButton>
                            <Button 
                                size="lg" 
                                variant="outline" 
                                className="w-full sm:w-auto text-lg px-8 py-6 border-2 border-gray-200 hover:border-teal-300 hover:bg-teal-50 rounded-xl group text-gray-700"
                                asChild
                            >
                                <Link to="/login" className="flex items-center gap-2">
                                    <motion.div 
                                        className="w-10 h-10 rounded-full bg-gradient-to-r from-teal-100 to-cyan-100 flex items-center justify-center group-hover:scale-110 transition-transform border border-teal-200"
                                        whileHover={{ rotate: 360 }}
                                        transition={{ duration: 0.5 }}
                                    >
                                        <Play className="w-4 h-4 text-teal-600 ml-0.5" />
                                    </motion.div>
                                    Watch Demo
                                </Link>
                            </Button>
                        </motion.div>

                        {/* Social Proof */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 1, delay: 1 }}
                            className="mt-16 flex flex-col items-center gap-4"
                        >
                            <div className="flex -space-x-3">
                                {profilePics.slice(0, 5).map((pic, i) => (
                                    <motion.img
                                        key={i}
                                        src={pic}
                                        alt={`User ${i + 1}`}
                                        initial={{ opacity: 0, scale: 0 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        transition={{ delay: 1 + i * 0.1, type: "spring" }}
                                        className="w-10 h-10 rounded-full border-2 border-white object-cover shadow-lg"
                                    />
                                ))}
                            </div>
                            <div className="flex items-center gap-2 text-sm text-gray-500">
                                <div className="flex text-amber-400">
                                    {[...Array(5)].map((_, i) => (
                                        <Star key={i} className="w-4 h-4 fill-current" />
                                    ))}
                                </div>
                                <span className="font-medium text-gray-700">4.9/5</span>
                                <span>from 500+ reviews</span>
                            </div>
                        </motion.div>
                    </div>
                </motion.div>
            </section>

            {/* Dashboard Demo Section */}
            <section className="py-24 px-4 sm:px-6 lg:px-8 relative overflow-hidden bg-gradient-to-b from-gray-50 to-white">
                <div className="absolute inset-0 bg-gradient-to-b from-white via-teal-50/30 to-white" />
                <div className="absolute inset-0">
                    <div className="absolute inset-0 bg-[linear-gradient(to_right,#e5e7eb_1px,transparent_1px),linear-gradient(to_bottom,#e5e7eb_1px,transparent_1px)] bg-[size:4rem_4rem] opacity-30" />
                </div>
                
                <div className="max-w-7xl mx-auto relative z-10">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        viewport={{ once: true }}
                        className="text-center mb-16"
                    >
                        <motion.span 
                            className="inline-flex items-center gap-2 px-4 py-1.5 bg-teal-100 text-teal-700 rounded-full text-sm font-medium mb-4 border border-teal-200"
                            whileHover={{ scale: 1.05 }}
                        >
                            <ClipboardList className="w-4 h-4" />
                            Order Management
                        </motion.span>
                        <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
                            Powerful <span className="bg-gradient-to-r from-teal-500 to-cyan-500 bg-clip-text text-transparent">Kanban Dashboard</span>
                        </h2>
                        <p className="text-xl text-gray-500 max-w-2xl mx-auto">
                            Visualize your entire workflow. Drag orders between stages, set priorities, and never miss a deadline.
                        </p>
                    </motion.div>

                    {/* Screenshot with 3D effect */}
                    <motion.div
                        initial={{ opacity: 0, y: 100, rotateX: 25 }}
                        whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
                        transition={{ duration: 1, type: "spring", stiffness: 50 }}
                        viewport={{ once: true }}
                        className="relative mx-auto max-w-6xl"
                        style={{ perspective: 1000 }}
                    >
                        {/* Glow effect behind the image */}
                        <div className="absolute -inset-4 bg-gradient-to-r from-teal-200/40 via-cyan-200/40 to-sky-200/40 rounded-3xl blur-2xl" />
                        
                        {/* Browser frame */}
                        <motion.div 
                            className="relative bg-white rounded-2xl border border-gray-200 shadow-2xl overflow-hidden"
                            whileHover={{ y: -10, scale: 1.02 }}
                            transition={{ duration: 0.3 }}
                        >
                            {/* Browser header */}
                            <div className="flex items-center gap-2 px-4 py-3 bg-gray-50 border-b border-gray-200">
                                <div className="flex gap-2">
                                    <div className="w-3 h-3 rounded-full bg-red-400" />
                                    <div className="w-3 h-3 rounded-full bg-yellow-400" />
                                    <div className="w-3 h-3 rounded-full bg-green-400" />
                                </div>
                                <div className="flex-1 mx-4">
                                    <div className="bg-white rounded-lg px-4 py-1.5 text-sm text-gray-500 flex items-center gap-2 border border-gray-200">
                                        <Shield className="w-3 h-3 text-teal-500" />
                                        mentro.app/dashboard
                                    </div>
                                </div>
                            </div>
                            
                            {/* Screenshot */}
                            <motion.img
                                src={dashboardScreenshot}
                                alt="Mentro Dashboard - Order Management"
                                className="w-full"
                                initial={{ scale: 1.1 }}
                                whileInView={{ scale: 1 }}
                                transition={{ duration: 1.5 }}
                                viewport={{ once: true }}
                            />
                            
                        </motion.div>
                    </motion.div>
                </div>
            </section>

            {/* Stats Section */}
            <section className="py-16 bg-gradient-to-r from-teal-600 to-cyan-600 relative overflow-hidden">
                <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAxOGMtOS45NDEgMC0xOCA4LjA1OS0xOCAxOHM4LjA1OSAxOCAxOCAxOCAxOC04LjA1OSAxOC0xOC04LjA1OS0xOC0xOC0xOHptMCAzMmMtNy43MzIgMC0xNC02LjI2OC0xNC0xNHM2LjI2OC0xNCAxNC0xNCAxNCA2LjI2OCAxNCAxNC02LjI2OCAxNC0xNCAxNHoiIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iLjA1Ii8+PC9nPjwvc3ZnPg==')] opacity-30" />
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                        {stats.map((stat, index) => (
                            <motion.div
                                key={stat.label}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                                viewport={{ once: true }}
                                className="text-center"
                            >
                                <div className="text-4xl sm:text-5xl font-bold text-white mb-2">
                                    <AnimatedCounter value={stat.value} />{stat.suffix}
                                </div>
                                <div className="text-teal-100">{stat.label}</div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Features Bento Grid */}
            <section className="py-24 px-4 sm:px-6 lg:px-8 bg-white relative">
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-teal-50/50 via-white to-white" />
                
                <div className="max-w-7xl mx-auto relative z-10">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        viewport={{ once: true }}
                        className="text-center mb-16"
                    >
                        <span className="inline-block px-4 py-1.5 bg-teal-100 text-teal-700 rounded-full text-sm font-medium mb-4 border border-teal-200">
                            Features
                        </span>
                        <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
                            Everything You Need to <span className="bg-gradient-to-r from-teal-500 to-cyan-500 bg-clip-text text-transparent">Succeed</span>
                        </h2>
                        <p className="text-xl text-gray-500 max-w-2xl mx-auto">
                            Powerful features designed specifically for modern tailoring businesses
                        </p>
                    </motion.div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {features.map((feature, index) => (
                            <ParallaxCard key={feature.title} direction={feature.direction} index={index}>
                                <TiltCard>
                                    <div className="group relative overflow-hidden rounded-3xl border border-gray-200 bg-white/80 backdrop-blur-sm p-6 shadow-lg transition-all duration-300 hover:shadow-2xl hover:border-teal-300 h-full">
                                        <motion.div
                                            className="absolute inset-0 bg-gradient-to-br from-teal-50 to-cyan-50 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                                        />
                                        <motion.div 
                                            className={`relative w-14 h-14 rounded-2xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-6 shadow-lg`}
                                            whileHover={{ rotate: [0, -10, 10, 0], scale: 1.1 }}
                                            transition={{ duration: 0.5 }}
                                        >
                                            <feature.icon className="w-7 h-7 text-white" />
                                        </motion.div>
                                        <h3 className="relative text-xl font-semibold text-gray-900 mb-3">
                                            {feature.title}
                                        </h3>
                                        <p className="relative text-gray-500 leading-relaxed">
                                            {feature.description}
                                        </p>
                                    </div>
                                </TiltCard>
                            </ParallaxCard>
                        ))}
                    </div>
                </div>
            </section>

            {/* Collaborative Workspace Section */}
            <section className="py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-gray-50 to-white relative overflow-hidden">
                <div className="absolute inset-0">
                    <div className="absolute top-0 left-1/4 w-96 h-96 bg-teal-100/50 rounded-full blur-3xl" />
                    <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-cyan-100/50 rounded-full blur-3xl" />
                </div>
                
                <div className="max-w-7xl mx-auto relative z-10">
                    <div className="grid lg:grid-cols-2 gap-16 items-center">
                        {/* Left side - Content */}
                        <motion.div
                            initial={{ opacity: 0, x: -50 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.8 }}
                            viewport={{ once: true }}
                        >
                            <motion.span 
                                className="inline-flex items-center gap-2 px-4 py-1.5 bg-cyan-100 text-cyan-700 rounded-full text-sm font-medium mb-6 border border-cyan-200"
                                whileHover={{ scale: 1.05 }}
                            >
                                <Users className="w-4 h-4" />
                                Team Collaboration
                            </motion.span>
                            
                            <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-6 leading-tight">
                                Work Together,{' '}
                                <span className="bg-gradient-to-r from-teal-500 via-cyan-500 to-sky-500 bg-clip-text text-transparent">
                                    Achieve More
                                </span>
                            </h2>
                            
                            <p className="text-xl text-gray-500 mb-8 leading-relaxed">
                                Mentro brings your entire team together in one collaborative workspace. 
                                Share orders, assign tasks, and keep everyone in sync — whether you're 
                                in the same shop or across the city.
                            </p>

                            <div className="grid sm:grid-cols-2 gap-4">
                                {collaborativeFeatures.map((item, index) => (
                                    <motion.div
                                        key={item.title}
                                        initial={{ opacity: 0, y: 20 }}
                                        whileInView={{ opacity: 1, y: 0 }}
                                        transition={{ delay: index * 0.1 }}
                                        viewport={{ once: true }}
                                        className="group p-4 rounded-2xl bg-white border border-gray-200 hover:border-teal-300 hover:shadow-lg transition-all duration-300"
                                        whileHover={{ y: -5 }}
                                    >
                                        <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${item.gradient} flex items-center justify-center mb-3 group-hover:scale-110 transition-transform`}>
                                            <item.icon className="w-5 h-5 text-white" />
                                        </div>
                                        <h4 className="font-semibold text-gray-900 mb-1">{item.title}</h4>
                                        <p className="text-sm text-gray-500">{item.description}</p>
                                    </motion.div>
                                ))}
                            </div>
                        </motion.div>

                        {/* Right side - Team Visualization with OrbitingCircles */}
                        <motion.div
                            initial={{ opacity: 0, x: 50 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.8 }}
                            viewport={{ once: true }}
                            className="relative flex items-center justify-center"
                        >
                            <div className="relative h-[400px] w-[400px]">
                                {/* Central hub - Share button */}
                                <div className="absolute inset-0 flex items-center justify-center z-10">
                                    <motion.div
                                        className="w-20 h-20 rounded-full bg-gradient-to-br from-teal-500 to-cyan-500 flex items-center justify-center shadow-2xl shadow-teal-500/30"
                                        animate={{ scale: [1, 1.05, 1] }}
                                        transition={{ duration: 2, repeat: Infinity }}
                                    >
                                        <Share2 className="w-8 h-8 text-white" />
                                    </motion.div>
                                </div>

                                {/* Inner orbit - 3 members */}
                                <OrbitingCircles radius={90} duration={25} iconSize={48}>
                                    {[0, 1, 2].map((i) => (
                                        <div key={`inner-${i}`} className="rounded-full overflow-hidden border-2 border-white shadow-lg ring-2 ring-teal-400/50">
                                            <img 
                                                src={profilePics[i]} 
                                                alt={`Team member ${i + 1}`}
                                                className="w-full h-full object-cover"
                                            />
                                        </div>
                                    ))}
                                </OrbitingCircles>

                                {/* Outer orbit - 5 members (reverse direction) */}
                                <OrbitingCircles radius={150} duration={35} reverse iconSize={40}>
                                    {[0, 1, 2, 3, 4].map((i) => (
                                        <div key={`outer-${i}`} className="rounded-full overflow-hidden border-2 border-white shadow-md ring-2 ring-cyan-400/40">
                                            <img 
                                                src={profilePics[i + 3]} 
                                                alt={`Team member ${i + 4}`}
                                                className="w-full h-full object-cover"
                                            />
                                        </div>
                                    ))}
                                </OrbitingCircles>

                                {/* Floating notifications */}
                                <motion.div
                                    className="absolute top-5 right-5 px-3 py-2 bg-white/95 backdrop-blur-sm border border-teal-200 rounded-lg shadow-lg z-20"
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.5 }}
                                    animate={{ y: [0, -10, 0] }}
                                >
                                    <div className="flex items-center gap-2 text-xs">
                                        <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                                        <span className="text-gray-600">Order #1234 updated</span>
                                    </div>
                                </motion.div>

                                <motion.div
                                    className="absolute bottom-5 left-5 px-3 py-2 bg-white/95 backdrop-blur-sm border border-cyan-200 rounded-lg shadow-lg z-20"
                                    initial={{ opacity: 0, y: -20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.7 }}
                                    animate={{ y: [0, 10, 0] }}
                                >
                                    <div className="flex items-center gap-2 text-xs">
                                        <MessageSquare className="w-3 h-3 text-cyan-500" />
                                        <span className="text-gray-600">New comment added</span>
                                    </div>
                                </motion.div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Testimonials Marquee */}
            <section className="py-24 bg-white overflow-hidden">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-center"
                    >
                        <span className="inline-block px-4 py-1.5 bg-cyan-100 text-cyan-700 rounded-full text-sm font-medium mb-4 border border-cyan-200">
                            Testimonials
                        </span>
                        <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
                            Loved by <span className="bg-gradient-to-r from-teal-500 to-cyan-500 bg-clip-text text-transparent">Tailors Everywhere</span>
                        </h2>
                    </motion.div>
                </div>

                <Marquee className="mb-4">
                    {testimonials.map((testimonial, index) => (
                        <motion.div
                            key={index}
                            className="w-[350px] p-6 bg-white rounded-2xl border border-gray-200 shadow-lg hover:border-teal-300 hover:shadow-xl transition-all duration-300"
                            whileHover={{ y: -5, scale: 1.02 }}
                        >
                            <div className="flex text-amber-400 mb-4">
                                {[...Array(5)].map((_, i) => (
                                    <Star key={i} className="w-4 h-4 fill-current" />
                                ))}
                            </div>
                            <p className="text-gray-600 mb-4">"{testimonial.text}"</p>
                            <div className="flex items-center gap-3">
                                <img 
                                    src={testimonial.image} 
                                    alt={testimonial.name}
                                    className="w-10 h-10 rounded-full object-cover border-2 border-teal-200"
                                />
                                <div>
                                    <div className="font-semibold text-gray-900">{testimonial.name}</div>
                                    <div className="text-sm text-gray-500">{testimonial.role}</div>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </Marquee>

                {/* <Marquee reverse>
                    {[...testimonials].reverse().map((testimonial, index) => (
                        <motion.div
                            key={index}
                            className="w-[350px] p-6 bg-white rounded-2xl border border-gray-200 shadow-lg hover:border-cyan-300 hover:shadow-xl transition-all duration-300"
                            whileHover={{ y: -5, scale: 1.02 }}
                        >
                            <div className="flex text-amber-400 mb-4">
                                {[...Array(5)].map((_, i) => (
                                    <Star key={i} className="w-4 h-4 fill-current" />
                                ))}
                            </div>
                            <p className="text-gray-600 mb-4">"{testimonial.text}"</p>
                            <div className="flex items-center gap-3">
                                <img 
                                    src={testimonial.image} 
                                    alt={testimonial.name}
                                    className="w-10 h-10 rounded-full object-cover border-2 border-cyan-200"
                                />
                                <div>
                                    <div className="font-semibold text-gray-900">{testimonial.name}</div>
                                    <div className="text-sm text-gray-500">{testimonial.role}</div>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </Marquee> */}
            </section>

            {/* CTA Section */}
            <section className="py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-gray-50 to-white relative overflow-hidden">
                <div className="absolute inset-0">
                    <motion.div
                        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full"
                        style={{
                            background: 'radial-gradient(circle, rgba(20,184,166,0.1) 0%, transparent 70%)'
                        }}
                        animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0.8, 0.5] }}
                        transition={{ duration: 5, repeat: Infinity }}
                    />
                </div>
                
                <div className="max-w-4xl mx-auto relative z-10">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                    >
                        <div className="relative rounded-3xl p-[2px] overflow-hidden">
                            {/* Rotating gradient border */}
                            <motion.div
                                className="absolute inset-[-50%] w-[200%] h-[200%]"
                                style={{
                                    background: "conic-gradient(from 0deg, #14b8a6, #06b6d4, #0ea5e9, #38bdf8, #14b8a6)",
                                }}
                                animate={{ rotate: 360 }}
                                transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                            />
                            <div className="relative rounded-3xl bg-white p-8 sm:p-12 text-center">
                                <motion.img
                                    src={logo}
                                    alt="Mentro Logo"
                                    className="h-16 w-auto mx-auto mb-6"
                                    animate={{ y: [0, -10, 0], rotate: [0, 5, -5, 0] }}
                                    transition={{ duration: 4, repeat: Infinity }}
                                />
                                <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
                                    Ready to Transform Your Business?
                                </h2>
                                <p className="text-xl text-gray-500 mb-8 max-w-2xl mx-auto">
                                    Join thousands of tailors who have already modernized their workflow with Mentro.
                                </p>
                                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                                    <MagneticButton>
                                        <Button
                                            size="lg"
                                            className="text-lg px-8 py-6 bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-600 hover:to-cyan-600 shadow-xl shadow-teal-500/25 rounded-xl"
                                            asChild
                                        >
                                            <Link to="/signup">
                                                Create Free Account
                                                <motion.span
                                                    className="ml-2 inline-block"
                                                    animate={{ x: [0, 5, 0] }}
                                                    transition={{ duration: 1.5, repeat: Infinity }}
                                                >
                                                    <ArrowRight className="w-5 h-5" />
                                                </motion.span>
                                            </Link>
                                        </Button>
                                    </MagneticButton>
                                    <Button
                                        size="lg"
                                        variant="outline"
                                        className="text-lg px-8 py-6 border-2 border-gray-200 hover:border-teal-300 hover:bg-teal-50 rounded-xl text-gray-700"
                                        asChild
                                    >
                                        <Link to="/login">
                                            Sign In to Dashboard
                                        </Link>
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Footer */}
            <footer className="py-12 px-4 sm:px-6 lg:px-8 bg-gray-50 border-t border-gray-200">
                <div className="max-w-7xl mx-auto">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                        <div className="flex items-center gap-3">
                            <img src={logo} alt="Mentro Logo" className="h-8 w-auto" />
                            <span className="text-lg font-bold bg-gradient-to-r from-teal-600 to-cyan-600 bg-clip-text text-transparent">
                                Mentro
                            </span>
                        </div>
                        <div className="flex items-center gap-8 text-sm text-gray-500">
                            <Link to="/login" className="hover:text-teal-600 transition-colors">Sign In</Link>
                            <Link to="/signup" className="hover:text-teal-600 transition-colors">Get Started</Link>
                        </div>
                        <p className="text-sm text-gray-400">
                            © {new Date().getFullYear()} Mentro. All rights reserved.
                        </p>
                    </div>
                </div>
            </footer>
        </div>
    )
}
