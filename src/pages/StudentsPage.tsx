
import React, { useState } from 'react';
import StudentForm, { StudentFormData } from '@/components/StudentForm';
import StudentList from '@/components/StudentList';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

const StudentsPage = () => {
  const [selectedStudent, setSelectedStudent] = useState<StudentFormData | undefined>(undefined);
  const [activeTab, setActiveTab] = useState<string>('list');
  const { toast } = useToast();
  const { user } = useAuth();
  const queryClient = useQueryClient();

  // Fetch students from Supabase
  const { data: students = [], isLoading } = useQuery({
    queryKey: ['students'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('students')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) {
        throw error;
      }
      
      return data.map(student => ({
        id: student.id,
        name: student.name,
        rollNo: student.roll_no,
        studentId: student.student_id,
        email: student.email,
        profileImage: null,
      }));
    },
  });

  // Add student mutation
  const addStudentMutation = useMutation({
    mutationFn: async (student: StudentFormData) => {
      const { data, error } = await supabase
        .from('students')
        .insert([
          {
            name: student.name,
            roll_no: student.rollNo,
            student_id: student.studentId,
            email: student.email,
            user_id: user?.id,
          }
        ])
        .select();
      
      if (error) {
        throw error;
      }
      
      return data[0];
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['students'] });
      setActiveTab('list');
      toast({
        title: "Student Added",
        description: "The student has been successfully added.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to add student: ${error.message}`,
        variant: "destructive",
      });
    }
  });

  // Update student mutation
  const updateStudentMutation = useMutation({
    mutationFn: async (student: StudentFormData) => {
      const { data, error } = await supabase
        .from('students')
        .update({
          name: student.name,
          roll_no: student.rollNo,
          student_id: student.studentId,
          email: student.email,
        })
        .eq('id', student.id)
        .select();
      
      if (error) {
        throw error;
      }
      
      return data[0];
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['students'] });
      setSelectedStudent(undefined);
      setActiveTab('list');
      toast({
        title: "Student Updated",
        description: "The student has been successfully updated.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to update student: ${error.message}`,
        variant: "destructive",
      });
    }
  });

  // Delete student mutation
  const deleteStudentMutation = useMutation({
    mutationFn: async (studentId: string) => {
      const { error } = await supabase
        .from('students')
        .delete()
        .eq('id', studentId);
      
      if (error) {
        throw error;
      }
      
      return studentId;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['students'] });
      toast({
        title: "Student Deleted",
        description: "The student has been successfully removed.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to delete student: ${error.message}`,
        variant: "destructive",
      });
    }
  });

  const handleAddNewClick = () => {
    setSelectedStudent(undefined);
    setActiveTab('form');
  };

  const handleEditStudent = (student: StudentFormData) => {
    setSelectedStudent(student);
    setActiveTab('form');
  };

  const handleDeleteStudent = (studentId: string) => {
    deleteStudentMutation.mutate(studentId);
  };

  const onSubmit = (data: StudentFormData) => {
    if (selectedStudent) {
      updateStudentMutation.mutate({ ...data, id: selectedStudent.id });
    } else {
      addStudentMutation.mutate(data);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Students Management</h1>
        {activeTab === 'list' ? (
          <Button onClick={handleAddNewClick} className="bg-brand-500 hover:bg-brand-600">
            Add New Student
          </Button>
        ) : (
          <Button variant="outline" onClick={() => setActiveTab('list')}>
            Back to List
          </Button>
        )}
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-2 max-w-md">
          <TabsTrigger value="list">Students List</TabsTrigger>
          <TabsTrigger value="form">
            {selectedStudent ? 'Edit Student' : 'Add Student'}
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="list" className="mt-6">
          <StudentList 
            students={students} 
            onEdit={handleEditStudent}
            onDelete={handleDeleteStudent}
            isLoading={isLoading}
          />
        </TabsContent>
        
        <TabsContent value="form" className="mt-6">
          <StudentForm 
            onSubmit={onSubmit}
            initialData={selectedStudent}
            isLoading={addStudentMutation.isPending || updateStudentMutation.isPending}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default StudentsPage;
