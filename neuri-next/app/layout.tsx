import type {Metadata} from 'next';
import './globals.css';
export const metadata:Metadata={title:'Neuri · Un día a la vez',description:'Diario familiar de epilepsia. Un espacio para observar, registrar y acompañar.'};
export default function RootLayout({children}:{children:React.ReactNode}){return <html lang="es"><body>{children}</body></html>}
