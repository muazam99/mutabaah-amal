'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, WeekSelector } from '@/components/ui/select'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Input } from '@/components/ui/input'

// Dummy data for demonstration
const tasks = [
  { id: 1, name: 'Solat Subuh', progress: 3, total: 7, lastUpdated: '2023-07-10' },
  { id: 2, name: 'Solat Zuhr', progress: 5, total: 7, lastUpdated: '2023-07-11' },
  { id: 3, name: 'Solat Asr', progress: 4, total: 7, lastUpdated: '2023-07-12' },
  { id: 4, name: 'Solat Maghrib', progress: 7, total: 7, lastUpdated: '2023-07-13' },
  { id: 5, name: 'Solat Isya', progress: 6, total: 7, lastUpdated: '2023-07-14' },
]

export default function TaskPage({ params }: { params: { user_id: string } }) {
  const [selectedWeek, setSelectedWeek] = useState<[Date, Date] | null>(null)
  const username = 'Ahmad' // This should be fetched based on user_id

  const handleWeekChange = (startDate: Date, endDate: Date) => {
    setSelectedWeek([startDate, endDate])
    // Here you would typically fetch tasks for the new week
  }

  const handleSubmit = () => {
    // Handle submitting changes
    console.log('Submitting changes...')
  }

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-2xl font-bold mb-6 text-center">Ahlan Wasahlan, {username}</h1>
      
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
              <TableRow key={task.id}>
                <TableCell>{task.name}</TableCell>
                <TableCell>
                  <div className="flex items-center">
                    <Input 
                      type="number" 
                      value={task.progress} 
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

      <div className="mt-4 flex justify-end">
        <Button onClick={handleSubmit}>Submit Changes</Button>
      </div>
    </div>
  )
}

