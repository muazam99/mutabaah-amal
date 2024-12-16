import { ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { IconButton } from '@/components/ui/icon-button'
import { getCircleMembers } from '@/db/queries'
import Link from 'next/link';


export default async function SelectMember(props: { params: Promise<{ circleId: number }> }) {
  const params = await props.params;
  const circleMembersData = getCircleMembers(params.circleId);

  const [membersData] = await Promise.all([
    circleMembersData,
  ]);

  return (
    <div className="min-h-screen bg-[#F9F9F9] p-6 flex flex-col items-center">
      <h1 className="text-3xl font-bold mb-8">Siapa anda?</h1>
      
      <div className="w-full max-w-md space-y-4">
        <Button 
          variant="outline" 
          className="w-full justify-center font-semibold shadow-md underline"
          asChild
        >
          <Link href={`/naqib/${params.circleId}`} className='w-full'>
            Saya adalah naqib
          </Link>
        </Button>

        {membersData.map((member) => (
            <IconButton
                key={member.userId}
                className="w-full justify-between text-lg font-medium"
                asChild
              >
                <Link href={`/member/${member.userId}`} className='w-full text-start'>
                  {member.username}
                </Link>
                <ChevronRight className="h-5 w-5" />
            </IconButton>
        ))}

        <Button 
          className="w-full bg-[#333333] hover:bg-[#444444] text-white"
          asChild
        >
          <Link href="/">Keluar</Link> 
        </Button>
      </div>
    </div>
  )
}

