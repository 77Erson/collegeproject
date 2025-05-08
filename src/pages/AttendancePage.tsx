
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';
import { format } from 'date-fns';
import { supabase } from '@/integrations/supabase/client';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '@/contexts/AuthContext';
import { Loader2, FileText, Calendar as CalendarIcon } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

interface AttendanceRecord {
  id: string;
  date: string;
  status: 'present' | 'absent' | 'late';
  student: {
    name: string;
    roll_no: string;
    student_id: string;
  };
  class: {
    name: string;
  };
}

interface ClassOption {
  id: string;
  name: string;
}

const AttendancePage = () => {
  const { user } = useAuth();
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [selectedClass, setSelectedClass] = useState<string>("");
  const [activeTab, setActiveTab] = useState<string>('daily');

  // Fetch classes
  const { data: classes = [], isLoading: classesLoading } = useQuery({
    queryKey: ['classes'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('classes')
        .select('id, name')
        .eq('teacher_id', user?.id);
        
      if (error) throw error;
      return data as ClassOption[];
    },
  });

  // Fetch attendance records
  const { data: attendanceRecords = [], isLoading: attendanceLoading } = useQuery({
    queryKey: ['attendance', selectedClass, activeTab, selectedDate],
    queryFn: async () => {
      let query = supabase
        .from('attendance')
        .select(`
          id,
          date,
          status,
          students!inner(name, roll_no, student_id),
          classes!inner(name)
        `)
        .eq('classes.teacher_id', user?.id);

      if (selectedClass) {
        query = query.eq('class_id', selectedClass);
      }
      
      if (activeTab === 'daily') {
        const dateStr = format(selectedDate, 'yyyy-MM-dd');
        query = query.eq('date', dateStr);
      }

      const { data, error } = await query;
        
      if (error) throw error;
      
      return data.map(record => ({
        id: record.id,
        date: record.date,
        status: record.status,
        student: {
          name: record.students.name,
          roll_no: record.students.roll_no,
          student_id: record.students.student_id,
        },
        class: {
          name: record.classes.name,
        }
      })) as AttendanceRecord[];
    },
    enabled: !!user?.id,
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Attendance Management</h1>
        <Button variant="outline" className="gap-2">
          <FileText className="h-4 w-4" />
          Export Report
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Attendance Report</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div>
              <label className="block text-sm font-medium mb-1">Class</label>
              <Select value={selectedClass} onValueChange={setSelectedClass}>
                <SelectTrigger>
                  <SelectValue placeholder="Select class" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All Classes</SelectItem>
                  {classes.map(cls => (
                    <SelectItem key={cls.id} value={cls.id}>
                      {cls.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Date</label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full justify-start text-left font-normal"
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {format(selectedDate, 'PPP')}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={(date) => setSelectedDate(date || new Date())}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList>
              <TabsTrigger value="daily">Daily Report</TabsTrigger>
              <TabsTrigger value="summary">Summary Report</TabsTrigger>
            </TabsList>
            
            <TabsContent value="daily" className="mt-4">
              {attendanceLoading ? (
                <div className="flex justify-center items-center py-8">
                  <Loader2 className="animate-spin h-8 w-8 mr-2" />
                  <span>Loading attendance records...</span>
                </div>
              ) : attendanceRecords.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <CalendarIcon className="mx-auto h-12 w-12 opacity-30 mb-2" />
                  <p className="text-lg">No attendance records found for the selected criteria</p>
                  <p className="text-sm">Try selecting a different class or date</p>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Student</TableHead>
                      <TableHead>Roll No</TableHead>
                      <TableHead>Class</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {attendanceRecords.map((record) => (
                      <TableRow key={record.id}>
                        <TableCell>{record.student.name}</TableCell>
                        <TableCell>{record.student.roll_no}</TableCell>
                        <TableCell>{record.class.name}</TableCell>
                        <TableCell>{format(new Date(record.date), 'PP')}</TableCell>
                        <TableCell>
                          <span className={`px-2 py-1 rounded-full text-xs ${
                            record.status === 'present' ? 'bg-green-100 text-green-800' :
                            record.status === 'absent' ? 'bg-red-100 text-red-800' :
                            'bg-yellow-100 text-yellow-800'
                          }`}>
                            {record.status.charAt(0).toUpperCase() + record.status.slice(1)}
                          </span>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </TabsContent>
            
            <TabsContent value="summary" className="mt-4">
              <div className="text-center py-8">
                <p className="text-gray-500">Attendance summary visualization will be displayed here</p>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default AttendancePage;
