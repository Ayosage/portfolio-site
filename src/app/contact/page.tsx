import type { Metadata } from 'next'
import { pageMetadata } from '@/lib/site'
import { ContactForm } from './ContactForm'

export const metadata: Metadata = pageMetadata({
  title: 'Contact',
  description: 'Send Brandon Smith a message. Every one gets read.',
  path: '/contact',
})

export default function Contact() {
  return <ContactForm />
}
