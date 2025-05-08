
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { format } from 'date-fns';
import { useAuth } from '@/contexts/AuthContext';

export interface AttendanceRecord {
  id: string;
  date: string;
  status: 'present' | 'absent' | 'late';
  student_name: string;
  student_roll_no: string;
  student_id: string;
  class_name: string;
}

export interface ClassOption {
  id: string;
  name: string;
}

export const useAttendanceData = () => {
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

  // Fetch attendance records with joined data
  const { data: attendanceRecords = [], isLoading: attendanceLoading } = useQuery({
    queryKey: ['attendance', selectedClass, activeTab, selectedDate],
    queryFn: async () => {
      let query = supabase.from('attendance').select(`
        id,
        date,
        status,
        class_id,
        student_id
      `);

      if (selectedClass) {
        query = query.eq('class_id', selectedClass);
      }
      
      if (activeTab === 'daily') {
        const dateStr = format(selectedDate, 'yyyy-MM-dd');
        query = query.eq('date', dateStr);
      }

      const { data: attendanceData, error: attendanceError } = await query;
        
      if (attendanceError) throw attendanceError;
      
      // If there's no attendance data, return empty array
      if (!attendanceData || attendanceData.length === 0) {
        return [];
      }
      
      // Get unique student IDs and class IDs from attendance records
      const studentIds = [...new Set(attendanceData.map(record => record.student_id))];
      const classIds = [...new Set(attendanceData.map(record => record.class_id))];
      
      // Fetch student details
      const { data: studentsData, error: studentsError } = await supabase
        .from('students')
        .select('id, name, roll_no, student_id')
        .in('id', studentIds);
        
      if (studentsError) throw studentsError;
      
      // Fetch class details
      const { data: classesData, error: classesError } = await supabase
        .from('classes')
        .select('id, name')
        .in('id', classIds);
        
      if (classesError) throw classesError;
      
      // Map students and classes to their IDs for easy lookup
      const studentMap = (studentsData || []).reduce((acc, student) => {
        acc[student.id] = student;
        return acc;
      }, {} as Record<string, any>);
      
      const classMap = (classesData || []).reduce((acc, cls) => {
        acc[cls.id] = cls;
        return acc;
      }, {} as Record<string, any>);
      
      // Combine all data into one structure
      return attendanceData.map(record => {
        const student = studentMap[record.student_id] || {};
        const cls = classMap[record.class_id] || {};
        
        return {
          id: record.id,
          date: record.date,
          status: record.status,
          student_name: student.name || 'Unknown Student',
          student_roll_no: student.roll_no || 'N/A',
          student_id: student.student_id || 'N/A',
          class_name: cls.name || 'Unknown Class'
        };
      }) as AttendanceRecord[];
    },
    enabled: !!user?.id,
  });

  return {
    selectedDate,
    setSelectedDate,
    selectedClass,
    setSelectedClass,
    activeTab,
    setActiveTab,
    classes,
    classesLoading,
    attendanceRecords,
    attendanceLoading
  };
};
