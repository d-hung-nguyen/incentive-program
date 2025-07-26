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

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b bg-white/80 backdrop-blur-sm">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <div className="flex items-center space-x-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600">
              <Building2 className="h-5 w-5 text-white" />
            </div>
            <span className="text-xl font-bold text-gray-900">TravelIncentive</span>
          </div>

          <nav className="hidden items-center space-x-6 md:flex">
            <Link
              href="#features"
              className="text-sm font-medium text-gray-600 hover:text-gray-900"
            >
              Features
            </Link>
            <Link href="#about" className="text-sm font-medium text-gray-600 hover:text-gray-900">
              About
            </Link>
            <Link href="#contact" className="text-sm font-medium text-gray-600 hover:text-gray-900">
              Contact
            </Link>
          </nav>

          <div className="flex items-center space-x-4">
            <Link href="/login">
              <Button variant="outline" size="sm">
                Sign In
              </Button>
            </Link>
            <Link href="/signup">
              <Button size="sm">Get Started</Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="px-4 py-20">
        <div className="container mx-auto text-center">
          <Badge variant="secondary" className="mb-4">
            🎯 Travel Industry Solution
          </Badge>

          <h1 className="mb-6 text-4xl font-bold text-gray-900 md:text-6xl">
            Empower Your Travel
            <span className="text-blue-600"> Agency Network</span>
          </h1>

          <p className="mx-auto mb-8 max-w-3xl text-xl text-gray-600">
            The complete incentive management platform designed for travel agencies. Boost
            partnerships, track performance, and grow your business with intelligent automation.
          </p>

          <div className="mb-12 flex flex-col justify-center gap-4 sm:flex-row">
            <Link href="/signup">
              <Button size="lg" className="w-full sm:w-auto">
                Start Free Trial
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <Link href="/dashboard">
              <Button variant="outline" size="lg" className="w-full sm:w-auto">
                View Demo Dashboard
              </Button>
            </Link>
          </div>

          {/* Stats */}
          <div className="mx-auto grid max-w-4xl grid-cols-2 gap-8 md:grid-cols-4">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="mb-2 flex justify-center text-blue-600">{stat.icon}</div>
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
            <h2 className="mb-4 text-3xl font-bold text-gray-900 md:text-4xl">
              Everything You Need to Manage Travel Incentives
            </h2>
            <p className="mx-auto max-w-2xl text-xl text-gray-600">
              From agency partnerships to booking analytics, our platform provides all the tools you
              need to run successful incentive programs.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            {features.map((feature, index) => (
              <Card key={index} className="border-0 shadow-lg transition-shadow hover:shadow-xl">
                <CardHeader>
                  <div className="flex items-center space-x-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100 text-blue-600">
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
            <div>
              <h2 className="mb-6 text-3xl font-bold text-gray-900 md:text-4xl">
                Why Travel Agencies Choose Our Platform
              </h2>

              <div className="space-y-4">
                {[
                  'Automated booking management and commission tracking',
                  'Real-time performance analytics and reporting',
                  'Integrated hotel and agency partner networks',
                  'Customizable incentive program structures',
                  '24/7 customer support and onboarding assistance',
                ].map((benefit, index) => (
                  <div key={index} className="flex items-start space-x-3">
                    <CheckCircle className="mt-0.5 h-6 w-6 flex-shrink-0 text-green-500" />
                    <p className="text-gray-700">{benefit}</p>
                  </div>
                ))}
              </div>

              <div className="mt-8">
                <Link href="/signup">
                  <Button size="lg">
                    Get Started Today
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </div>

            <div className="lg:pl-8">
              <Card className="border-0 bg-gradient-to-br from-blue-500 to-indigo-600 p-6 text-white">
                <div className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <Award className="h-6 w-6" />
                    <span className="font-semibold">Success Story</span>
                  </div>
                  <blockquote className="text-lg">
                    &quot;Since implementing TravelIncentive, our agency partnerships have grown by
                    200% and our booking efficiency has improved dramatically. The automated
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
      <section className="bg-blue-600 px-4 py-20">
        <div className="container mx-auto text-center text-white">
          <h2 className="mb-4 text-3xl font-bold md:text-4xl">
            Ready to Transform Your Travel Business?
          </h2>
          <p className="mx-auto mb-8 max-w-2xl text-xl opacity-90">
            Join thousands of travel professionals who trust our platform to manage their incentive
            programs and grow their business.
          </p>

          <div className="flex flex-col justify-center gap-4 sm:flex-row">
            <Link href="/signup">
              <Button size="lg" variant="secondary" className="w-full sm:w-auto">
                Start Your Free Trial
              </Button>
            </Link>
            <Link href="/login">
              <Button
                size="lg"
                variant="outline"
                className="w-full border-white text-white hover:bg-white hover:text-blue-600 sm:w-auto"
              >
                Sign In to Dashboard
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 px-4 py-12 text-white">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
            <div>
              <div className="mb-4 flex items-center space-x-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600">
                  <Building2 className="h-5 w-5 text-white" />
                </div>
                <span className="text-xl font-bold">TravelIncentive</span>
              </div>
              <p className="text-gray-400">
                Empowering travel agencies with intelligent incentive management solutions.
              </p>
            </div>

            <div>
              <h3 className="mb-4 font-semibold">Product</h3>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <Link href="#" className="hover:text-white">
                    Features
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white">
                    Pricing
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white">
                    API
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="mb-4 font-semibold">Company</h3>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <Link href="#" className="hover:text-white">
                    About
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white">
                    Contact
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white">
                    Support
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="mb-4 font-semibold">Legal</h3>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <Link href="#" className="hover:text-white">
                    Privacy
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white">
                    Terms
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white">
                    Security
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          <div className="mt-8 border-t border-gray-800 pt-8 text-center text-gray-400">
            <p>&copy; 2025 TravelIncentive. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
