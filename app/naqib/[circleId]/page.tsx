'use client'

import { useState } from 'react'
import { ChevronDown } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, WeekSelector } from '@/components/ui/select'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Input } from '@/components/ui/input'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible'

export default function NaqibPage() {
  const [selectedWeek, setSelectedWeek] = useState<[Date, Date] | null>(null)
  const [members, setMembers] = useState([
    {
      id: 1,
      name: 'Ahmad',
      tasks: [
        { id: 1, name: 'Solat Subuh', progress: 3, total: 7, lastUpdated: '2023-07-10' },
        { id: 2, name: 'Solat Zuhr', progress: 5, total: 7, lastUpdated: '2023-07-11' },
        { id: 3, name: 'Solat Asr', progress: 4, total: 7, lastUpdated: '2023-07-12' },
      ]
    },
    {
      id: 2,
      name: 'Fatimah',
      tasks: [
        { id: 1, name: 'Solat Subuh', progress: 6, total: 7, lastUpdated: '2023-07-10' },
        { id: 2, name: 'Solat Zuhr', progress: 7, total: 7, lastUpdated: '2023-07-11' },
        { id: 3, name: 'Solat Asr', progress: 5, total: 7, lastUpdated: '2023-07-12' },
      ]
    },
    // Add more members as needed
  ])

  const handleWeekChange = (startDate: Date, endDate: Date) => {
    setSelectedWeek([startDate, endDate])
    // Here you would typically fetch tasks for the new week
  }

  const handleProgressChange = (memberId: number, taskId: number, newProgress: number) => {
    setMembers(prevMembers => prevMembers.map(member => {
      if (member.id === memberId) {
        return {
          ...member,
          tasks: member.tasks.map(task => {
            if (task.id === taskId) {
              return { ...task, progress: newProgress }
            }
            return task
          })
        }
      }
      return member
    }))
  }

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-2xl font-bold mb-6 text-center">Ahlan Wasahlan, Naqib Usrah</h1>
      
      <div className="mb-6">
        <Select>
          <WeekSelector className="w-[200px]" onWeekChange={handleWeekChange} />
          <SelectContent>
            {/* You can add custom content here if needed */}
          </SelectContent>
        </Select>
      </div>
      
      <div className="space-y-4">
        {members.map((member) => (
          <Collapsible key={member.id}>
            <CollapsibleTrigger className="flex items-center w-full p-4 bg-gray-100 rounded-lg hover:bg-gray-200">
              <ChevronDown className="h-5 w-5 mr-2" />
              <span className="font-medium">{member.name}</span>
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
                    {member.tasks.map((task) => (
                      <TableRow key={task.id}>
                        <TableCell>{task.name}</TableCell>
                        <TableCell>
                          <div className="flex items-center">
                            <Input 
                              type="number" 
                              value={task.progress} 
                              onChange={(e) => handleProgressChange(member.id, task.id, parseInt(e.target.value, 10))}
                              className="w-16 mr-2" 
                              min={0} 
                              max={task.total}
                            />
                            <span>/ {task.total}</span>
                          </div>
                        </TableCell>
                        <TableCell>{task.lastUpdated}</TableCell>
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

