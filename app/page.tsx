'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ShoppingBag, Gamepad2, GraduationCap, Building2, ArrowRight, Star, Truck, ShieldCheck } from 'lucide-react';

// UI Kit
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';

export default function Home() {
  const services = [
    {
      title: "The Megastore",
      desc: "Iraq's premium destination for electronics, books, and lifestyle.",
      icon: <ShoppingBag className="w-8 h-8 text-brand-pink" />,
      href: "/megastore",
      color: "border-brand-pink"
    },
    {
      title: "IDEA Plus",
      desc: "Rent PS5 games, books, and movies. Delivered to your door.",
      icon: <Gamepad2 className="w-8 h-8 text-brand-yellow" />,
      href: "/plus",
      color: "border-brand-yellow"
    },
    {
      title: "The Academy",
      desc: "Master new skills with cohort-based courses in Baghdad.",
      icon: <GraduationCap className="w-8 h-8 text-blue-500" />,
      href: "/academy", 
      color: "border-blue-500"
    },
    {
      title: "The IDEA Suite",
      desc: "Corporate solutions for procurement and recruitment.",
      icon: <Building2 className="w-8 h-8 text-brand-dark" />,
      href: "/suite",
      color: "border-brand-dark"
    }
  ];

  return (
    <div className="min-h-screen bg-slate-50 pt-20">
      
      {/* 1. HERO SECTION */}
      <section className="relative px-4 py-20 lg:py-32 overflow-hidden bg-white">
        <div className="max-w-7xl mx-auto relative z-10 text-center">
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="inline-block py-1 px-3 rounded-full bg-brand-pink/10 text-brand-pink text-sm font-bold tracking-wide mb-6">
              THE DIGITAL ECOSYSTEM FOR IRAQ
            </span>
            <h1 className="text-5xl md:text-7xl font-black tracking-tight text-brand-dark mb-6">
              Innovation for <br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-pink to-brand-yellow">
                Every Aspect of Life.
              </span>
            </h1>
            <p className="text-lg md:text-xl text-slate-500 mb-10 max-w-2xl mx-auto leading-relaxed">
              Shop, learn, play, and grow with The IDEA. One account, infinite possibilities. 
              Serving Baghdad and beyond.
            </p>
            
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link href="/register">
                <Button className="h-14 px-8 text-lg w-full sm:w-auto">
                  Get Started <ArrowRight className="ml-2" size={20} />
                </Button>
              </Link>
              <Link href="/about">
                <Button variant="outline" className="h-14 px-8 text-lg w-full sm:w-auto">
                  Our Story
                </Button>
              </Link>
            </div>
          </motion.div>

        </div>
        
        {/* Abstract Background Blobs */}
        <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-brand-yellow/5 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-brand-pink/5 rounded-full blur-3xl translate-x-1/2 translate-y-1/2"></div>
      </section>

      {/* 2. SERVICES GRID */}
      <section className="py-24 px-4 max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-brand-dark">Explore Our Universe</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {services.map((service, i) => (
            <Link key={i} href={service.href}>
              <Card className={`p-8 h-full hover:-translate-y-2 transition-transform duration-300 border-t-4 ${service.color}`}>
                <div className="mb-6">{service.icon}</div>
                <h3 className="text-xl font-bold text-brand-dark mb-3">{service.title}</h3>
                <p className="text-slate-500 text-sm leading-relaxed">{service.desc}</p>
              </Card>
            </Link>
          ))}
        </div>
      </section>

      {/* 3. WHY CHOOSE US */}
      <section className="bg-brand-dark text-white py-24 px-4 rounded-3xl mx-4 lg:mx-8 mb-20 relative overflow-hidden">
        <div className="max-w-7xl mx-auto relative z-10 flex flex-col md:flex-row items-center justify-between gap-12">
          
          <div className="md:w-1/2">
            <h2 className="text-3xl md:text-5xl font-bold mb-6">Built for the <br/><span className="text-brand-yellow">Modern Iraqi.</span></h2>
            <p className="text-slate-400 text-lg mb-8">
              We understand the local challenges. That is why we built a platform that prioritizes trust, speed, and quality above all else.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-white/10 rounded-lg"><Truck className="text-brand-pink"/></div>
                <span className="font-medium">Same-Day Delivery</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-white/10 rounded-lg"><ShieldCheck className="text-brand-yellow"/></div>
                <span className="font-medium">Genuine Products</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-white/10 rounded-lg"><Star className="text-brand-pink"/></div>
                <span className="font-medium">Premium Support</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-white/10 rounded-lg"><Gamepad2 className="text-brand-yellow"/></div>
                <span className="font-medium">Exclusive Content</span>
              </div>
            </div>
          </div>

          <div className="md:w-1/2 relative h-[400px] w-full bg-slate-800 rounded-2xl overflow-hidden border border-white/10 shadow-2xl">
             {/* Placeholder for a cool lifestyle image */}
             <div className="absolute inset-0 bg-gradient-to-tr from-brand-pink/20 to-brand-yellow/20"></div>
             <div className="absolute inset-0 flex items-center justify-center">
                <Image src="/logo.svg" alt="IDEA Logo" width={100} height={100} className="opacity-50" />
             </div>
          </div>

        </div>
      </section>

      {/* 4. CTA */}
      <section className="py-20 text-center px-4">
        <h2 className="text-3xl font-bold text-brand-dark mb-6">Join 10,000+ Members Today</h2>
        <Link href="/register">
          <Button className="h-14 px-10 text-lg shadow-xl shadow-brand-pink/20">
            Create Free Account
          </Button>
        </Link>
      </section>

    </div>
  );
}
