import { LinkTypeAuth, type LinkType } from '@/types/links'

export const linksNavigate: LinkType[] = [
  {
    title: 'Labor',
    subLinks: [
      { title: 'Semillero artístico', href: '/labor/semillero-artistico' },
      { title: 'Semillero musical', href: '/labor/semillero-musical' },
      { title: 'Yoga y ubound', href: '/labor/yoga-y-ubound' },
      { title: 'Arpillera creativa', href: '/labor/arpillera-creativa' },
      { title: 'Crianza respetuosa', href: '/labor/crianza-respetuosa' }
    ]
  },
  {
    title: 'Causa',
    subLinks: [
      {
        title: 'Biblioteca libre Nazarena Jerónimo',
        href: '/causa/biblioteca-libre-nazarena-jeronimo'
      },
      {
        title: 'Salidas pedagógicas',
        href: '/causa/salidas-pedagogocas'
      },
      { title: 'Visitas artísticas', href: '/causa/visitas-artisticas' },
      {
        title: 'Acopio de materiales artísticos',
        href: '/causa/acopio-materiales-artisticos'
      },
      { title: 'Recolección de tapitas', href: '/causa/recoleccion-tapitas' },
      { title: 'Sala de ensayos', href: '/causa/sala-ensayo' }
    ]
  },
  {
    title: 'Súmate',
    subLinks: [
      { title: 'Voluntarixs', href: '/sumate/voluntarixs' },
      { title: 'Tienda solidaria', href: '/sumate/tienda-solidaria' },
      { title: 'Dona', href: '/sumate/dona' }
    ]
  }
]
export const linksNavigateAuth: LinkTypeAuth[] = [
  {
    title: 'Administrar usuarios',
    url: '/auth/administrar-usuarios',
    auth: ['sup_admin', 'admin']
  },
  {
    title: 'Administrar clases',
    url: '/auth/administrar-clases',
    auth: ['sup_admin', 'admin']
  },
  { title: 'Volver al inicio', url: '/', auth: ['user'] }
]
export const publicRoutes = [
  'inicio-sesion',
  'crear-cuenta',
  'causa/acopio-materiales-artisticos',
  'causa/biblioteca-libre-nazarena-jeronimo',
  'causa/recoleccion-tapitas',
  'causa/sala-ensayo',
  'causa/salidas-pedagogocas',
  'causa/visitas-artisticas',
  'labor/arpillera-creativa',
  'labor/crianza-respetuosa',
  'labor/semillero-artistico',
  'labor/semillero-musical',
  'labor/yoga-y-ubound',
  'quienes-somos',
  'sumate/dona',
  'sumate/tienda-solidaria',
  'sumate/voluntarixs'
]
export const authRoutes = ['administrar-usuarios', 'administrar-clases']
