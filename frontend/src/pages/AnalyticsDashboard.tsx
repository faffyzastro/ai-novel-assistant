import React from 'react';
import Card from '../components/ui/Card';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, Legend } from 'recharts';

const storyStats = [
  { name: 'Drafts', value: 5 },
  { name: 'In Progress', value: 3 },
  { name: 'Completed', value: 7 },
  { name: 'AI Generated', value: 4 },
];

const aiUsage = [
  { name: 'OpenAI', value: 8 },
  { name: 'Claude', value: 3 },
  { name: 'Gemini', value: 2 },
];

const activity = [
  { date: '2024-06-01', stories: 1 },
  { date: '2024-06-02', stories: 2 },
  { date: '2024-06-03', stories: 1 },
  { date: '2024-06-04', stories: 3 },
  { date: '2024-06-05', stories: 2 },
  { date: '2024-06-06', stories: 4 },
  { date: '2024-06-07', stories: 1 },
];

const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff7f50'];

const AnalyticsDashboard: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-orange-50 dark:from-[#181c2a] dark:via-[#232946] dark:to-blue-950">
      <div className="w-full mx-auto p-4 md:p-8 md:max-w-5xl">
        <h2 className="text-2xl font-bold text-blue-700 dark:text-orange-300 mb-6">Analytics Dashboard</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          <Card className="p-4">
            <h3 className="font-bold mb-2">Story Status</h3>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={storyStats}>
                <XAxis dataKey="name" />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Bar dataKey="value" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </Card>
          <Card className="p-4">
            <h3 className="font-bold mb-2">AI Usage Breakdown</h3>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie data={aiUsage} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label>
                  {aiUsage.map((entry, idx) => (
                    <Cell key={`cell-${idx}`} fill={COLORS[idx % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </Card>
        </div>
        <Card className="p-4 mb-8">
          <h3 className="font-bold mb-2">Activity Over Time</h3>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={activity}>
              <XAxis dataKey="date" />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="stories" stroke="#82ca9d" strokeWidth={3} />
            </LineChart>
          </ResponsiveContainer>
        </Card>
      </div>
    </div>
  );
};

export default AnalyticsDashboard; 