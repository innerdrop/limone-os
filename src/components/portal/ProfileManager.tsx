'use client'

import { useSession } from 'next-auth/react'
import ProfileCompletionModal from '../ProfileCompletionModal'
import PasswordChangeModal from './PasswordChangeModal'

export default function ProfileManager() {
    const { data: session, status } = useSession()

    if (status === 'loading') return null

    const needsPasswordChange = session?.user?.debeCambiarPassword === true

    return (
        <>
            {/* Show password change modal if user must change password */}
            <PasswordChangeModal isOpen={needsPasswordChange} />
        </>
    )
}

