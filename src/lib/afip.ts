import Afip from '@afipsdk/afip.js';

/**
 * Servicio para interactuar con AFIP (ARCA)
 * Versión mejorada para Next.js
 */
export class AfipService {
    private afip: any;

    constructor() {
        this.afip = new Afip({
            CUIT: process.env.AFIP_CUIT || 20111111112,
            cert: process.env.AFIP_CERT_NAME || 'cert.crt',
            key: process.env.AFIP_KEY_NAME || 'key.key',
            production: process.env.NODE_ENV === 'production' && process.env.AFIP_PRODUCTION === 'true',
        });
    }

    /**
     * Obtiene el estado de los servidores de AFIP
     */
    async getServerStatus() {
        try {
            return await this.afip.ElectronicBilling.getServerStatus();
        } catch (error) {
            console.error('Error AFIP Status:', error);
            throw error;
        }
    }

    /**
     * Obtiene el siguiente número de comprobante para un punto de venta y tipo
     */
    async getNextVoucherNumber(puntoVenta: number, tipoComprobante: number) {
        try {
            const lastVoucher = await this.afip.ElectronicBilling.getLastVoucher(puntoVenta, tipoComprobante);
            return lastVoucher + 1;
        } catch (error) {
            console.error('Error AFIP Last Voucher:', error);
            throw error;
        }
    }

    /**
     * Crea una Factura B (Monotributista a Consumidor Final)
     */
    async createFacturaB({
        dni,
        monto,
        puntoVenta = 1,
        concepto = 2, // 2: Servicios (Educación)
        fechaDesde,
        fechaHasta,
    }: {
        dni: string;
        monto: number;
        puntoVenta?: number;
        concepto?: number;
        fechaDesde?: string;
        fechaHasta?: string;
    }) {
        try {
            const nextNumber = await this.getNextVoucherNumber(puntoVenta, 6);

            const today = new Date().toISOString().split('T')[0].replace(/-/g, '');
            const fDesde = fechaDesde || today;
            const fHasta = fechaHasta || today;

            const data = {
                'CantReg': 1,
                'PtoVta': puntoVenta,
                'CbteTipo': 6,
                'Concepto': concepto,
                'DocTipo': 96,
                'DocNro': parseInt(dni),
                'CbteDesde': nextNumber,
                'CbteHasta': nextNumber,
                'CbteFch': today,
                'ImpTotal': monto,
                'ImpTotConc': 0,
                'ImpNeto': monto,
                'ImpOpEx': 0,
                'ImpIVA': 0,
                'ImpTrib': 0,
                'MonId': 'PES',
                'MonCotiz': 1,
            };

            if (concepto > 1) {
                (data as any).FchServDesde = fDesde;
                (data as any).FchServHasta = fHasta;
                (data as any).FchVtoPago = today;
            }

            const res = await this.afip.ElectronicBilling.createVoucher(data);

            return {
                cae: res.CAE,
                caeVencimiento: res.CAEVto,
                nroComprobante: nextNumber,
                puntoVenta: puntoVenta,
                tipoFactura: 'B',
            };
        } catch (error: any) {
            console.error('Error AFIP Create Voucher:', error);
            throw new Error(error.message || 'Error al autorizar comprobante ante AFIP');
        }
    }
}

export const afipService = new AfipService();
