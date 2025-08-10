import {
  Body,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Img,
  Preview,
  Section,
  Tailwind,
  Text
} from '@react-email/components'

type Props = {
  nameClass: string
  startDate: string
  teacherName?: string
}

export const WelcomClass = ({ nameClass, teacherName, startDate }: Props) => {
  const img = `${
    process.env.NODE_ENV === 'production'
      ? 'https://www.fundacionchoyun.cl'
      : 'http://localhost:3000'
  }/logo_choyun-1.png`
  return (
    <Html>
      <Head />
      <Preview>¡Bienvenido a tu clase! 🎓</Preview>
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
              <Heading>¡Hola! 👋</Heading>
              <Text>
                Te damos la bienvenida al curso <strong>{nameClass}</strong>.
              </Text>
              <Text>
                📅 La clase comenzará el día <strong>{startDate}</strong>.
              </Text>
              <Text>
                👨‍🏫 Tu profesor/a será <strong>{teacherName}</strong>.
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
