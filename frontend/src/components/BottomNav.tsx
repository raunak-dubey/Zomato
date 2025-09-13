"use client"

import { motion } from "framer-motion"
import {
  Clapperboard,
  User,
  MessageCircle,
  Search,
  Bookmark 
} from "lucide-react"
import Link from "next/link"
// import { useState } from "react"
import { usePathname } from "next/navigation"

const navItems = [
  { name: "Messages", icon: MessageCircle, href: "#" },
  { name: "Explore", icon: Search, href: "#" },
  { name: "Home", icon: Clapperboard, href: "/" },
  { name: "Saved", icon: Bookmark, href: "/saved" },
  { name: "Profile", icon: User, href: "#" },
]

export default function BottomNav() {
  const pathname = usePathname()

  return (
    <nav className="fixed bottom-0 left-1/2 z-50 w-full max-w-md -translate-x-1/2 bg-gray-900/80  border border-gray-900/90 backdrop-blur-md shadow-lg">
      <ul className="flex items-center justify-around py-1">
        {navItems.map((item) => {
          const Icon = item.icon
          const isActive = pathname === item.href

          return (
            <li key={item.name} className="flex flex-col items-center">
              <Link
                href={item.href}
                className="relative flex flex-col items-center text-gray-400 hover:text-indigo-400"
              >
                <motion.div
                  animate={{
                    y: isActive ? -3 : 0,
                    scale: isActive ? 1.1 : 1,
                  }}
                  transition={{ type: "spring", stiffness: 300, damping: 15 }}
                  className="flex h-10 w-10 items-center justify-center rounded-full"
                >
                  <Icon
                    size={22}
                    className={isActive ? "text-indigo-400" : ""}
                  />
                </motion.div>

                {/* Active indicator text */}
                <motion.span
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: isActive ? 1 : 0, y: isActive ? 0 : 4 }}
                  transition={{ duration: 0.2 }}
                  className="mt-1 text-xs text-indigo-400"
                >
                </motion.span>
              </Link>
            </li>
          )
        })}
      </ul>
    </nav>
  ) 
}
