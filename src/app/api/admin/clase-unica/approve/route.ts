import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions)
        if (!session || (session.user.role !== 'ADMIN' && session.user.role !== 'DOCENTE')) {
            return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
        }

        const { alumnoId, approve } = await req.json()

        if (!alumnoId) {
            return NextResponse.json({ error: 'Alumno ID es requerido' }, { status: 400 })
        }

        const updatedAlumno = await prisma.alumno.update({
            where: { id: alumnoId },
            data: {
                claseUnicaAprobada: approve
            }
        })

        // Optional: Send a notification to the user
        if (approve) {
            await prisma.notificacion.create({
                data: {
                    usuarioId: updatedAlumno.usuarioId,
                    titulo: '¡Clase Única Aprobada! ✨',
                    mensaje: `Ya podés inscribirte en el Taller Regular. ¡Te esperamos!`,
                    tipo: 'SUCCESS'
                }
            })
        }

        return NextResponse.json({ success: true, alumno: updatedAlumno })
    } catch (error) {
        console.error('Error approving clase unica:', error)
        return NextResponse.json({ error: 'Error al procesar la aprobación' }, { status: 500 })
    }
}
