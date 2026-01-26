import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import cloudinary from '@/lib/cloudinary'

export async function POST(request: Request) {
    try {
        const session = await getServerSession(authOptions)
        if (!session || (session.user.role !== 'ADMIN' && session.user.role !== 'DOCENTE')) {
            return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
        }

        const formData = await request.formData()
        const file = formData.get('file') as File

        if (!file) {
            return NextResponse.json({ error: 'No se subió ningún archivo' }, { status: 400 })
        }

        const bytes = await file.arrayBuffer()
        const buffer = Buffer.from(bytes)

        if (!process.env.CLOUDINARY_CLOUD_NAME) {
            console.error('CRITICAL: Cloudinary environment variables are missing in production!');
            return NextResponse.json({ error: 'Configuración de Cloudinary no encontrada' }, { status: 500 })
        }

        // Upload to Cloudinary
        const uploadResponse = await new Promise((resolve, reject) => {
            cloudinary.uploader.upload_stream(
                {
                    folder: 'productos',
                    resource_type: 'auto'
                },
                (error, result) => {
                    if (error) reject(error)
                    else resolve(result)
                }
            ).end(buffer)
        }) as any

        return NextResponse.json({ url: uploadResponse.secure_url })
    } catch (error) {
        console.error('Error uploading file to Cloudinary:', error)
        return NextResponse.json({ error: 'Error al subir imagen' }, { status: 500 })
    }
}
