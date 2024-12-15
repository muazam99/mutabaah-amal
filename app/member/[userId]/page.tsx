'use client'

import { Button } from '@/components/ui/button'
import { Select, SelectContent, WeekSelector } from '@/components/ui/select'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Input } from '@/components/ui/input'
import { getUserTasks } from '@/db/queries'
import { useState, useEffect } from 'react'
import { set } from 'date-fns'
import { UserTask } from '@/types/userTaskModel'
import { getMaxFrequenceFromFrequencyType } from '@/components/utils/util'



export default function TaskPage({ params }: { params: { userId: number } }) {
  const [selectedWeek, setSelectedWeek] = useState<[Date, Date] | null>(null)
  const [tasks, setTasks] = useState<UserTask[]>([]);

 

  const handleWeekChange = (startDate: Date, endDate: Date) => {
    // setSelectedWeek([startDate, endDate])
    // Here you would typically fetch tasks for the new week
  }

  const handleSubmit = () => {
    // Handle submitting changes
    console.log('Submitting changes...')
  }

  const fetchTasks = async () => {
    const userTasksData = getUserTasks(params.userId);
    const [tasksData] = await Promise.all([
      userTasksData,
    ]);
    console.log(tasksData);
    setTasks(tasksData);
  }

  useEffect(() => {
    fetchTasks();
  }, [])

  // if (loading) {
  //   return <div>Loading...</div>
  // }

  // if (error) {
  //   return <div>{error}</div>
  // }

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-2xl font-bold mb-6 text-center">Ahlan Wasahlan, User</h1>
      
      <div className="flex justify-between items-center mb-6">
        <Select>
          <WeekSelector className="w-[150px]" onWeekChange={handleWeekChange} />
          <SelectContent>
            {/* You can add custom content here if needed */}
          </SelectContent>
        </Select>
        {/* <Button variant="outline">Edit</Button> */}
      </div>
      
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
            {tasks?.map((task) => (
              <TableRow key={task.taskId}>
                <TableCell>{task.name}</TableCell>
                <TableCell>
                  <div className="flex items-center">
                    <Input 
                      type="number" 
                      defaultValue={task.quantityCompleted || 0}
                      className='w-[60px] mr-2'
                      min={0}
                      max={getMaxFrequenceFromFrequencyType(task.frequencyType)}
                    />
                    <span> /{getMaxFrequenceFromFrequencyType(task.frequencyType)}</span>
                  </div>
                </TableCell>
                <TableCell>{task.completedDate || 'Not completed'}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <div className="mt-4 flex justify-end">
        <Button onClick={handleSubmit}>Submit Changes</Button>
      </div>
    </div>
  )
}

