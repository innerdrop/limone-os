'use client'

import { useEffect, useRef } from 'react'
import { usePathname } from 'next/navigation'

export default function AnalyticsTracker() {
    const pathname = usePathname()
    const lastTrackedPath = useRef<string | null>(null)

    useEffect(() => {
        // Only track if pathname changed and it's not a dev/admin route
        if (pathname === lastTrackedPath.current) return
        if (pathname.startsWith('/admin') || pathname.startsWith('/api')) return

        const trackVisit = async () => {
            try {
                let referrer = document.referrer
                let source = 'direct'

                if (referrer) {
                    const url = new URL(referrer)
                    if (url.hostname.includes('google')) {
                        source = 'google'
                    } else if (url.hostname.includes('facebook') || url.hostname.includes('fb.me')) {
                        source = 'facebook'
                    } else if (url.hostname.includes('instagram')) {
                        source = 'instagram'
                    } else if (!url.hostname.includes(window.location.hostname)) {
                        source = 'other'
                    }
                }

                await fetch('/api/analytics/track', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        referente: source,
                        path: pathname
                    })
                })

                lastTrackedPath.current = pathname
            } catch (error) {
                // Silently fail as analytics shouldn't break the UI
            }
        }

        trackVisit()
    }, [pathname])

    return null
}
