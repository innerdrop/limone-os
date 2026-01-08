import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { writeFile } from 'fs/promises'
import { join } from 'path'
import { v4 as uuidv4 } from 'uuid'

export async function POST(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions)

        // Check if user is admin
        if (!session?.user?.id) {
            return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
        }

        const user = await prisma.usuario.findUnique({
            where: { id: session.user.id }
        })

        if (user?.rol !== 'ADMIN') {
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

        // Handle file storage
        const bytes = await file.arrayBuffer()
        const buffer = Buffer.from(bytes)

        const fileExtension = file.name.split('.').pop()
        const fileName = `${uuidv4()}.${fileExtension}`
        const uploadDir = join(process.cwd(), 'public', 'uploads', 'obras')
        const filePath = join(uploadDir, fileName)

        await writeFile(filePath, buffer)

        const imagenUrl = `/uploads/obras/${fileName}`

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
    } catch (error: any) {
        console.error('Error al subir obra:', error)
        return NextResponse.json({ error: 'Error al procesar la subida' }, { status: 500 })
    }
}
