'use client'

import { ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { IconButton } from '@/components/ui/icon-button'

const dummyMembers = [
  { id: 1, name: 'Ahmad' },
  { id: 2, name: 'Fatimah' },
  { id: 3, name: 'Omar' },
  { id: 4, name: 'Aisha' },
  { id: 5, name: 'Hassan' },
]

export default function SelectMember() {
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

        {dummyMembers.map((member) => (
          <IconButton
            key={member.id}
            icon={<ChevronRight className="h-5 w-5" />}
            className="w-full justify-between text-lg font-medium"
          >
            {member.name}
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

