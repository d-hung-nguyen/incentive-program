import Link from 'next/link';
import React from 'react';
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
  Shield,
  UserCheck,
  BarChart3,
  Star,
  Trophy,
  Target,
  Eye,
  Calendar,
  Gift,
  Crown,
  Sparkles,
} from 'lucide-react';

export default function HomePage() {
  const hotelBenefits = [
    {
      icon: <Users className="h-6 w-6" />,
      title: "Connect with Europe's Best Agencies",
      description: 'Gain access to a curated network of high-performing luxury travel advisors.',
    },
    {
      icon: <TrendingUp className="h-6 w-6" />,
      title: 'Boost Sales in Key Periods',
      description: 'Activate targeted campaigns during peak or need periods to maximize revenue.',
    },
    {
      icon: <Award className="h-6 w-6" />,
      title: 'Reward and Motivate Advisors',
      description: 'Offer a transparent, points-based system that keeps agents engaged and loyal.',
    },
    {
      icon: <Eye className="h-6 w-6" />,
      title: 'Stay Top of Mind',
      description:
        'Feature your property on a dedicated platform where advisors discover and book luxury stays.',
    },
    {
      icon: <BarChart3 className="h-6 w-6" />,
      title: 'Measure Results',
      description: 'Track bookings, redemptions, and performance through real-time reporting.',
    },
  ];

  const agencyBenefits = [
    {
      icon: <Trophy className="h-6 w-6" />,
      title: 'Earn Rewards on Every Booking',
      description: 'Log your stays online and collect points for every confirmed room night.',
    },
    {
      icon: <Gift className="h-6 w-6" />,
      title: 'Redeem for Premium Perks',
      description: 'Convert points into luxury rewards, vouchers, and exclusive experiences.',
    },
    {
      icon: <Crown className="h-6 w-6" />,
      title: 'Preferred Partner Access',
      description:
        'Top-performing agencies unlock VIP benefits, invitations to special events, and familiarization trips.',
    },
    {
      icon: <Target className="h-6 w-6" />,
      title: 'Stay Ahead of the Market',
      description: 'Receive updates on promotions, bonus point campaigns, and new hotel partners.',
    },
  ];

  const howItWorksSteps = [
    {
      step: '1',
      title: 'Enroll',
      description: 'Hotels and agencies register on the Global Elite Rewards portal.',
      icon: <Plus className="h-6 w-6" />,
    },
    {
      step: '2',
      title: 'Book & Log',
      description: 'Advisors log confirmed bookings at participating hotels.',
      icon: <Calendar className="h-6 w-6" />,
    },
    {
      step: '3',
      title: 'Validate & Earn',
      description: 'Hotels approve bookings; points are credited automatically.',
      icon: <CheckCircle className="h-6 w-6" />,
    },
    {
      step: '4',
      title: 'Redeem',
      description: 'Points can be exchanged for rewards once thresholds are reached.',
      icon: <Sparkles className="h-6 w-6" />,
    },
  ];

  const stats = [
    { label: 'Luxury Hotels', value: '500+', icon: <Hotel className="h-5 w-5" /> },
    { label: 'Travel Advisors', value: '1,200+', icon: <Users className="h-5 w-5" /> },
    { label: 'European Markets', value: '25+', icon: <MapPin className="h-5 w-5" /> },
    { label: 'Points Redeemed', value: '2M+', icon: <Award className="h-5 w-5" /> },
  ];

  return (
    <div className="mx-auto max-w-7xl px-4">
      <div className="hero-white min-h-screen">
        {/* Header */}
        <header className="glassmorphism bg-blur-lg sticky top-0 z-50 border-b border-gray-200 bg-white/90 backdrop-blur">
          <div className="container mx-auto flex h-16 items-center justify-between px-4">
            <div className="animate-fade-in-left flex items-center space-x-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600">
                <Crown className="h-5 w-5 text-white" />
              </div>
              <span className="text-xl font-bold text-gray-900">Global Elite Rewards</span>
            </div>

            <nav className="hidden items-center space-x-6 md:flex">
              <Link
                href="#how-it-works"
                className="nav-link text-sm font-medium text-gray-600 hover:text-gray-900"
              >
                How It Works
              </Link>

              {/* Dashboard Links */}
              <div className="group relative">
                <button className="nav-link flex items-center gap-1 text-sm font-medium text-gray-600 hover:text-gray-900">
                  Portals
                  <ArrowRight className="h-3 w-3 rotate-90" />
                </button>

                <div className="invisible absolute left-0 top-full z-50 mt-1 w-48 rounded-md border border-gray-200 bg-white opacity-0 shadow-lg transition-all duration-200 group-hover:visible group-hover:opacity-100">
                  <div className="py-1">
                    <Link
                      href="/dashboard"
                      className="flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50"
                    >
                      <Shield className="h-4 w-4" />
                      Admin Dashboard
                    </Link>
                    <Link
                      href="/agent/dashboard"
                      className="flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50"
                    >
                      <UserCheck className="h-4 w-4" />
                      Travel Advisor Portal
                    </Link>
                    <Link
                      href="/regional/dashboard"
                      className="flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50"
                    >
                      <Globe className="h-4 w-4" />
                      Regional Manager
                    </Link>
                    <Link
                      href="/resort/dashboard"
                      className="flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50"
                    >
                      <Hotel className="h-4 w-4" />
                      Hotel Partner Portal
                    </Link>
                  </div>
                </div>
              </div>

              {/* Account Links */}
              <div className="group relative">
                <button className="nav-link flex items-center gap-1 text-sm font-medium text-gray-600 hover:text-gray-900">
                  Account
                  <ArrowRight className="h-3 w-3 rotate-90" />
                </button>

                <div className="invisible absolute left-0 top-full z-50 mt-1 w-48 rounded-md border border-gray-200 bg-white opacity-0 shadow-lg transition-all duration-200 group-hover:visible group-hover:opacity-100">
                  <div className="py-1">
                    <Link
                      href="/login"
                      className="flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50"
                    >
                      Sign In
                    </Link>
                    <Link
                      href="/signup"
                      className="flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50"
                    >
                      Register
                    </Link>
                    <Link
                      href="/agent/application"
                      className="flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50"
                    >
                      Apply as Advisor
                    </Link>
                  </div>
                </div>
              </div>
            </nav>

            <div className="animate-fade-in-right flex items-center space-x-4">
              <Link href="/login">
                <Button variant="outline" size="sm">
                  Sign In
                </Button>
              </Link>
              <Link href="/agent/application">
                <Button size="sm" className="cta-button">
                  Join Program
                </Button>
              </Link>
            </div>
          </div>
        </header>

        {/* Hero Section */}
        <section className="bg-pattern px-4 py-20">
          <div className="container mx-auto text-center">
            <div className="animate-fade-in-up mb-8">
              <h1 className="mb-6 text-5xl font-bold md:text-7xl">
                <span className="text-gradient">Global Elite Rewards</span>
              </h1>

              <p className="mx-auto mb-8 max-w-3xl text-2xl font-medium text-gray-700">
                Where Luxury Hotels and Europe's Leading Travel Advisors Connect
              </p>
            </div>

            <div className="animate-fade-in-up animate-delay-200 mb-12">
              <h2 className="mb-6 text-3xl font-bold text-gray-900">
                Unlock the Power of Partnership
              </h2>

              <p className="mx-auto mb-8 max-w-4xl text-xl leading-relaxed text-gray-600">
                Global Elite Rewards is an exclusive incentive program designed to bring together
                exceptional hotels and Europe's top travel agencies.
                <br />
                <strong>We make it simple:</strong> Hotels boost their visibility and bookings.
                Travel advisors earn rewards for every stay they sell. Together, we create
                unforgettable guest experiences.
              </p>
            </div>

            <div className="animate-fade-in-up animate-delay-300 mb-12 flex flex-col justify-center gap-4 sm:flex-row">
              <Link href="/signup">
                <Button size="lg" className="cta-button w-full sm:w-auto">
                  Become a Partner Hotel
                  <Hotel className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Link href="/agent/application">
                <Button variant="outline" size="lg" className="shadow-glow w-full sm:w-auto">
                  Enroll as Travel Advisor
                  <Users className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>

            {/* Stats */}
            <div className="animate-fade-in-up animate-delay-400 mx-auto grid max-w-4xl grid-cols-2 gap-8 md:grid-cols-4">
              {stats.map((stat, index) => (
                <div key={index} className="stat-item text-center">
                  <div className="mb-2 flex justify-center text-blue-600">{stat.icon}</div>
                  <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
                  <div className="text-sm text-gray-600">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Why Hotels Join Section */}
        <section className="bg-white px-4 py-20">
          <div className="container mx-auto">
            <div className="mb-16 text-center">
              <h2 className="animate-fade-in-up mb-4 text-3xl font-bold text-gray-900 md:text-4xl">
                Why Hotels Join
              </h2>
            </div>

            <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
              {hotelBenefits.map((benefit, index) => (
                <Card
                  key={index}
                  className={`feature-card animate-fade-in-up animate-delay-${(index + 1) * 100}`}
                >
                  <CardHeader>
                    <div className="flex items-center space-x-3">
                      <div className="feature-icon flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100 text-blue-600">
                        {benefit.icon}
                      </div>
                      <CardTitle className="text-lg">{benefit.title}</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-base">{benefit.description}</CardDescription>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Why Travel Agencies Join Section */}
        <section className="bg-gray-50 px-4 py-20">
          <div className="container mx-auto">
            <div className="mb-16 text-center">
              <h2 className="animate-fade-in-up mb-4 text-3xl font-bold text-gray-900 md:text-4xl">
                Why Travel Agencies Join
              </h2>
            </div>

            <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
              {agencyBenefits.map((benefit, index) => (
                <Card
                  key={index}
                  className={`feature-card animate-fade-in-up animate-delay-${(index + 1) * 100}`}
                >
                  <CardHeader>
                    <div className="flex items-center space-x-3">
                      <div className="feature-icon flex h-10 w-10 items-center justify-center rounded-lg bg-orange-100 text-orange-600">
                        {benefit.icon}
                      </div>
                      <CardTitle className="text-lg">{benefit.title}</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-base">{benefit.description}</CardDescription>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section id="how-it-works" className="bg-white px-4 py-20">
          <div className="container mx-auto">
            <div className="mb-16 text-center">
              <h2 className="animate-fade-in-up mb-4 text-3xl font-bold text-gray-900 md:text-4xl">
                How It Works
              </h2>
            </div>

            <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
              {howItWorksSteps.map((step, index) => (
                <Card
                  key={index}
                  className={`feature-card animate-fade-in-up animate-delay-${(index + 1) * 100}`}
                >
                  <CardHeader className="text-center">
                    <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-blue-600 text-white">
                      <span className="text-2xl font-bold">{step.step}</span>
                    </div>
                    <CardTitle className="text-lg">{step.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="text-center">
                    <div className="mx-auto mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100 text-blue-600">
                      {step.icon}
                    </div>
                    <CardDescription className="text-base">{step.description}</CardDescription>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Campaigns Section */}
        <section className="bg-gradient-to-br from-blue-50 to-indigo-100 px-4 py-20">
          <div className="container mx-auto text-center">
            <div className="animate-fade-in-up mb-8">
              <h2 className="mb-6 text-3xl font-bold text-gray-900 md:text-4xl">
                Campaigns & Bonus Rewards
              </h2>

              <p className="mx-auto max-w-3xl text-xl leading-relaxed text-gray-700">
                Throughout the year, Global Elite Rewards runs targeted campaigns — double points,
                exclusive offers, and tactical incentives that benefit both hotels and agents.
                Preferred partners also receive early access to special promotions.
              </p>
            </div>

            <div className="animate-fade-in-up animate-delay-200 grid grid-cols-1 gap-6 md:grid-cols-3">
              <Card className="feature-card">
                <CardHeader>
                  <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-lg bg-green-100 text-green-600">
                    <Star className="h-6 w-6" />
                  </div>
                  <CardTitle>Double Points</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>
                    Seasonal campaigns offering 2x points for qualified bookings
                  </CardDescription>
                </CardContent>
              </Card>

              <Card className="feature-card">
                <CardHeader>
                  <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-lg bg-purple-100 text-purple-600">
                    <Gift className="h-6 w-6" />
                  </div>
                  <CardTitle>Exclusive Offers</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>
                    Special rates and packages available only to program members
                  </CardDescription>
                </CardContent>
              </Card>

              <Card className="feature-card">
                <CardHeader>
                  <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-lg bg-yellow-100 text-yellow-600">
                    <Crown className="h-6 w-6" />
                  </div>
                  <CardTitle>VIP Access</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>
                    Preferred partners get early access to promotions and events
                  </CardDescription>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Join the Program Section */}
        <section className="bg-accent px-4 py-20">
          <div className="container mx-auto">
            <div className="mb-16 text-center">
              <h2 className="animate-fade-in-up mb-4 text-3xl font-bold md:text-4xl">
                Join the Program
              </h2>
            </div>

            <div className="grid grid-cols-1 gap-12 lg:grid-cols-2">
              {/* For Hotels */}
              <div className="animate-fade-in-left">
                <Card className="success-card relative z-10 border-0 p-8 text-white">
                  <div className="relative z-10 space-y-6">
                    <div className="flex items-center space-x-3">
                      <Hotel className="h-8 w-8" />
                      <h3 className="text-2xl font-bold">For Hotels</h3>
                    </div>
                    <p className="text-lg leading-relaxed">
                      Position your property among Europe's most sought-after luxury brands. Drive
                      incremental bookings, gain market insights, and reward the advisors who
                      champion your hotel.
                    </p>
                    <Link href="/signup">
                      <Button
                        variant="outline"
                        size="lg"
                        className="shadow-glow w-full bg-white text-blue-600 hover:bg-gray-50"
                      >
                        Become a Partner Hotel
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </Link>
                  </div>
                </Card>
              </div>

              {/* For Travel Advisors */}
              <div className="animate-fade-in-right">
                <Card
                  className="relative z-10 border-0 p-8"
                  style={{ background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)' }}
                >
                  <div className="relative z-10 space-y-6 text-white">
                    <div className="flex items-center space-x-3">
                      <Users className="h-8 w-8" />
                      <h3 className="text-2xl font-bold">For Travel Advisors</h3>
                    </div>
                    <p className="text-lg leading-relaxed">
                      Turn your expertise into rewards. Join the platform, log your bookings, and
                      start earning perks for the stays you already sell.
                    </p>
                    <Link href="/agent/application">
                      <Button
                        variant="outline"
                        size="lg"
                        className="shadow-glow w-full bg-white text-orange-600 hover:bg-gray-50"
                      >
                        Enroll as a Travel Advisor
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </Link>
                  </div>
                </Card>
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="bg-slate-800 px-4 py-12 text-white">
          <div className="container mx-auto">
            <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
              <div className="animate-fade-in-up md:col-span-2">
                <div className="mb-4 flex items-center space-x-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600">
                    <Crown className="h-5 w-5 text-white" />
                  </div>
                  <span className="text-xl font-bold">Global Elite Rewards</span>
                </div>
                <p className="text-lg leading-relaxed text-gray-400">
                  Building stronger connections. Driving meaningful bookings. Celebrating
                  exceptional hospitality.
                </p>
              </div>

              <div className="animate-fade-in-up animate-delay-100">
                <h3 className="mb-4 font-semibold">Platform Access</h3>
                <ul className="space-y-2 text-gray-400">
                  <li>
                    <Link href="/dashboard" className="nav-link hover:text-white">
                      Admin Dashboard
                    </Link>
                  </li>
                  <li>
                    <Link href="/agent/dashboard" className="nav-link hover:text-white">
                      Travel Advisor Portal
                    </Link>
                  </li>
                  <li>
                    <Link href="/regional/dashboard" className="nav-link hover:text-white">
                      Regional Manager
                    </Link>
                  </li>
                  <li>
                    <Link href="/resort/dashboard" className="nav-link hover:text-white">
                      Hotel Partner Portal
                    </Link>
                  </li>
                </ul>
              </div>

              <div className="animate-fade-in-up animate-delay-200">
                <h3 className="mb-4 font-semibold">Get Started</h3>
                <ul className="space-y-2 text-gray-400">
                  <li>
                    <Link href="/login" className="nav-link hover:text-white">
                      Sign In
                    </Link>
                  </li>
                  <li>
                    <Link href="/signup" className="nav-link hover:text-white">
                      Register as Hotel
                    </Link>
                  </li>
                  <li>
                    <Link href="/agent/application" className="nav-link hover:text-white">
                      Apply as Travel Advisor
                    </Link>
                  </li>
                </ul>
              </div>
            </div>

            <div className="animate-fade-in-up animate-delay-400 mt-8 border-t border-gray-800 pt-8 text-center text-gray-400">
              <p>&copy; 2025 Global Elite Rewards. All rights reserved.</p>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}
