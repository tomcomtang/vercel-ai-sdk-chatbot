'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Bot, Home } from 'lucide-react'

export default function Navigation() {
  const pathname = usePathname()

  const navItems = [
    {
      name: 'Home',
      href: '/',
      icon: Home,
    },
  ]

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-black/90 backdrop-blur-sm px-6 py-2 shadow-lg">
      <div className="flex items-center justify-between max-w-7xl mx-auto">
        {/* Logo */}
        <div className="flex items-center space-x-3">
          <div className="flex items-center justify-center w-7 h-7 rounded-lg bg-gray-800 border border-gray-700">
            <Bot size={16} className="text-white" />
          </div>
          <div className="flex items-center space-x-3">
            <h1 className="text-xl font-bold text-white">AI Chatbot</h1>
            <p className="text-sm text-gray-600">Powered by Vercel AI SDK</p>
          </div>
        </div>

        {/* Navigation Links */}
        <div className="flex items-center space-x-1">
          {navItems.map((item) => {
            const Icon = item.icon
            const isActive = pathname === item.href
            
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-200 ${
                  isActive
                    ? 'text-white'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                <div className="flex items-center justify-center w-7 h-7 rounded-lg bg-gray-800 border border-gray-700">
                  <Icon size={16} />
                </div>
                <span className="font-medium">{item.name}</span>
              </Link>
            )
          })}
        </div>
      </div>
    </nav>
  )
}
