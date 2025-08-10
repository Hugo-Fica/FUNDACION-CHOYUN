import {
  Body,
  Container,
  Head,
  Hr,
  Html,
  Img,
  Preview,
  Section,
  Tailwind,
  Text
} from '@react-email/components'

type Props = {
  nombreClase: string
  contenido: string
  profesor: string
  urlContenido?: string
}

export const EmailsClass = ({ nombreClase, contenido, profesor, urlContenido }: Props) => {
  const img = `${
    process.env.NODE_ENV === 'production'
      ? 'https://www.fundacionchoyun.cl'
      : 'http://localhost:3000'
  }/logo_choyun-1.png`
  return (
    <Html>
      <Head />
      <Preview>Información de la clase {nombreClase}</Preview>
      <Tailwind>
        <Body className='bg-white font-sans'>
          <Container className='mx-auto p-4 max-w-600'>
            <Section className='bg-white border border-black rounded-lg p-8 shadow-sm'>
              <Img
                src={img}
                alt='logo-choyun'
                width={100}
                height={100}
              />
              <Text>{contenido}</Text>
              {urlContenido && (
                <Text>
                  📄 El contenido de la clase se encuentra en <strong>{urlContenido}</strong>.
                </Text>
              )}
              <Text>
                Correo enviado por <strong>{profesor}</strong>.
              </Text>
              <Hr />
              <Text style={{ fontSize: '12px', color: '#999' }}>
                Este mensaje es automático. No respondas a este correo.
              </Text>
            </Section>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  )
}
