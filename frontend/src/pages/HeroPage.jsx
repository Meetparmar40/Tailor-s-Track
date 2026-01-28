import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
    Scissors,
    Users,
    ClipboardList,
    Ruler,
    ArrowRight,
    CheckCircle2,
    Sparkles
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'

const features = [
    {
        icon: ClipboardList,
        title: 'Order Management',
        description: 'Track orders with intuitive Kanban boards. Never miss a deadline again.'
    },
    {
        icon: Users,
        title: 'Customer Database',
        description: 'Store customer details and history in one organized place.'
    },
    {
        icon: Ruler,
        title: 'Measurements',
        description: 'Save and access customer measurements digitally anytime.'
    }
]

const benefits = [
    'Easy order tracking with visual Kanban boards',
    'Digital measurement storage for quick access',
    'Customer management made simple',
    'Access from anywhere, anytime',
    'Secure cloud storage for your data'
]

export default function HeroPage() {
    return (
        <div className="min-h-screen bg-gradient-to-b from-background via-background to-muted/30">
            {/* Navigation */}
            <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border/50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">
                        {/* Logo */}
                        <div className="flex items-center gap-2">
                            <div className="p-2 bg-primary rounded-xl">
                                <Scissors className="w-5 h-5 text-primary-foreground" />    {/* Logo change here */}
                            </div>
                            <span className="text-xl font-bold text-foreground">Tailor Track</span>
                        </div>

                        {/* Auth Buttons */}
                        <div className="flex items-center gap-3">
                            <Button variant="ghost" asChild>
                                <Link to="/login">Sign In</Link>
                            </Button>
                            <Button asChild>
                                <Link to="/signup">
                                    Get Started
                                    <ArrowRight className="w-4 h-4 ml-1" />
                                </Link>
                            </Button>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center max-w-4xl mx-auto">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5 }}
                        >
                            {/* Badge */}
                            <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full text-primary text-sm font-medium mb-6">
                                <Sparkles className="w-4 h-4" />
                                Streamline Your Tailoring Business
                            </div>

                            {/* Headline */}
                            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground tracking-tight mb-6">
                                Manage Your Orders,
                                <br />
                                <span className="text-primary">Measurements & Customers</span>
                            </h1>

                            {/* Subheadline */}
                            <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto mb-10">
                                The complete management solution for tailors and fashion designers.
                                Track orders, store measurements, and manage your customer base effortlessly.
                            </p>

                            {/* CTA Buttons */}
                            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                                <Button size="lg" className="w-full sm:w-auto text-base px-8" asChild>
                                    <Link to="/signup">
                                        Start Free Today
                                        <ArrowRight className="w-5 h-5 ml-2" />
                                    </Link>
                                </Button>
                                <Button size="lg" variant="outline" className="w-full sm:w-auto text-base px-8" asChild>
                                    <Link to="/login">
                                        Sign In to Your Account
                                    </Link>
                                </Button>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="py-20 px-4 sm:px-6 lg:px-8 bg-muted/30">
                <div className="max-w-7xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        viewport={{ once: true }}
                        className="text-center mb-16"
                    >
                        <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
                            Everything You Need
                        </h2>
                        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                            Powerful features designed specifically for tailoring businesses
                        </p>
                    </motion.div>

                    <div className="grid md:grid-cols-3 gap-8">
                        {features.map((feature, index) => (
                            <motion.div
                                key={feature.title}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: index * 0.1 }}
                                viewport={{ once: true }}
                            >
                                <Card className="h-full border-0 shadow-lg bg-card/80 backdrop-blur hover:shadow-xl transition-shadow duration-300">
                                    <CardContent className="p-8">
                                        <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center mb-6">
                                            <feature.icon className="w-7 h-7 text-primary" />
                                        </div>
                                        <h3 className="text-xl font-semibold text-foreground mb-3">
                                            {feature.title}
                                        </h3>
                                        <p className="text-muted-foreground leading-relaxed">
                                            {feature.description}
                                        </p>
                                    </CardContent>
                                </Card>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Benefits Section */}
            <section className="py-20 px-4 sm:px-6 lg:px-8">
                <div className="max-w-7xl mx-auto">
                    <div className="grid lg:grid-cols-2 gap-16 items-center">
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.5 }}
                            viewport={{ once: true }}
                        >
                            <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-6">
                                Why Choose Tailor Track?
                            </h2>
                            <p className="text-lg text-muted-foreground mb-8">
                                Built specifically for tailoring professionals who want to modernize
                                their workflow and grow their business.
                            </p>
                            <ul className="space-y-4">
                                {benefits.map((benefit, index) => (
                                    <motion.li
                                        key={index}
                                        initial={{ opacity: 0, x: -20 }}
                                        whileInView={{ opacity: 1, x: 0 }}
                                        transition={{ duration: 0.3, delay: index * 0.1 }}
                                        viewport={{ once: true }}
                                        className="flex items-center gap-3"
                                    >
                                        <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0" />
                                        <span className="text-foreground">{benefit}</span>
                                    </motion.li>
                                ))}
                            </ul>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.5 }}
                            viewport={{ once: true }}
                            className="relative"
                        >
                            <div className="bg-gradient-to-br from-primary via-primary/90 to-primary/80 rounded-3xl p-8 sm:p-12 text-primary-foreground">
                                <div className="flex items-center gap-3 mb-6">
                                    <div className="p-3 bg-white/10 rounded-xl">
                                        <Scissors className="w-8 h-8" />
                                    </div>
                                </div>
                                <h3 className="text-2xl sm:text-3xl font-bold mb-4">
                                    Ready to Get Started?
                                </h3>
                                <p className="text-primary-foreground/80 mb-8">
                                    Join hundreds of tailors who have already transformed their
                                    business with Tailor Track.
                                </p>
                                <Button
                                    size="lg"
                                    variant="secondary"
                                    className="w-full sm:w-auto"
                                    asChild
                                >
                                    <Link to="/signup">
                                        Create Free Account
                                        <ArrowRight className="w-5 h-5 ml-2" />
                                    </Link>
                                </Button>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="py-8 px-4 sm:px-6 lg:px-8 border-t border-border">
                <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div className="flex items-center gap-2">
                        <div className="p-1.5 bg-primary rounded-lg">
                            <Scissors className="w-4 h-4 text-primary-foreground" />
                        </div>
                        <span className="text-sm font-medium text-foreground">Tailor Track</span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                        © {new Date().getFullYear()} Tailor Track. All rights reserved.
                    </p>
                </div>
            </footer>
        </div>
    )
}
