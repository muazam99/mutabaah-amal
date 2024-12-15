'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, WeekSelector } from '@/components/ui/select'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Input } from '@/components/ui/input'

interface Task {
  taskId: number;
  name: string;
  frequencyType: string;
  frequencyCount: number;
  description: string | null;
  quantityCompleted: number | null;
  completedDate: string | null;
}

export default function TaskPage({ params }: { params: { userId: string } }) {
  const [selectedWeek, setSelectedWeek] = useState<[Date, Date] | null>(null)
  const [tasks, setTasks] = useState<Task[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await fetch(`/api/users/${params.userId}/tasks`)
        if (!response.ok) {
          throw new Error('Failed to fetch tasks')
        }
        const data = await response.json()
        setTasks(data)
      } catch (err) {
        setError('Failed to load tasks. Please try again.')
      } finally {
        setLoading(false)
      }
    }

    fetchTasks()
  }, [params.userId])

  const handleWeekChange = (startDate: Date, endDate: Date) => {
    setSelectedWeek([startDate, endDate])
    // Here you would typically fetch tasks for the new week
  }

  const handleSubmit = () => {
    // Handle submitting changes
    console.log('Submitting changes...')
  }

  if (loading) {
    return <div>Loading...</div>
  }

  if (error) {
    return <div>{error}</div>
  }

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-2xl font-bold mb-6 text-center">Ahlan Wasahlan, User</h1>
      
      <div className="flex justify-between items-center mb-6">
        <Select>
          <WeekSelector className="w-[200px]" onWeekChange={handleWeekChange} />
          <SelectContent>
            {/* You can add custom content here if needed */}
          </SelectContent>
        </Select>
        <Button variant="outline">Edit</Button>
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
            {tasks.map((task) => (
              <TableRow key={task.taskId}>
                <TableCell>{task.name}</TableCell>
                <TableCell>
                  <div className="flex items-center">
                    <Input 
                      type="number" 
                      value={task.quantityCompleted || 0} 
                      className="w-16 mr-2" 
                      min={0} 
                      max={task.frequencyCount}
                    />
                    <span>/ {task.frequencyCount}</span>
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

