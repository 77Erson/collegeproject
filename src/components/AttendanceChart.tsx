
import React from 'react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, PieChart, Pie, Cell, LineChart, Line } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

interface AttendanceData {
  name: string;
  present: number;
  absent: number;
  late: number;
}

interface AttendanceChartProps {
  data: AttendanceData[];
  title: string;
  description?: string;
  type?: 'bar' | 'pie' | 'line';
}

const COLORS = ['#0088FE', '#FF8042', '#FFBB28'];

const AttendanceChart = ({ data, title, description, type = 'bar' }: AttendanceChartProps) => {
  const renderChart = () => {
    switch (type) {
      case 'pie':
        const pieData = [
          { name: 'Present', value: data.reduce((acc, curr) => acc + curr.present, 0) },
          { name: 'Absent', value: data.reduce((acc, curr) => acc + curr.absent, 0) },
          { name: 'Late', value: data.reduce((acc, curr) => acc + curr.late, 0) }
        ];
        
        return (
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        );
        
      case 'line':
        return (
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="present" stroke="#0088FE" activeDot={{ r: 8 }} />
              <Line type="monotone" dataKey="absent" stroke="#FF8042" />
              <Line type="monotone" dataKey="late" stroke="#FFBB28" />
            </LineChart>
          </ResponsiveContainer>
        );
        
      default:
        return (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="present" fill="#0088FE" />
              <Bar dataKey="absent" fill="#FF8042" />
              <Bar dataKey="late" fill="#FFBB28" />
            </BarChart>
          </ResponsiveContainer>
        );
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        {description && <CardDescription>{description}</CardDescription>}
      </CardHeader>
      <CardContent>
        {renderChart()}
      </CardContent>
    </Card>
  );
};

export default AttendanceChart;
