'use client'

import { useState } from 'react'
import ProfileCompletionModal from '@/components/ProfileCompletionModal'
import { useRouter } from 'next/navigation'

interface ProfileManagerProps {
    perfilCompleto: boolean
    userId: string
}

export default function ProfileManager({ perfilCompleto, userId }: ProfileManagerProps) {
    const [isOpen, setIsOpen] = useState(!perfilCompleto)
    const router = useRouter()

    const handleComplete = () => {
        setIsOpen(false)
        router.refresh()
    }

    // We only show the modal if the profile is not complete
    if (perfilCompleto) return null

    return (
        <ProfileCompletionModal
            isOpen={isOpen}
            onClose={() => { }} // Cannot be closed until complete
            onComplete={handleComplete}
        />
    )
}
