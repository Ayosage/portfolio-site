import type { Metadata } from 'next'
import { pageMetadata } from '@/lib/site'
import { ContactForm } from './ContactForm'

export const metadata: Metadata = pageMetadata({
  title: 'Contact',
  description: 'Send a ping to Brandon Smith.',
  path: '/contact',
})

export default function Contact() {
  return <ContactForm />
}
