import type { Metadata } from 'next'
import { ContactForm } from './ContactForm'

export const metadata: Metadata = {
  title: 'Contact',
  description: 'Send a ping to Brandon Smith.',
}

export default function Contact() {
  return <ContactForm />
}
