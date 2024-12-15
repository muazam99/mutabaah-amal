'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

export default function Home() {
  const [code, setCode] = useState('')
  const [error, setError] = useState('')
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    try {
      const response = await fetch('/api/circles/validate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ code }),
      })

      const data = await response.json()

      if (data.valid) {
        router.push(`/select-member/${data.circleId}`)
      } else {
        setError('Invalid circle code. Please try again.')
      }
    } catch (error) {
      setError('An error occurred. Please try again.')
    }
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-primary to-primary-light flex flex-col items-center justify-center p-4 relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -left-16 -top-16 w-64 h-64 bg-white opacity-10 rounded-full"></div>
        <div className="absolute right-32 top-32 w-48 h-48 bg-white opacity-10 rounded-full"></div>
        <div className="absolute -right-16 -bottom-16 w-80 h-80 bg-white opacity-10 rounded-full"></div>
      </div>

      <h1 className="text-4xl md:text-6xl font-bold text-white mb-8 relative z-10">MUTABAAH AMAL</h1>
      
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md relative z-10">
        <Input 
          type="text" 
          placeholder="Circle PIN" 
          className="mb-4" 
          value={code}
          onChange={(e) => setCode(e.target.value)}
        />
        <Button type="submit" className="w-full bg-[#333333] hover:bg-[#444444]">Enter</Button>
        {error && <p className="mt-2 text-red-500">{error}</p>}
      </form>
    </main>
  )
}

