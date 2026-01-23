import { CartProvider } from '@/components/tienda/CartProvider'
import CartDrawer from '@/components/tienda/CartDrawer'

export default function TiendaLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <CartProvider>
            {children}
            <CartDrawer />
        </CartProvider>
    )
}
