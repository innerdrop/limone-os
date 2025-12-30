'use client'

import { useSession } from 'next-auth/react'
import ProfileCompletionModal from '../ProfileCompletionModal'
import PasswordChangeModal from './PasswordChangeModal'

export default function ProfileManager() {
    const { data: session, status, update } = useSession()

    if (status === 'loading') return null

    const needsProfileUpdate = session?.user?.perfilCompleto === false
    const needsPasswordChange = session?.user?.debeCambiarPassword === true

    const handleProfileComplete = async () => {
        await update({ perfilCompleto: true })
    }

    return (
        <>
            {/* Show profile update first if needed */}
            <ProfileCompletionModal
                isOpen={needsProfileUpdate}
                onClose={() => { }}
                onComplete={handleProfileComplete}
            />

            {/* Show password change only if profile is complete but password is still temporary */}
            {!needsProfileUpdate && <PasswordChangeModal isOpen={needsPasswordChange} />}
        </>
    )
}

