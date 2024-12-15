'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { IconButton } from '@/components/ui/icon-button'

interface Member {
  userId: number;
  username: string;
  role: string;
}

export default function SelectMember({ params }: { params: { circleId: string } }) {
  const [members, setMembers] = useState<Member[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const router = useRouter()

  useEffect(() => {
    const fetchMembers = async () => {
      try {
        const response = await fetch(`/api/circles/${params.circleId}/members`)
        if (!response.ok) {
          throw new Error('Failed to fetch members')
        }
        const data = await response.json()
        setMembers(data)
      } catch (err) {
        setError('Failed to load members. Please try again.')
      } finally {
        setLoading(false)
      }
    }

    fetchMembers()
  }, [params.circleId])

  const handleMemberSelect = (userId: number) => {
    router.push(`/task/${userId}`)
  }

  if (loading) {
    return <div>Loading...</div>
  }

  if (error) {
    return <div>{error}</div>
  }

  return (
    <div className="min-h-screen bg-[#F9F9F9] p-6 flex flex-col items-center">
      <h1 className="text-3xl font-bold mb-8">Siapa anda?</h1>
      
      <div className="w-full max-w-md space-y-4">
        <Button 
          variant="outline" 
          className="w-full justify-center font-semibold shadow-md underline"
        >
          Saya adalah naqib
        </Button>

        {members.map((member) => (
          <IconButton
            key={member.userId}
            icon={<ChevronRight className="h-5 w-5" />}
            className="w-full justify-between text-lg font-medium"
            onClick={() => handleMemberSelect(member.userId)}
          >
            {member.username}
          </IconButton>
        ))}

        <Button 
          className="w-full bg-[#333333] hover:bg-[#444444] text-white"
        >
          Tambah Ahli
        </Button>
      </div>
    </div>
  )
}

