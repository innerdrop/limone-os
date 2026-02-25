'use client'

import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { useState, useEffect } from 'react'

// Planet configurations with responsive sizes and positions
// Mobile positions are carefully placed to avoid text overlap
const planets = [
    {
        src: '/planetas/planeta-anillos.png',
        alt: 'Planeta con anillos',
        side: 'left' as const,
        // Desktop: large, partially off-screen left
        desktopTop: '5%',
        desktopSize: 600,
        // Mobile: top-left, peeking from the edge
        mobileTop: '0%',
        mobileLeft: '-30%',
        mobileSize: 380,
        duration: 5,
        delay: 0,
    },
    {
        src: '/planetas/planeta-papel.png',
        alt: 'Planeta de papel',
        side: 'right' as const,
        desktopTop: '12%',
        desktopSize: 720,
        // Mobile: top-right, peeking from the edge
        mobileTop: '10%',
        mobileRight: '-8%',
        mobileSize: 260,
        duration: 4,
        delay: 1.5,
    },
    {
        src: '/planetas/planeta-lapices.png',
        alt: 'Planeta de lápices',
        side: 'left' as const,
        desktopTop: '55%',
        desktopSize: 450,
        // Mobile: lower-left, visible at the edge
        mobileTop: '75%',
        mobileLeft: '-18%',
        mobileSize: 290,
        duration: 8,
        delay: 0.8,
    },
    {
        src: '/planetas/planeta-pintura.png',
        alt: 'Planeta de pintura',
        side: 'right' as const,
        desktopTop: '62%',
        desktopSize: 580,
        // Mobile: lower-right, visible at the edge
        mobileTop: '80%',
        mobileRight: '-12%',
        mobileSize: 180,
        duration: 6,
        delay: 2,
    },
]

export default function FloatingPlanets() {
    const pathname = usePathname()
    const [scrollY, setScrollY] = useState(0)
    const [isMobile, setIsMobile] = useState(false)

    useEffect(() => {
        const checkMobile = () => setIsMobile(window.innerWidth < 1024)
        checkMobile()
        window.addEventListener('resize', checkMobile)

        const handleScroll = () => setScrollY(window.scrollY)
        window.addEventListener('scroll', handleScroll, { passive: true })

        return () => {
            window.removeEventListener('resize', checkMobile)
            window.removeEventListener('scroll', handleScroll)
        }
    }, [])

    // Only show planets on home page
    if (pathname !== '/') {
        return null
    }

    // On mobile, fade out planets gradually as user scrolls past the hero
    const heroHeight = typeof window !== 'undefined' ? window.innerHeight : 800
    // Start fading after 20% scroll, complete fade at 120% of hero height
    const fadeStart = heroHeight * 0.2
    const fadeEnd = heroHeight * 1.2
    const rawProgress = isMobile ? Math.max(0, Math.min(1, (scrollY - fadeStart) / (fadeEnd - fadeStart))) : 0
    // EaseOut curve for natural, subtle fade
    const mobileOpacity = 1 - (rawProgress * rawProgress)

    return (
        <div
            className="fixed inset-0 pointer-events-none z-[1000] overflow-hidden"
            style={{
                // On mobile, the planets stay fixed but fade out 
                opacity: mobileOpacity,
                transition: 'opacity 0.5s ease-out',
            }}
        >
            {planets.map((planet, i) => (
                <div key={i}>
                    {/* Desktop view — unchanged behavior */}
                    <div
                        className={`absolute hidden lg:block ${planet.side === 'left'
                            ? 'left-[-5%]'
                            : 'right-[-5%]'
                            }`}
                        style={{
                            top: planet.desktopTop,
                            animation: `planetFloat ${planet.duration}s ease-in-out infinite`,
                            animationDelay: `${planet.delay}s`,
                        }}
                    >
                        <div
                            style={{
                                animation: `planetSpin ${planet.duration * 4}s linear infinite`,
                                animationDelay: `${planet.delay}s`,
                            }}
                        >
                            <div
                                className="relative"
                                style={{ width: planet.desktopSize, height: planet.desktopSize }}
                            >
                                <Image
                                    src={planet.src}
                                    alt={planet.alt}
                                    fill
                                    className="object-contain"
                                    style={{ filter: 'drop-shadow(0 12px 48px rgba(0,0,0,0.45))' }}
                                    sizes={`${planet.desktopSize}px`}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Mobile view — repositioned to avoid text */}
                    <div
                        className="absolute lg:hidden"
                        style={{
                            top: planet.mobileTop,
                            ...(planet.side === 'left'
                                ? { left: planet.mobileLeft || '-25%' }
                                : { right: planet.mobileRight || '-20%' }),
                            animation: `planetFloat ${planet.duration}s ease-in-out infinite`,
                            animationDelay: `${planet.delay}s`,
                        }}
                    >
                        <div
                            style={{
                                animation: `planetSpin ${planet.duration * 4}s linear infinite`,
                                animationDelay: `${planet.delay}s`,
                            }}
                        >
                            <div
                                className="relative"
                                style={{ width: planet.mobileSize, height: planet.mobileSize }}
                            >
                                <Image
                                    src={planet.src}
                                    alt={planet.alt}
                                    fill
                                    className="object-contain"
                                    style={{ filter: 'drop-shadow(0 8px 20px rgba(0,0,0,0.35))' }}
                                    sizes={`${planet.mobileSize}px`}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    )
}
