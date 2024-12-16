'use client'

import { useEffect, useState } from 'react'
import { ChevronDown } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, WeekSelector } from '@/components/ui/select'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Input } from '@/components/ui/input'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible'
import { getCurrentWeek, getMaxFrequenceFromFrequencyType } from '@/components/utils/util'
import { useRouter } from 'next/navigation'
import { getCircleMembers, getUserTasks } from '@/db/queries'
import { Member } from '@/types/memberModel'
import { UserTask } from '@/types/userTaskModel'
import { set } from 'date-fns'

export default function NaqibPage({ params }: { params: { circleId: number } }) {
  const router = useRouter();
  const [selectedWeek, setSelectedWeek] = useState<[Date, Date]>(getCurrentWeek());
  const [members, setMembers] = useState<Member[]>([]);
  const [tasks, setTasks] = useState<{ [userId: number]: UserTask[] }>({});

  const handleWeekChange = (startDate: Date, endDate: Date) => {
    setSelectedWeek([startDate, endDate])
  }

  const handleGoBack = () => {
    router.back(); // Navigates to the previous page
  };
  
  const getMembersData = async() => {
    const membersData = getCircleMembers(params.circleId);
    const [membersList] = await Promise.all([
      membersData,
    ]);
    setMembers(membersList);
  }

  const fetchCompletedTasks = async (userId: number) => {
    const userTasksData = getUserTasks(
      userId,
      selectedWeek[0],
      selectedWeek[1],
    );
    const [tasksData] = await Promise.all([
      userTasksData,
    ]);
    setTasks(prevTasks => ({
      ...prevTasks,
      [userId]: tasksData,
    }));
  }

  const onOpenCollapsible = (isOpen: boolean, userId: number) => {
    if(isOpen){
      fetchCompletedTasks(userId);
    }
  }

  const refreshCompletedTasks = () => {
    for (const userId in tasks) {
      fetchCompletedTasks(parseInt(userId));
    }
  }

  useEffect(() => {
    refreshCompletedTasks();
  }, [selectedWeek]);

  useEffect(() => {
    getMembersData();
  }, []);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6 text-center">Ahlan Wasahlan, Naqib Usrah</h1>
      
      <div className="flex justify-between items-center mb-6">
        <Button variant="outline" className='w-[100px] mr-4' onClick={handleGoBack}>
          Back
        </Button>
        <Select>
          <WeekSelector className="w-full" onWeekChange={handleWeekChange}
          initialWeek={selectedWeek[0]}
          />
        </Select>
        {/* <Button variant="outline">Edit</Button> */}
      </div>
      
      <div className="space-y-4">
        {members.map((member) => (
          <Collapsible key={member.userId} onOpenChange={(isOpened) => {onOpenCollapsible(isOpened, member.userId)}}>
            <CollapsibleTrigger className="flex items-center w-full p-4 bg-gray-100 rounded-lg hover:bg-gray-200">
              <ChevronDown className="h-5 w-5 mr-2" />
              <span className="font-medium">{member.username}</span>
            </CollapsibleTrigger>
            <CollapsibleContent className="pt-4 px-4">
              <div className="border rounded-lg overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Task Name</TableHead>
                      <TableHead>Progress</TableHead>
                      <TableHead>Last Updated</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {tasks[member.userId] !== undefined && tasks[member.userId].map((task) => (
                      <TableRow key={task.taskId}>
                        <TableCell>{task.name}</TableCell>
                        <TableCell>
                          <div className="flex items-center">
                            <span className='mr-1'>{task.quantityCompleted ?? 0}</span>
                            <span> / {getMaxFrequenceFromFrequencyType(task.frequencyType)}</span>
                          </div>
                        </TableCell>
                        <TableCell>{task.updatedAt}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CollapsibleContent>
          </Collapsible>
        ))}
      </div>
    </div>
  )
}

