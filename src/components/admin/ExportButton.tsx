'use client'

interface ExportButtonProps {
    data: any[]
    filename?: string
    headers?: string[]
}

export default function ExportButton({ data, filename, headers }: ExportButtonProps) {
    const handleExport = () => {
        if (!data || data.length === 0) {
            alert('No hay datos para exportar')
            return
        }

        let csvHeaders = headers
        let csvRows: any[][]

        if (!csvHeaders) {
            // Default (Legacy) behavior for AlumnosPage where data is Array of Objects
            csvHeaders = [
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
            csvRows = data.map(al => [
                `"${al.nombre || ''}"`,
                `"${al.email || ''}"`,
                `"${al.tallerPrincipal || ''}"`,
                `"${al.nivel || ''}"`,
                `"${al.pagado ? 'PAGADO' : 'PENDIENTE'}"`,
                `"${al.estado || ''}"`,
                `"${al.dni || ''}"`,
                `"${al.telefono || ''}"`,
                `"${al.inscripcionFecha || ''}"`
            ])
        } else {
            // New behavior: data is already an Array of Arrays (Rows)
            csvRows = data.map(row => row.map((val: any) => `"${val ?? ''}"`))
        }

        const csvContent = [
            csvHeaders.join(','),
            ...csvRows.map(row => row.join(','))
        ].join('\n')

        // Create blob and download
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
        const url = URL.createObjectURL(blob)
        const link = document.createElement('a')
        link.setAttribute('href', url)
        link.setAttribute('download', `${filename || 'export'}_${new Date().toISOString().split('T')[0]}.csv`)
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
