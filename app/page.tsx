import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Building2,
  Hotel,
  Users,
  TrendingUp,
  Award,
  Globe,
  ArrowRight,
  CheckCircle,
  Plane,
  MapPin,
  Plus,
} from 'lucide-react';

export default function HomePage() {
  const features = [
    {
      icon: <Building2 className="h-6 w-6" />,
      title: 'Agency Management',
      description: 'Manage travel agencies and their partnerships with ease',
    },
    {
      icon: <Hotel className="h-6 w-6" />,
      title: 'Hotel Network',
      description: 'Connect with premium hotels worldwide for exclusive deals',
    },
    {
      icon: <Users className="h-6 w-6" />,
      title: 'User Profiles',
      description: 'Track agent performance and customer relationships',
    },
    {
      icon: <Award className="h-6 w-6" />,
      title: 'Incentive Programs',
      description: 'Create rewarding programs to motivate your travel partners',
    },
    {
      icon: <TrendingUp className="h-6 w-6" />,
      title: 'Analytics Dashboard',
      description: 'Monitor bookings, revenue, and program performance',
    },
    {
      icon: <Globe className="h-6 w-6" />,
      title: 'Global Reach',
      description: 'Expand your network across international markets',
    },
  ];

  const stats = [
    { label: 'Travel Agencies', value: '500+', icon: <Plane className="h-5 w-5" /> },
    { label: 'Hotel Partners', value: '1,200+', icon: <Hotel className="h-5 w-5" /> },
    { label: 'Active Users', value: '10,000+', icon: <Users className="h-5 w-5" /> },
    { label: 'Countries', value: '45+', icon: <MapPin className="h-5 w-5" /> },
  ];

  const benefits = [
    'Automated booking management and commission tracking',
    'Real-time performance analytics and reporting',
    'Integrated hotel and agency partner networks',
    'Customizable incentive program structures',
    '24/7 customer support and onboarding assistance',
  ];

  return (
    <div className="mx-auto max-w-7xl px-4">
      <div className="hero-white min-h-screen">
        {/* Header */}
        <header className="glassmorphism bg-blur-lg sticky top-0 z-50 border-b border-gray-200 bg-white/90 backdrop-blur">
          <div className="container mx-auto flex h-16 items-center justify-between px-4">
            <div className="animate-fade-in-left flex items-center space-x-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-orange-600">
                <Building2 className="h-5 w-5 text-white" />
              </div>
              <span className="text-xl font-bold text-gray-900">TravelIncentive</span>
            </div>

            <nav className="hidden items-center space-x-6 md:flex">
              <Link
                href="#features"
                className="nav-link text-sm font-medium text-gray-600 hover:text-gray-900"
              >
                Features
              </Link>
              <Link
                href="/dashboard"
                className="nav-link text-sm font-medium text-gray-600 hover:text-gray-900"
              >
                Dasboard
              </Link>
              <Link
                href="/agent/application"
                className="nav-link text-sm font-medium text-gray-600 hover:text-gray-900"
              >
                Application
              </Link>
            </nav>

            <div className="animate-fade-in-right flex items-center space-x-4">
              <Link href="/login">
                <Button variant="outline" size="sm">
                  Sign In
                </Button>
              </Link>
              <Link href="/agent/application">
                <Button size="sm" className="cta-button">
                  Get Started
                </Button>
              </Link>
            </div>
          </div>
        </header>

        {/* Hero Section */}
        <section className="bg-pattern px-4 py-20">
          <div className="container mx-auto text-center">
            <Badge variant="secondary" className="animate-fade-in-up mb-4">
              🎯 Travel Industry Solution
            </Badge>

            <h1 className="animate-fade-in-up animate-delay-100 mb-6 text-4xl font-bold md:text-6xl">
              Empower Your Travel
              <span className="text-gradient"> Agency Network</span>
            </h1>

            <p className="animate-fade-in-up animate-delay-200 mx-auto mb-8 max-w-3xl text-xl text-gray-600">
              The complete incentive management platform designed for travel agencies. Boost
              partnerships, track performance, and grow your business with intelligent automation.
            </p>

            <div className="animate-fade-in-up animate-delay-300 mb-12 flex flex-col justify-center gap-4 sm:flex-row">
              <Link href="/signup">
                <Button size="lg" className="cta-button w-full sm:w-auto">
                  Start Free Trial
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Link href="/dashboard">
                <Button variant="outline" size="lg" className="shadow-glow w-full sm:w-auto">
                  View Demo Dashboard
                </Button>
              </Link>
            </div>

            {/* Stats */}
            <div className="mx-auto grid max-w-4xl grid-cols-2 gap-8 md:grid-cols-4">
              {stats.map((stat, index) => (
                <div
                  key={index}
                  className={`stat-item animate-fade-in-up text-center animate-delay-${(index + 4) * 100}`}
                >
                  <div className="mb-2 flex justify-center text-orange-600">{stat.icon}</div>
                  <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
                  <div className="text-sm text-gray-600">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="bg-white px-4 py-20">
          <div className="container mx-auto">
            <div className="mb-16 text-center">
              <h2 className="animate-fade-in-up mb-4 text-3xl font-bold text-gray-900 md:text-4xl">
                Everything You Need to Manage Travel Incentives
              </h2>
              <p className="animate-fade-in-up animate-delay-100 mx-auto max-w-2xl text-xl text-gray-600">
                From agency partnerships to booking analytics, our platform provides all the tools
                you need to run successful incentive programs.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
              {features.map((feature, index) => (
                <Card
                  key={index}
                  className={`feature-card animate-fade-in-up animate-delay-${(index + 1) * 100}`}
                >
                  <CardHeader>
                    <div className="flex items-center space-x-3">
                      <div className="feature-icon flex h-10 w-10 items-center justify-center rounded-lg">
                        {feature.icon}
                      </div>
                      <CardTitle className="text-lg">{feature.title}</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-base">{feature.description}</CardDescription>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Benefits Section */}
        <section className="bg-gray-50 px-4 py-20">
          <div className="container mx-auto">
            <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2">
              <div className="animate-fade-in-left">
                <h2 className="mb-6 text-3xl font-bold text-gray-900 md:text-4xl">
                  Why Travel Agencies Choose Our Platform
                </h2>

                <div className="space-y-4">
                  {benefits.map((benefit, index) => (
                    <div
                      key={index}
                      className={`benefit-item animate-fade-in-left flex items-start space-x-3 animate-delay-${(index + 1) * 100}`}
                    >
                      <CheckCircle className="mt-0.5 h-6 w-6 flex-shrink-0 text-green-500" />
                      <p className="text-gray-700">{benefit}</p>
                    </div>
                  ))}
                </div>

                <div className="mt-8">
                  <Link href="/signup">
                    <Button size="lg" className="cta-button">
                      Get Started Today
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                </div>
              </div>

              <div className="animate-fade-in-right lg:pl-8">
                <Card className="success-card relative z-10 border-0 p-6 text-white">
                  <div className="relative z-10 space-y-4">
                    <div className="flex items-center space-x-2">
                      <Award className="h-6 w-6" />
                      <span className="font-semibold">Success Story</span>
                    </div>
                    <blockquote className="text-lg">
                      &quot;Since implementing TravelIncentive, our agency partnerships have grown
                      by 200% and our booking efficiency has improved dramatically. The automated
                      reporting saves us hours every week.&quot;
                    </blockquote>
                    <div className="border-t border-blue-400 pt-4">
                      <p className="font-semibold">Sarah Johnson</p>
                      <p className="text-blue-200">Director, Global Travel Solutions</p>
                    </div>
                  </div>
                </Card>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="bg-accent px-4 py-20">
          <div className="container mx-auto text-center ">
            <h2 className="animate-fade-in-up mb-4 text-3xl font-bold md:text-4xl">
              Ready to Transform Your Travel Business?
            </h2>
            <p className="animate-fade-in-up animate-delay-100 mx-auto mb-8 max-w-2xl text-xl opacity-90">
              Join thousands of travel professionals who trust our platform to manage their
              incentive programs and grow their business.
            </p>

            <div className="animate-fade-in-up animate-delay-200 flex flex-col justify-center gap-4 sm:flex-row">
              <Link href="/signup">
                <Button variant="outline" size="lg" className="shadow-glow w-full sm:w-auto">
                  Start Your Free Tr ial
                </Button>
              </Link>
              <Link href="/login">
                <Button size="lg" className="cta-button">
                  Sign In to Dashboard
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className=" bg-slate-800 px-4  py-12 text-white">
          <div className="container mx-auto">
            <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
              <div className="animate-fade-in-up">
                <div className="mb-4 flex items-center space-x-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-orange-600">
                    <Building2 className="h-5 w-5 text-white" />
                  </div>
                  <span className="text-xl font-bold">TravelIncentive</span>
                </div>
                <p className="text-gray-400">
                  Empowering travel agencies with intelligent incentive management solutions.
                </p>
              </div>

              <div className="animate-fade-in-up animate-delay-100">
                <h3 className="mb-4 font-semibold">Product</h3>
                <ul className="space-y-2 text-gray-400">
                  <li>
                    <Link href="#" className="nav-link hover:text-white">
                      Features
                    </Link>
                  </li>
                  <li>
                    <Link href="#" className="nav-link hover:text-white">
                      Pricing
                    </Link>
                  </li>
                  <li>
                    <Link href="#" className="nav-link hover:text-white">
                      API
                    </Link>
                  </li>
                </ul>
              </div>

              <div className="animate-fade-in-up animate-delay-200">
                <h3 className="mb-4 font-semibold">Company</h3>
                <ul className="space-y-2 text-gray-400">
                  <li>
                    <Link href="#" className="nav-link hover:text-white">
                      About
                    </Link>
                  </li>
                  <li>
                    <Link href="#" className="nav-link hover:text-white">
                      Contact
                    </Link>
                  </li>
                  <li>
                    <Link href="#" className="nav-link hover:text-white">
                      Support
                    </Link>
                  </li>
                </ul>
              </div>

              <div className="animate-fade-in-up animate-delay-300">
                <h3 className="mb-4 font-semibold">Legal</h3>
                <ul className="space-y-2 text-gray-400">
                  <li>
                    <Link href="#" className="nav-link hover:text-white">
                      Privacy
                    </Link>
                  </li>
                  <li>
                    <Link href="#" className="nav-link hover:text-white">
                      Terms
                    </Link>
                  </li>
                  <li>
                    <Link href="#" className="nav-link hover:text-white">
                      Security
                    </Link>
                  </li>
                </ul>
              </div>
            </div>

            <div className="animate-fade-in-up animate-delay-400 mt-8 border-t border-gray-800 pt-8 text-center text-gray-400">
              <p>&copy; 2025 TravelIncentive. All rights reserved.</p>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}
