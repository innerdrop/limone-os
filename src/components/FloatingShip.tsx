'use client'

import { useState, useEffect, useCallback } from 'react'
import { usePathname } from 'next/navigation'
import Image from 'next/image'

// Phase 1: L→R (ship points right, starts small, flies diagonally upward)
// Phase 2: R→L (ship flipped, starts distant/small, grows bigger as it "approaches")
type FlightPhase = 'ltr' | 'rtl'

export default function FloatingShip() {
    const pathname = usePathname()
    const [isFlying, setIsFlying] = useState(false)
    const [phase, setPhase] = useState<FlightPhase>('ltr')
    const [startY, setStartY] = useState(50)
    const [endY, setEndY] = useState(20)

    const startFlight = useCallback(() => {
        setPhase(prev => {
            const nextPhase: FlightPhase = prev === 'ltr' ? 'rtl' : 'ltr'

            if (nextPhase === 'ltr') {
                // Phase 1: Start low, fly upward diagonally L→R
                const sY = Math.floor(Math.random() * 25) + 50
                const offset = Math.floor(Math.random() * 20) + 30
                const eY = Math.max(5, sY - offset)
                setStartY(sY)
                setEndY(eY)
            } else {
                // Phase 2: Start mid-high, descend while approaching R→L
                const sY = Math.floor(Math.random() * 20) + 15
                const offset = Math.floor(Math.random() * 15) + 10
                const eY = sY + offset
                setStartY(sY)
                setEndY(eY)
            }

            return nextPhase
        })

        setIsFlying(true)

        // Duration matches CSS animation (8s for both phases)
        setTimeout(() => {
            setIsFlying(false)
        }, 8000)
    }, [])

    useEffect(() => {
        const initialTimeout = setTimeout(startFlight, 500)
        const interval = setInterval(startFlight, 9000) // 8s flight + 1s pause

        return () => {
            clearTimeout(initialTimeout)
            clearInterval(interval)
        }
    }, [startFlight])

    // Hide on admin pages
    if (pathname.startsWith('/admin') || pathname.startsWith('/login')) {
        return null
    }

    if (!isFlying) return null

    const isRTL = phase === 'rtl'
    const animationName = isRTL ? 'shipFlyRTL' : 'shipFlyLTR'

    return (
        <div
            className="fixed pointer-events-none z-[9999]"
            style={{
                top: `${startY}%`,
                animation: `${animationName} 8s linear forwards`,
                ['--ship-start-y' as string]: `${startY}%`,
                ['--ship-end-y' as string]: `${endY}%`,
            }}
        >
            <div
                className="relative"
                style={{ animation: 'shipBob 1.2s ease-in-out infinite' }}
            >
                {/* Ship image — flipped when going R→L */}
                <div
                    className="relative w-52 h-32 md:w-80 md:h-48 lg:w-[420px] lg:h-[260px]"
                    style={{
                        transform: isRTL ? 'scaleX(-1)' : 'none',
                    }}
                >
                    <Image
                        src="/nave-limon.png"
                        alt="Nave Limoné"
                        fill
                        className="object-contain drop-shadow-2xl"
                        sizes="(max-width: 768px) 208px, (max-width: 1024px) 320px, 420px"
                    />
                </div>

                {/* ===== EXHAUST / PROPULSION SYSTEM ===== */}

                {/* ===== EXHAUST / PROPULSION SYSTEM ===== */}
                <div
                    className={`absolute top-[62%] flex items-center ${isRTL
                        ? '-right-10 md:-right-16 lg:-right-20'
                        : '-left-10 md:-left-16 lg:-left-20'
                        }`}
                    style={{
                        transform: isRTL ? 'translateY(-50%) scaleX(-1)' : 'translateY(-50%)',
                    }}
                >
                    <div className="relative flex items-center justify-center">
                        {/* 1. Large Outer Heat Glow */}
                        <div
                            className="absolute w-20 h-12 md:w-32 md:h-20 lg:w-44 lg:h-28 rounded-full"
                            style={{
                                background: 'radial-gradient(circle, rgba(255,80,0,0.4) 0%, transparent 70%)',
                                filter: 'blur(10px)',
                                animation: 'fireFlicker 0.3s ease-in-out infinite alternate',
                                opacity: 0.6,
                            }}
                        />

                        {/* 2. Main Vibrant Flame Body */}
                        <div
                            className="relative w-14 h-6 md:w-24 md:h-10 lg:w-32 lg:h-14 rounded-full"
                            style={{
                                background: 'radial-gradient(ellipse at right, #FF4500 0%, #FF8C00 40%, transparent 80%)',
                                filter: 'blur(2px)',
                                animation: 'fireFlicker 0.15s ease-in-out infinite alternate',
                                opacity: 0.9,
                            }}
                        />

                        {/* 3. High-Intensity Core */}
                        <div
                            className="absolute right-0 w-8 h-4 md:w-12 md:h-6 lg:w-18 lg:h-8 rounded-full"
                            style={{
                                background: 'radial-gradient(ellipse at right, #FFFFFF 0%, #FFD700 50%, transparent 90%)',
                                filter: 'blur(1px)',
                                animation: 'fireFlicker 0.1s ease-in-out infinite alternate-reverse',
                                opacity: 1,
                            }}
                        />

                        {/* 4. Small Tail Sparks */}
                        {[...Array(3)].map((_, i) => (
                            <div
                                key={`spark-${i}`}
                                className="absolute rounded-full"
                                style={{
                                    width: `${2 + i}px`,
                                    height: `${2 + i}px`,
                                    left: `-${15 + i * 10}px`,
                                    background: '#FFD700',
                                    filter: 'blur(1px)',
                                    opacity: 0.8 - i * 0.2,
                                    animation: `fireFlicker ${0.1 + i * 0.05}s ease-in-out infinite alternate`,
                                }}
                            />
                        ))}
                    </div>
                </div>

                {/* ===== SOFT SMOKE TRAIL ===== */}
                <div
                    className={`absolute top-[62%] flex items-center gap-2 ${isRTL
                        ? '-right-24 md:-right-32 lg:-right-40'
                        : '-left-24 md:-left-32 lg:-left-40'
                        }`}
                    style={{
                        transform: isRTL ? 'translateY(-50%) scaleX(-1)' : 'translateY(-50%)',
                    }}
                >
                    {[...Array(5)].map((_, i) => (
                        <div
                            key={`smoke-${i}`}
                            className="rounded-full bg-white/10"
                            style={{
                                width: `${5 + i * 6}px`,
                                height: `${5 + i * 6}px`,
                                filter: `blur(${4 + i}px)`,
                                animation: `smokePuff ${0.8 + i * 0.2}s ease-out infinite`,
                                animationDelay: `${i * 0.15}s`,
                                opacity: 0.2 - i * 0.03,
                            }}
                        />
                    ))}
                </div>
            </div>
        </div>
    )
}
