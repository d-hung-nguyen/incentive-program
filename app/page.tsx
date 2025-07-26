import { Button } from '@/components/ui/button';
import Image from 'next/image';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from '@/components/ui/card';
import Link from 'next/link';
import { Star, Check, Coins, UserCheck, Database } from 'lucide-react';

export default async function LandingPage() {
  return (
    <div className="flex min-h-[100dvh] flex-col">
      <header className="fixed flex h-16 w-full items-center  border-b border-b-slate-200 bg-white px-4 lg:px-6">
        <Link className="flex items-center justify-center" href="#">
          <Image src="/logo.png" alt="logo" width={50} height={50} />
          <span className="sr-only">Acme Inc</span>
        </Link>
        <nav className="ml-auto flex gap-4 sm:gap-6">
          <a className="text-sm font-medium underline-offset-4 hover:underline" href="#features">
            Features
          </a>
          <a
            className="text-sm font-medium underline-offset-4 hover:underline"
            href="#testimonials"
          >
            Testimonials
          </a>
        </nav>
        <Button className="mx-2 md:mx-4 lg:mx-6 xl:mx-10">
          <Link className="text-sm font-medium underline-offset-4 hover:underline" href="/login">
            Get Started
          </Link>
        </Button>
      </header>
      <main className="flex-1">
        <section className="w-full py-20 lg:py-32 xl:py-40">
          <div className="container flex flex-col px-4 md:flex-row md:px-6 ">
            <div className="flex w-full flex-col space-y-4 md:w-1/2 ">
              <div className="space-y-2">
                <h1 className="text-2xl  tracking-tighter sm:text-3xl md:text-4xl lg:text-5xl/none">
                  Saas Template with Supabase and Next.js
                </h1>
                <p className=" text-muted-foreground md:text-xl">
                  NextJS Boilerplate with Supabase authentication ready to build your next app
                </p>
              </div>
              <div className="flex flex-col gap-2 min-[400px]:flex-row">
                <Link className="btn" href="/login">
                  <Button className=" p-7">Get Started</Button>
                </Link>
              </div>
            </div>
            <div className="flex w-full items-center justify-center md:w-1/2">
              <Image
                alt="Hero"
                className="mx-auto aspect-video overflow-hidden rounded-xl object-cover sm:w-full lg:order-last lg:aspect-square"
                height="550"
                src="/placeholder.svg"
                width="550"
              />
            </div>
          </div>
        </section>
        <section id="features" className="w-full bg-secondary py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">
                  Everything you need to get started
                </h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Built with modern technologies and best practices to help you ship faster.
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl items-center gap-6 py-12 lg:grid-cols-3 lg:gap-12">
              <div className="flex flex-col items-center space-y-2 rounded-lg border-muted-foreground/10 p-4">
                <div className="rounded-full bg-primary/10 p-2">
                  <UserCheck className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-bold">Authentication</h3>
                <p className="text-center text-muted-foreground">
                  Utilize our preexisting Supabase integration to auth your users and secure your
                  app
                </p>
              </div>
              <div className="flex flex-col items-center space-y-2 rounded-lg border-muted-foreground/10 p-4">
                <div className="rounded-full bg-primary/10 p-2">
                  <Database className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-bold">Database</h3>
                <p className="text-center text-muted-foreground">
                  PostgreSQL database with Supabase for reliable data storage and real-time features
                </p>
              </div>
              <div className="flex flex-col items-center space-y-2 rounded-lg border-muted-foreground/10 p-4">
                <div className="rounded-full bg-primary/10 p-2">
                  <Check className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-bold">Ready to Deploy</h3>
                <p className="text-center text-muted-foreground">
                  Pre-configured with best practices and production-ready setup
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
      <footer className="flex w-full shrink-0 flex-col items-center gap-2 border-t px-4 py-6 sm:flex-row md:px-6">
        <p className="text-xs text-muted-foreground">© 2024 Acme Inc. All rights reserved.</p>
        <nav className="flex gap-4 sm:ml-auto sm:gap-6">
          <Link className="text-xs underline-offset-4 hover:underline" href="#">
            Terms of Service
          </Link>
          <Link className="text-xs underline-offset-4 hover:underline" href="#">
            Privacy
          </Link>
        </nav>
      </footer>
    </div>
  );
}
