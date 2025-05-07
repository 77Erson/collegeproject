
import React, { useState } from 'react';
import StudentForm, { StudentFormData } from '@/components/StudentForm';
import StudentList from '@/components/StudentList';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { v4 as uuidv4 } from 'uuid';

// Sample initial students data
const initialStudents: StudentFormData[] = [
  {
    id: '1',
    name: 'Emma Thompson',
    rollNo: 'A001',
    studentId: 'STU001',
    email: 'emma.thompson@example.com',
  },
  {
    id: '2',
    name: 'James Wilson',
    rollNo: 'A002',
    studentId: 'STU002',
    email: 'james.wilson@example.com',
  },
  {
    id: '3',
    name: 'Sophia Chen',
    rollNo: 'A003',
    studentId: 'STU003',
    email: 'sophia.chen@example.com',
  },
  {
    id: '4',
    name: 'Daniel Kim',
    rollNo: 'A004',
    studentId: 'STU004',
    email: 'daniel.kim@example.com',
  },
];

const StudentsPage = () => {
  const [students, setStudents] = useState<StudentFormData[]>(initialStudents);
  const [selectedStudent, setSelectedStudent] = useState<StudentFormData | undefined>(undefined);
  const [activeTab, setActiveTab] = useState<string>('list');
  const { toast } = useToast();

  const handleAddStudent = (student: StudentFormData) => {
    const newStudent = {
      ...student,
      id: uuidv4(),
    };
    
    setStudents([...students, newStudent]);
    setActiveTab('list');
  };

  const handleEditStudent = (student: StudentFormData) => {
    setSelectedStudent(student);
    setActiveTab('form');
  };

  const handleUpdateStudent = (updatedStudent: StudentFormData) => {
    const updatedStudents = students.map((student) => 
      student.id === updatedStudent.id ? updatedStudent : student
    );
    
    setStudents(updatedStudents);
    setSelectedStudent(undefined);
    setActiveTab('list');
  };

  const handleDeleteStudent = (studentId: string) => {
    const updatedStudents = students.filter((student) => student.id !== studentId);
    setStudents(updatedStudents);
    
    toast({
      title: "Student Deleted",
      description: "The student has been successfully removed.",
      variant: "default",
    });
  };

  const handleAddNewClick = () => {
    setSelectedStudent(undefined);
    setActiveTab('form');
  };

  const onSubmit = (data: StudentFormData) => {
    if (selectedStudent) {
      handleUpdateStudent({ ...data, id: selectedStudent.id });
    } else {
      handleAddStudent(data);
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
          />
        </TabsContent>
        
        <TabsContent value="form" className="mt-6">
          <StudentForm 
            onSubmit={onSubmit}
            initialData={selectedStudent}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default StudentsPage;
