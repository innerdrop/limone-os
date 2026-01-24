import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { writeFile, mkdir } from 'fs/promises'
import { existsSync } from 'fs'
import path from 'path'
import { randomUUID } from 'crypto'

export async function POST(request: NextRequest) {
    try {
        // Verify admin session
        const session = await getServerSession(authOptions)
        if (!session?.user || session.user.role !== 'ADMIN') {
            return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
        }

        const formData = await request.formData()
        const file = formData.get('file') as File | null

        if (!file) {
            return NextResponse.json({ error: 'No se recibió archivo' }, { status: 400 })
        }

        // Validate file type
        const allowedTypes = ['image/jpeg', 'image/png', 'image/webp']
        if (!allowedTypes.includes(file.type)) {
            return NextResponse.json(
                { error: 'Formato no válido. Usa JPG, PNG o WebP.' },
                { status: 400 }
            )
        }

        // Validate file size (2MB max)
        const maxSize = 2 * 1024 * 1024
        if (file.size > maxSize) {
            return NextResponse.json(
                { error: 'La imagen es demasiado grande. Máximo 2MB.' },
                { status: 400 }
            )
        }

        // Create uploads/slider directory if it doesn't exist
        const uploadDir = path.join(process.cwd(), 'public', 'uploads', 'slider')
        if (!existsSync(uploadDir)) {
            await mkdir(uploadDir, { recursive: true })
        }

        // Generate unique filename
        const extension = file.name.split('.').pop() || 'jpg'
        const filename = `${randomUUID()}.${extension}`
        const filepath = path.join(uploadDir, filename)

        // Convert file to buffer and save
        const bytes = await file.arrayBuffer()
        const buffer = Buffer.from(bytes)
        await writeFile(filepath, buffer)

        // Return the public URL
        const url = `/uploads/slider/${filename}`

        return NextResponse.json({ url, filename })
    } catch (error) {
        console.error('Error uploading slider image:', error)
        return NextResponse.json(
            { error: 'Error al subir la imagen' },
            { status: 500 }
        )
    }
}
