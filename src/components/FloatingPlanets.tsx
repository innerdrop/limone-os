'use client'

import Image from 'next/image'
import { usePathname } from 'next/navigation'

// Planet configurations with responsive sizes: [mobile, desktop]
const planets = [
    {
        src: '/planetas/planeta-anillos.png',
        alt: 'Planeta con anillos',
        side: 'left' as const,
        top: '5%',
        mobileSize: 265,
        desktopSize: 600,
        duration: 7,
        delay: 0,
    },
    {
        src: '/planetas/planeta-papel.png',
        alt: 'Planeta de papel',
        side: 'right' as const,
        top: '12%',
        mobileSize: 215,
        desktopSize: 720,
        duration: 5,
        delay: 1.5,
    },
    {
        src: '/planetas/planeta-lapices.png',
        alt: 'Planeta de lápices',
        side: 'left' as const,
        top: '55%',
        mobileSize: 280,
        desktopSize: 450,
        duration: 8,
        delay: 0.8,
    },
    {
        src: '/planetas/planeta-pintura.png',
        alt: 'Planeta de pintura',
        side: 'right' as const,
        top: '62%',
        mobileSize: 240,
        desktopSize: 580,
        duration: 6,
        delay: 2,
    },
]

export default function FloatingPlanets() {
    const pathname = usePathname()

    // Hide planets on admin pages
    if (pathname.startsWith('/admin') || pathname.startsWith('/login')) {
        return null
    }

    return (
        <div className="fixed inset-0 pointer-events-none z-[1000] overflow-hidden">
            {planets.map((planet, i) => (
                <div
                    key={i}
                    className={`absolute ${planet.side === 'left'
                        ? 'left-[-20%] lg:left-[-5%]'
                        : 'right-[-20%] lg:right-[-5%]'
                        }`}
                    style={{
                        top: planet.top,
                        animation: `planetFloat ${planet.duration}s ease-in-out infinite`,
                        animationDelay: `${planet.delay}s`,
                    }}
                >
                    {/* Slow rotation */}
                    <div
                        style={{
                            animation: `planetSpin ${planet.duration * 4}s linear infinite`,
                            animationDelay: `${planet.delay}s`,
                        }}
                    >
                        {/* Mobile view */}
                        <div
                            className="relative lg:hidden"
                            style={{ width: planet.mobileSize, height: planet.mobileSize }}
                        >
                            <Image
                                src={planet.src}
                                alt={planet.alt}
                                fill
                                className="object-contain"
                                style={{ filter: 'drop-shadow(0 12px 32px rgba(0,0,0,0.4))' }}
                                sizes={`${planet.mobileSize}px`}
                            />
                        </div>
                        {/* Desktop view */}
                        <div
                            className="relative hidden lg:block"
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
            ))}
        </div>
    )
}
