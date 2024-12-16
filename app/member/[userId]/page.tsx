'use client'

import { Button } from '@/components/ui/button'
import { Select, SelectContent, WeekSelector } from '@/components/ui/select'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Input } from '@/components/ui/input'
import { getCircleTasks, getUserTasks } from '@/db/queries'
import { useState, useEffect } from 'react'
import { set } from 'date-fns'
import { Task, UserTask } from '@/types/userTaskModel'
import { getCurrentWeek, getMaxFrequenceFromFrequencyType } from '@/components/utils/util'



export default function TaskPage({ params }: { params: { userId: number } }) {
  const [selectedWeek, setSelectedWeek] = useState<[Date, Date]>(getCurrentWeek());
  const [completedTasks, setCompletedTasks] = useState<UserTask[]>([]);
  const [inputValues, setInputValues] = useState(
    completedTasks.reduce((acc: any, task) => {
      acc[task.taskId] = task.quantityCompleted || 0;
      return acc;
    }, {})
  );

  const handleWeekChange = async (startDate: Date, endDate: Date) => {
    setSelectedWeek([startDate, endDate]);
  }

  const handleSubmit = () => {
    // Handle submitting changes
    console.log('Submitting changes...')
  }

  const handleInputChange = (taskId: any, value: any) => {
    setInputValues((prevValues: any) => ({
      ...prevValues,
      [taskId]: Number(value),
    }));
  };

  const fetchCompletedTasks = async () => {
    const userTasksData = getUserTasks(
      params.userId,
      selectedWeek[0],
      selectedWeek[1],
    );
    const [tasksData] = await Promise.all([
      userTasksData,
    ]);
    console.log(tasksData);
    setCompletedTasks(tasksData);
  }

  useEffect(() => {
    setInputValues(
      completedTasks.reduce((acc: any, task) => {
        acc[task.taskId] = task.quantityCompleted || 0;
        return acc;
      }, {})
    );
  }, [completedTasks]);


  useEffect(() => {
    fetchCompletedTasks();
  }, [selectedWeek]);

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
          <WeekSelector className="w-full" onWeekChange={handleWeekChange}
          initialWeek={selectedWeek[0]}
          />
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
            {completedTasks?.map((task) => (
              <TableRow key={task.taskId}>
                <TableCell>{task.name}</TableCell>
                <TableCell>
                  <div className="flex items-center">
                    <Input 
                      type="number" 
                      value={inputValues[task.taskId]}
                      onChange={(e) => handleInputChange(task.taskId, e.target.value)}
                      className='w-[60px] mr-2'
                      min={0}
                      max={getMaxFrequenceFromFrequencyType(task.frequencyType)}
                    />
                    <span> /{getMaxFrequenceFromFrequencyType(task.frequencyType)}</span>
                  </div>
                </TableCell>
                <TableCell>{task.updatedAt || 'Not completed'}</TableCell>
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

