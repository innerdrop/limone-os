import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import cloudinary from '@/lib/cloudinary'

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

        // Validate file size (5MB max for Cloudinary is fine, but keeping some limit)
        const maxSize = 5 * 1024 * 1024
        if (file.size > maxSize) {
            return NextResponse.json(
                { error: 'La imagen es demasiado grande. Máximo 5MB.' },
                { status: 400 }
            )
        }

        // Convert file to buffer
        const bytes = await file.arrayBuffer()
        const buffer = Buffer.from(bytes)

        if (!process.env.CLOUDINARY_CLOUD_NAME) {
            console.error('CRITICAL: Cloudinary environment variables are missing in production!');
            return NextResponse.json({ error: 'Falta configuración de Cloudinary' }, { status: 500 })
        }

        // Upload to Cloudinary
        const uploadResponse = await new Promise((resolve, reject) => {
            cloudinary.uploader.upload_stream(
                {
                    folder: 'slider',
                    resource_type: 'image'
                },
                (error, result) => {
                    if (error) reject(error)
                    else resolve(result)
                }
            ).end(buffer)
        }) as any

        return NextResponse.json({
            url: uploadResponse.secure_url,
            public_id: uploadResponse.public_id
        })
    } catch (error) {
        console.error('Error uploading slider image to Cloudinary:', error)
        return NextResponse.json(
            { error: 'Error al subir la imagen' },
            { status: 500 }
        )
    }
}
