'use client'
import { useState, useEffect, useRef } from 'react'
import { PersonIcon, SearchIcon } from '@primer/octicons-react'
import Image from 'next/image'
import Link from 'next/link'
import { FaFacebook, FaInstagram, FaYoutube, FaBars } from 'react-icons/fa'

type LinkType = {
  path: string
  text: string
}

const links: LinkType[] = [
  { path: '/somos', text: 'Somos' },
  { path: '/presencial', text: 'Presencial' },
  { path: '/en-linea', text: 'Conecta' },
  { path: '/prensa', text: 'Prensa' },
  { path: '/', text: 'Publicaciones' },
  { path: '/', text: 'Quiero ayudar' }
]

export const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement | null>(null) // Usado para referenciar el menú

  // Función para manejar el cierre del menú cuando se selecciona un enlace
  const handleLinkClick = () => {
    setIsOpen(false)
  }

  // Cierra el menú si se hace clic fuera de él
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [menuRef])

  return (
    <nav className='bg-white px-2 sm:px-4 lg:px-12 fixed top-0 w-full z-10 shadow-md'>
      <div className='flex items-center justify-between h-16'>
        <Link
          href={'/'}
          className='flex items-center'
          legacyBehavior>
          <a>
            <Image
              className='w-auto pb-[10px]'
              src='/assets/logo_choyun-1.png'
              alt='logo-choyun'
              width={100}
              height={100}
            />
          </a>
        </Link>
        <div className='flex space-x-2 lg:hidden'>
          <button
            onClick={() => setIsOpen(!isOpen)}
            className='text-black hover:text-gray-700 focus:outline-none focus:text-gray-700'>
            <FaBars size={24} />
          </button>
        </div>
        <div className={`hidden lg:flex lg:items-center lg:space-x-4`}>
          {links.map((link: LinkType) => (
            <Link
              href={link.path}
              key={link.text}
              legacyBehavior>
              <a className='text-black hover:text-gray-700 text-sm lg:text-base'>{link.text}</a>
            </Link>
          ))}
          <div className='flex items-center'>
            <SearchIcon
              size={20}
              className='fill-black mx-2'
            />
          </div>
          <Link
            href={'/inicio-sesion'}
            className='flex items-center'
            legacyBehavior>
            <a>
              <PersonIcon
                size={20}
                className='fill-black'
              />
            </a>
          </Link>
          <div className='flex space-x-2 ml-2'>
            <Link
              href='https://web.facebook.com/fundacionchoyun?locale=es_LA'
              aria-label='Facebook'
              legacyBehavior>
              <a>
                <FaFacebook
                  size={20}
                  className='text-black'
                />
              </a>
            </Link>
            <Link
              href='https://www.youtube.com/@fundacionchoyun6663'
              aria-label='YouTube'
              legacyBehavior>
              <a>
                <FaYoutube
                  size={20}
                  className='text-black'
                />
              </a>
            </Link>
            <Link
              href='https://www.instagram.com/fundacion.choyun/?hl=es'
              aria-label='Instagram'
              legacyBehavior>
              <a>
                <FaInstagram
                  size={20}
                  className='text-black'
                />
              </a>
            </Link>
          </div>
        </div>
      </div>
      {isOpen && (
        <div
          ref={menuRef}
          className='lg:hidden'>
          <div className='flex flex-col space-y-1 px-2 pt-2 pb-3'>
            {links.map((link: LinkType) => (
              <Link
                href={link.path}
                key={link.text}
                legacyBehavior>
                <a
                  onClick={handleLinkClick}
                  className='text-black hover:text-gray-700 text-sm'>
                  {link.text}
                </a>
              </Link>
            ))}
            <div className='flex items-center justify-between mt-2'>
              <SearchIcon
                size={20}
                className='fill-black mx-2'
              />
              <Link
                href={'/inicio-sesion'}
                className='flex items-center'
                legacyBehavior>
                <a onClick={handleLinkClick}>
                  <PersonIcon
                    size={20}
                    className='fill-black'
                  />
                </a>
              </Link>
            </div>
            <div className='flex space-x-2 mt-4'>
              <Link
                href='https://web.facebook.com/fundacionchoyun?locale=es_LA'
                aria-label='Facebook'
                legacyBehavior>
                <a onClick={handleLinkClick}>
                  <FaFacebook
                    size={20}
                    className='text-black'
                  />
                </a>
              </Link>
              <Link
                href='https://www.youtube.com/@fundacionchoyun6663'
                aria-label='YouTube'
                legacyBehavior>
                <a onClick={handleLinkClick}>
                  <FaYoutube
                    size={20}
                    className='text-black'
                  />
                </a>
              </Link>
              <Link
                href='https://www.instagram.com/fundacion.choyun/?hl=es'
                aria-label='Instagram'
                legacyBehavior>
                <a onClick={handleLinkClick}>
                  <FaInstagram
                    size={20}
                    className='text-black'
                  />
                </a>
              </Link>
            </div>
          </div>
        </div>
      )}
    </nav>
  )
}
