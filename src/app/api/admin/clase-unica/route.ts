import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

export async function GET() {
    try {
        const session = await getServerSession(authOptions)
        if (!session || (session.user.role !== 'ADMIN' && session.user.role !== 'DOCENTE')) {
            return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
        }

        // Get all alumnos who have a 'Clase Única' inscription
        const alumnos = await prisma.alumno.findMany({
            where: {
                inscripciones: {
                    some: {
                        OR: [
                            { fase: 'Clase Única' },
                            { taller: { nombre: { contains: 'Clase Única', mode: 'insensitive' } } }
                        ]
                    }
                }
            },
            include: {
                usuario: true,
                inscripciones: {
                    where: {
                        OR: [
                            { fase: 'Clase Única' },
                            { taller: { nombre: { contains: 'Clase Única', mode: 'insensitive' } } }
                        ]
                    },
                    orderBy: {
                        fechaInscripcion: 'desc'
                    },
                    take: 1
                }
            },
            orderBy: {
                creadoEn: 'desc'
            }
        })

        const formattedAlumnos = alumnos.map(al => ({
            id: al.id,
            nombre: al.nombre,
            apellido: al.apellido,
            dni: al.dni,
            email: al.usuario.email,
            claseUnicaAprobada: al.claseUnicaAprobada,
            inscripcionId: al.inscripciones[0]?.id,
            fechaInscripcion: al.inscripciones[0]?.fechaInscripcion,
            estadoInscripcion: al.inscripciones[0]?.estado,
            pagado: al.inscripciones[0]?.pagado
        }))

        return NextResponse.json(formattedAlumnos)
    } catch (error) {
        console.error('Error fetching clase unica alumnos:', error)
        return NextResponse.json({ error: 'Error al cargar alumnos' }, { status: 500 })
    }
}
