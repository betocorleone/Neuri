import type {Metadata} from 'next';
import './globals.css';
export const metadata:Metadata={title:'Neuri · Un día a la vez',description:'Un diario para observar, registrar y acompañar. Un espacio tranquilo para guardar sensaciones, cambios y detalles del día a día.'};
export default function RootLayout({children}:{children:React.ReactNode}){return <html lang="es"><body>{children}</body></html>}
