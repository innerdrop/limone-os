import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import cloudinary from '@/lib/cloudinary'

export async function POST(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions)

        // Check if user is admin or docente
        if (!session?.user?.id) {
            return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
        }

        const user = await prisma.usuario.findUnique({
            where: { id: session.user.id }
        })

        if (user?.rol !== 'ADMIN' && user?.rol !== 'DOCENTE') {
            return NextResponse.json({ error: 'No autorizado' }, { status: 403 })
        }

        const formData = await request.formData()
        const file = formData.get('file') as File
        const alumnoId = formData.get('alumnoId') as string
        const titulo = formData.get('titulo') as string
        const descripcion = formData.get('descripcion') as string
        const tecnica = formData.get('tecnica') as string

        if (!file || !alumnoId) {
            return NextResponse.json({ error: 'Archivo y alumno requeridos' }, { status: 400 })
        }

        // Validate student exists
        const alumno = await prisma.alumno.findUnique({
            where: { id: alumnoId }
        })

        if (!alumno) {
            return NextResponse.json({ error: 'Alumno no encontrado' }, { status: 404 })
        }

        // Handle file storage with Cloudinary
        const bytes = await file.arrayBuffer()
        const buffer = Buffer.from(bytes)

        if (!process.env.CLOUDINARY_CLOUD_NAME) {
            console.error('CRITICAL: Cloudinary environment variables are missing in production!');
            return NextResponse.json({ error: 'Error de configuración en el servidor (Cloudinary)' }, { status: 500 })
        }

        const uploadResponse = await new Promise((resolve, reject) => {
            cloudinary.uploader.upload_stream(
                {
                    folder: 'obras',
                    resource_type: 'image'
                },
                (error, result) => {
                    if (error) reject(error)
                    else resolve(result)
                }
            ).end(buffer)
        }) as any

        const imagenUrl = uploadResponse.secure_url

        // Create Obra record
        const obra = await prisma.obra.create({
            data: {
                alumnoId,
                imagenUrl,
                titulo,
                descripcion,
                tecnica,
                fechaCreacion: new Date()
            }
        })

        return NextResponse.json({ success: true, obra })
    } catch (error) {
        console.error('Error al subir obra a Cloudinary:', error)
        return NextResponse.json({ error: 'Error al procesar la subida' }, { status: 500 })
    }
}
