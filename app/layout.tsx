import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { NavigationMenuPage } from '@/components/navbar/NavigationMenuPage'
import { Footer } from '@/components/footer/Footer'
import { ClientProviders } from '@/components/layout/ClientProviders'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Fundación Choyün - Arte y Cultura en Chile',
  description:
    'Fundación Choyün promueve la cultura y las artes en Chile, ofreciendo talleres, actividades holísticas, y más. Conéctate con nosotros para explorar y aprender.',
  keywords: [
    'Fundación Choyün',
    'arte',
    'cultura',
    'talleres',
    'Chile',
    'musicoterapia',
    'arteterapia',
    'El Salvador',
    'Diego de Almagro',
    'revitalización cultural',
    'educación artística'
  ],
  robots: 'index, follow',
  openGraph: {
    title: 'Fundación Choyün - Arte y Cultura en Chile',
    description:
      'Explora la Fundación Choyün, donde promovemos la cultura y las artes en Chile a través de talleres, actividades, y más.',
    url: 'https://www.fundacionchoyun.cl',
    images: [
      {
        url: 'https://drive.google.com/uc?export=view&id=1E0gFkqUW2mDrGoZ0GCxOv9njBR6mNXc6',
        width: 800,
        height: 600,
        alt: 'Fundación Choyün - Arte y Cultura en Chile'
      }
    ]
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Fundación Choyün - Arte y Cultura en Chile',
    description:
      'Únete a la Fundación Choyün para aprender y explorar la cultura y las artes en Chile.',
    images: ['https://drive.google.com/uc?export=view&id=1E0gFkqUW2mDrGoZ0GCxOv9njBR6mNXc6']
  },
  alternates: {
    canonical: 'https://www.fundacionchoyun.cl'
  },
  icons: ''
}
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang='es'>
      <body className={inter.className}>
        <div className='flex flex-col min-h-screen'>
          <ClientProviders>
            <div className='h-16 md:h-16'>
              <NavigationMenuPage />
            </div>
            <main className='flex-grow flex justify-center items-center'>{children}</main>
            <Footer />
          </ClientProviders>
        </div>
      </body>
    </html>
  )
}
