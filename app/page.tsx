"use client"

import { RegistrationForm } from "@/components/registration-form"
import { Toaster } from "@/components/ui/toaster"
import { useEffect, useState } from "react"
import { fetchUserCount } from "@/lib/user-count"

export default function HomePage() {
  const [userCount, setUserCount] = useState<number | null>(null);
  useEffect(() => {
    let isMounted = true;
    async function updateCount() {
      const count = await fetchUserCount();
      if (isMounted) setUserCount(count);
    }
    updateCount();
    const interval = setInterval(updateCount, 10000); // update every 10 seconds
    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, []);

  return (
    <main className="min-h-screen bg-[#f8fafc] relative overflow-hidden">
      {/* Animated background elements - slightly more visible */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Large decorative circles */}
        <div className="absolute -top-40 -right-40 w-80 h-80 sm:w-[500px] sm:h-[500px] rounded-full bg-[#32a7de]/10 animate-pulse-slow" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 sm:w-[600px] sm:h-[600px] rounded-full bg-[#e8ba37]/10 animate-pulse-slower" />

        {/* Floating accent circles - more visible */}
        <div className="absolute top-1/4 right-1/4 w-24 h-24 sm:w-32 sm:h-32 rounded-full bg-[#bd222f]/30 animate-float" />
        <div className="absolute bottom-1/4 left-1/3 w-16 h-16 sm:w-24 sm:h-24 rounded-full bg-[#222552]/25 animate-float-delayed" />
        <div className="absolute top-1/2 left-1/5 w-20 h-20 rounded-full bg-[#32a7de]/30 animate-float" />
        <div className="absolute bottom-1/3 right-1/3 w-14 h-14 rounded-full bg-[#e8ba37]/30 animate-float-delayed" />
        <div className="absolute top-2/3 left-1/4 w-10 h-10 rounded-full bg-[#bd222f]/35 animate-float" />
        <div className="absolute top-1/3 right-1/5 w-12 h-12 rounded-full bg-[#32a7de]/35 animate-float-delayed" />

        {/* Decorative dots pattern */}
        <div className="absolute top-20 left-10 w-2 h-2 rounded-full bg-[#32a7de]/30 animate-pulse" />
        <div className="absolute top-32 left-20 w-1.5 h-1.5 rounded-full bg-[#e8ba37]/30 animate-pulse delay-150" />
        <div className="absolute top-16 left-32 w-2 h-2 rounded-full bg-[#bd222f]/30 animate-pulse delay-200" />
        <div className="absolute bottom-20 right-10 w-2 h-2 rounded-full bg-[#222552]/30 animate-pulse" />
        <div className="absolute bottom-32 right-24 w-1.5 h-1.5 rounded-full bg-[#32a7de]/30 animate-pulse delay-100" />
        <div className="absolute bottom-24 right-40 w-2 h-2 rounded-full bg-[#e8ba37]/30 animate-pulse delay-200" />
      </div>

      
      
      {/* Content */}
      <div className="relative z-10 min-h-screen flex items-center justify-center py-8 px-4 sm:py-12 sm:px-6 lg:px-8">
        {/* Two-column layout on desktop, stacked on mobile */}
        <div className="w-full max-w-5xl flex flex-col lg:flex-row lg:items-center lg:gap-16 gap-8">

          {/* LEFT COLUMN — Branding & Header */}
          <div className="flex flex-col items-center text-center lg:items-start lg:text-left lg:flex-1 lg:shrink-0 lg:-mt-70 fixed-height">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#222552]/5 border border-[#222552]/10 mb-5 animate-fade-in-down">
              <span className="w-2 h-2 rounded-full bg-[#32a7de] animate-pulse" />
              <span className="text-xs sm:text-sm font-medium text-[#222552]">
                {userCount === null ? "Loading members..." : `Join ${userCount.toLocaleString()} Happy Members`}
              </span>
            </div>

            <h1 className="text-5xl sm:text-4xl md:text-5xl lg:text-5xl xl:text-6xl font-bold text-[#222552] mb-4 animate-fade-in-down stagger-1 opacity-0 text-balance leading-tight" style={{ animationFillMode: 'forwards' }}>
              Welcome to<br />
              <span className="text-[#32a7de] text-7xl">BIGGS</span>
            </h1> 

            <p className="text-muted-foreground text-sm sm:text-base lg:text-lg animate-fade-in-down stagger-2 opacity-0 text-pretty max-w-sm" style={{ animationFillMode: 'forwards' }}>
              Join our loyalty program and unlock exclusive benefits, birthday rewards, and special member-only offers.
            </p>

            {/* Trust indicators — visible on desktop left column */}
            {/* <div className="hidden lg:flex flex-col gap-4 mt-10 animate-fade-in-up stagger-3 opacity-0" style={{ animationFillMode: 'forwards' }}>
              <div className="flex items-center gap-3 text-muted-foreground">
                <div className="w-9 h-9 rounded-full bg-[#32a7de]/10 flex items-center justify-center shrink-0">
                  <svg className="w-4 h-4 text-[#32a7de]" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                </div>
                <span className="text-sm font-medium text-[#222552]">Free to Join</span>
              </div>
              <div className="flex items-center gap-3 text-muted-foreground">
                <div className="w-9 h-9 rounded-full bg-[#e8ba37]/10 flex items-center justify-center shrink-0">
                  <svg className="w-4 h-4 text-[#e8ba37]" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <span className="text-sm font-medium text-[#222552]">Secure &amp; Private</span>
              </div>
              <div className="flex items-center gap-3 text-muted-foreground">
                <div className="w-9 h-9 rounded-full bg-[#bd222f]/10 flex items-center justify-center shrink-0">
                  <svg className="w-4 h-4 text-[#bd222f]" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                </div>
                <span className="text-sm font-medium text-[#222552]">Instant Rewards</span>
              </div>
            </div> */}
          </div>

          {/* RIGHT COLUMN — Registration Form */}
          <div className="w-full lg:w-auto lg:flex-1 px-2 sm:px-0">
            <RegistrationForm />
          </div>

        </div>
      </div>

      <Toaster />
    </main>
  )
}