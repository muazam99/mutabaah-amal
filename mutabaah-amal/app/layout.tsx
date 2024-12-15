import './globals.css'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Mutabaah Amal',
  description: 'A shared todo app for circles',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
      </head>
      <body className="font-poppins">{children}</body>
    </html>
  )
}

