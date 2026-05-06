"use client"

import { useCallback, useRef, useState, useEffect } from "react"
import { useTheme } from "next-themes"
import { Moon, Sun } from "lucide-react"
import { flushSync } from "react-dom"

import { cn } from "@/lib/utils"

interface AnimatedThemeTogglerProps extends React.ComponentPropsWithoutRef<"button"> {
  duration?: number
}

export const AnimatedThemeToggler = ({
  className,
  duration,
  ...props
}: AnimatedThemeTogglerProps) => {
  const { resolvedTheme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const buttonRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    setMounted(true)
  }, [])

  const isDark = resolvedTheme === "dark"

  const toggleTheme = useCallback(() => {
    const button = buttonRef.current
    if (!button) return

    // Respect reduced-motion preference — skip animation entirely
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches

    const newTheme = isDark ? "light" : "dark"

    const applyTheme = () => {
      document.documentElement.classList.toggle("dark", newTheme === "dark")
      setTheme(newTheme)
    }

    // Instant swap for reduced-motion users or unsupported browsers
    if (prefersReducedMotion || typeof document.startViewTransition !== "function") {
      applyTheme()
      return
    }

    const { top, left, width, height } = button.getBoundingClientRect()
    const x = left + width / 2
    const y = top + height / 2
    const viewportWidth = window.visualViewport?.width ?? window.innerWidth
    const viewportHeight = window.visualViewport?.height ?? window.innerHeight
    const maxRadius = Math.hypot(
      Math.max(x, viewportWidth - x),
      Math.max(y, viewportHeight - y)
    )

    // Adaptive duration — slightly faster on mobile
    const isMobile = viewportWidth < 768
    const animDuration = duration ?? (isMobile ? 450 : 500)

    const transition = document.startViewTransition(() => {
      flushSync(applyTheme)
    })

    const ready = transition?.ready
    if (ready && typeof ready.then === "function") {
      ready.then(() => {
        document.documentElement.animate(
          {
            clipPath: [
              `circle(0px at ${x}px ${y}px)`,
              `circle(${maxRadius}px at ${x}px ${y}px)`,
            ],
          },
          {
            duration: animDuration,
            // Gentle ease-out for a smooth, cinematic reveal
            easing: "cubic-bezier(0.25, 0.46, 0.45, 0.94)",
            fill: "forwards",
            pseudoElement: "::view-transition-new(root)",
          }
        )
      })
    }
  }, [isDark, duration, setTheme])

  if (!mounted) return <button className={cn(className)} {...props}><Moon /><span className="sr-only">Toggle theme</span></button>

  return (
    <button
      type="button"
      ref={buttonRef}
      onClick={toggleTheme}
      className={cn(
        // Micro-animation on the icon: rotate + scale on state change
        "transition-transform duration-200 active:scale-90",
        className
      )}
      {...props}
    >
      {isDark ? (
        <Sun className="transition-all duration-300 rotate-0 scale-100 animate-in spin-in-90 zoom-in-75" />
      ) : (
        <Moon className="transition-all duration-300 rotate-0 scale-100 animate-in spin-in-[-90deg] zoom-in-75" />
      )}
      <span className="sr-only">Toggle theme</span>
    </button>
  )
}
