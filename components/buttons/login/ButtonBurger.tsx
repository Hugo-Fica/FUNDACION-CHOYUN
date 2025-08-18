'use client'

import { useState, useRef, useEffect } from 'react'
import { motion } from 'framer-motion'
import { linksNavigate } from '@/helpers/links-navigate'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { Accordion, AccordionContent, AccordionTrigger } from '../../ui/accordion'
import { AccordionItem } from '@radix-ui/react-accordion'
import { useUserAuthStore } from '@/store/userAuthStore'
import { linksNavigateAuth } from '../../../helpers/links-navigate'
import useLogin from '@/hooks/useLogin'
import { toast } from 'sonner'
import { ProfileEdit } from '@/components/user/ProfileEdit'

const routes = [
  { title: 'Crear cuenta', link: '/crear-cuenta' },
  { title: 'Iniciar sesión', link: '/inicio-sesion' }
]
export const ButtonBurger = () => {
  const [isOpenProfile, setIsOpenProfile] = useState(false)
  const { user, setUser, setValidated, user_id, role_id } = useUserAuthStore((state) => state)
  const { logoutUser } = useLogin()
  const path = usePathname()
  const [isOpen, setIsOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)
  const router = useRouter()

  const toggleMenu = () => {
    setIsOpen(!isOpen)
  }
  const logout = () => {
    setIsOpen(!isOpen)
    setUser(null)
    setValidated(0, '', '')
    logoutUser(user_id, role_id)
    router.push('/')
    toast.success('Sesión cerrada')
  }
  // Detectar clics fuera del menú
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
    <>
      <div
        ref={menuRef}
        className='relative'>
        {/* Burger Button */}
        <button
          onClick={toggleMenu}
          className='z-50 relative flex items-center justify-center w-10 h-10 focus:outline-none'>
          <motion.div
            initial='closed'
            animate={isOpen ? 'open' : 'closed'}
            className='flex flex-col justify-between w-6 h-6'>
            {/* Top Line */}
            <motion.span
              className='block h-0.5 bg-black'
              variants={{
                closed: { rotate: 0, y: 0 },
                open: { rotate: 45, y: 11 }
              }}
              transition={{ duration: 0.3 }}
            />
            {/* Middle Line */}
            <motion.span
              className='block h-0.5 bg-black'
              variants={{
                closed: { opacity: 1 },
                open: { opacity: 0 }
              }}
              transition={{ duration: 0.3 }}
            />
            {/* Bottom Line */}
            <motion.span
              className='block h-0.5 bg-black'
              variants={{
                closed: { rotate: 0, y: 0 },
                open: { rotate: -45, y: -11 }
              }}
              transition={{ duration: 0.3 }}
            />
          </motion.div>
        </button>

        {/* Mobile Menu */}
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={
            isOpen ? { maxHeight: '600px', opacity: 1, height: 'auto' } : { height: 0, opacity: 0 }
          }
          transition={{ duration: 0.5 }}
          className='absolute top-[51px] right-0 w-[200px] text-xs bg-white text-black overflow-hidden shadow-xl'>
          <Accordion
            type='single'
            collapsible>
            <AccordionItem value='user'>
              <AccordionTrigger className='pl-[85px]'>
                <span>
                  <svg
                    xmlns='http://www.w3.org/2000/svg'
                    fill='none'
                    viewBox='0 0 24 24'
                    strokeWidth={1.5}
                    stroke='currentColor'
                    className='size-6'>
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      d='M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z'
                    />
                  </svg>
                </span>
              </AccordionTrigger>
              {user !== null ? (
                <>
                  {/* <AccordionContent
                    className='bg-red-500 hover:bg-red-400 text-white hover:text-white pl-[15px] pt-[15px]'
                    onClick={() => setIsOpenProfile(!isOpenProfile)}>
                    {user.names}
                  </AccordionContent> */}
                  {linksNavigateAuth
                    .filter((l) => l.auth.includes(user.role))
                    .map((link) => (
                      <AccordionContent
                        key={link.title}
                        className={`${path === link.url && 'bg-gray-300 text-black'} p-[15px]`}>
                        <Link
                          href={link.url}
                          onClick={toggleMenu}>
                          {link.title}
                        </Link>
                      </AccordionContent>
                    ))}
                  <AccordionContent
                    className='bg-red-500 hover:bg-red-400 text-white hover:text-white pl-[15px] pt-[15px]'
                    onClick={logout}>
                    Cerrar sesión
                  </AccordionContent>
                </>
              ) : (
                routes.map((r) => (
                  <AccordionContent
                    key={r.link}
                    className={`${path === r.link && 'bg-gray-300 text-black'} p-[15px]`}>
                    <Link
                      href={r.link}
                      onClick={toggleMenu}>
                      {r.title}
                    </Link>
                  </AccordionContent>
                ))
              )}
            </AccordionItem>
            {linksNavigate.map((links) => (
              <AccordionItem
                value={links.title}
                key={links.title}>
                <AccordionTrigger className='pl-[20px]'>{links.title}</AccordionTrigger>
                {links.subLinks.map((sl) => (
                  <AccordionContent
                    key={sl.title}
                    className={`${path === sl.href && 'bg-gray-300 text-black'} p-[15px]`}>
                    <Link
                      href={sl.href}
                      onClick={toggleMenu}>
                      {sl.title}
                    </Link>
                  </AccordionContent>
                ))}
              </AccordionItem>
            ))}
          </Accordion>
        </motion.div>
      </div>
      {isOpenProfile && (
        <ProfileEdit
          open={isOpenProfile}
          setOpen={setIsOpenProfile}
        />
      )}
    </>
  )
}
