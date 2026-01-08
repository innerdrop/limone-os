'use client'

interface ExportButtonProps {
    data: any[]
}

export default function ExportButton({ data }: ExportButtonProps) {
    const handleExport = () => {
        if (!data || data.length === 0) {
            alert('No hay datos para exportar')
            return
        }

        // CSV Headers
        const headers = [
            'Nombre',
            'Email',
            'Sede/Taller',
            'Nivel',
            'Pago',
            'Perfil',
            'DNI',
            'Teléfono',
            'Fecha Inscripción'
        ]

        // CSV Rows
        const rows = data.map(al => [
            `"${al.nombre}"`,
            `"${al.email}"`,
            `"${al.tallerPrincipal}"`,
            `"${al.nivel}"`,
            `"${al.pagado ? 'PAGADO' : 'PENDIENTE'}"`,
            `"${al.estado}"`,
            `"${al.dni}"`,
            `"${al.telefono}"`,
            `"${al.inscripcionFecha}"`
        ])

        const csvContent = [
            headers.join(','),
            ...rows.map(row => row.join(','))
        ].join('\n')

        // Create blob and download
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
        const url = URL.createObjectURL(blob)
        const link = document.createElement('a')
        link.setAttribute('href', url)
        link.setAttribute('download', `alumnos_limone_${new Date().toISOString().split('T')[0]}.csv`)
        link.style.visibility = 'hidden'
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
    }

    return (
        <button onClick={handleExport} className="btn-outline">
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            Exportar CSV
        </button>
    )
}
