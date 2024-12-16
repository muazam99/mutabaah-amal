'use client'

import { Button } from '@/components/ui/button'
import { Select, WeekSelector } from '@/components/ui/select'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Input } from '@/components/ui/input'
import { getUserById, getUserTasks, submitUserTasks } from '@/db/queries'
import { useState, useEffect, use } from 'react';
import { UserTask } from '@/types/userTaskModel'
import { getCurrentWeek, getMaxFrequenceFromFrequencyType } from '@/components/utils/util'
import { useRouter } from 'next/navigation'
import { set } from 'date-fns'
import Loading from './loading'
import { useToast } from '@/hooks/use-toast'
import { Loader } from 'lucide-react'



export default function TaskPage(props: { params: Promise<{ userId: number }> }) {
  const params = use(props.params);
  const { toast } = useToast();
  const router = useRouter();
  const [userName, setUserName] = useState('');
  const [selectedWeek, setSelectedWeek] = useState<[Date, Date]>(getCurrentWeek());
  const [completedTasks, setCompletedTasks] = useState<UserTask[]>([]);
  const [inputValues, setInputValues] = useState(
    completedTasks.reduce((acc: any, task) => {
      acc[task.taskId] = task.quantityCompleted || 0;
      return acc;
    }, {})
  );
  const [loading, setLoading] = useState(false);

  const handleWeekChange = async (startDate: Date, endDate: Date) => {
    setSelectedWeek([startDate, endDate]);
  }

  const handleSubmit = () => {
    setLoading(true);
    const updatedTasks = completedTasks.map((task) => {
      const inputValue = inputValues[task.taskId];
      return {
        ...task,
        updatedAt: new Date().toDateString(),
        quantityCompleted: inputValue,
        taskDateFrom: selectedWeek[0].toDateString(),
        taskDateTo: selectedWeek[1].toDateString(),
      };
    });

    submitUserTasks(params.userId, updatedTasks).then(() => {
      toast({
        variant: "success",
        title: "Success",
        description: "Successfully updated tasks",
      });
      setLoading(false);
      fetchCompletedTasks();
    });
  }

  const handleGoBack = () => {
    router.back(); // Navigates to the previous page
  };

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

  // fetch userNameById
  useEffect(() => {
    const userData = getUserById(params.userId);
    userData.then((data) => {
      setUserName(data.username);
    });
  }, []);

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

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-2xl font-bold mb-6 text-center">Ahlan Wasahlan, {userName}</h1>
      
      <div className="flex justify-between items-center mb-6">
        <Button variant="outline" className='w-[100px] mr-4' onClick={handleGoBack}>
          Kembali
        </Button>
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
        <Button onClick={handleSubmit} disabled={loading}>
          {loading ? 
             <Loader className="h-6 w-6 text-muted-foreground animate-spin"/>
            : 
          'Submit Changes'}
        </Button>
      </div>
    </div>
  )
}

