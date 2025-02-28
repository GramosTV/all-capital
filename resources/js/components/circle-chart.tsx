import { useState } from 'react';
import { Cell, Legend, Pie, PieChart, Tooltip } from 'recharts';
import { Label } from './ui/label';
import { Switch } from './ui/switch';
const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];
const getPercentageLabel = (value: number) => `${(value * 100).toFixed(0)}%`;
interface ChartProps {
    title: string;
    data: { name: string; amount: number }[];
}
const CircleChart = ({ title, data }: ChartProps) => {
    const [percentView, setPercentView] = useState(false);
    return (
        <div>
            <div className="flex gap-6">
                <h3 className="text-lg font-medium">{title}</h3>
                <div className="flex items-center space-x-2">
                    <Switch id="expense-mode" checked={percentView} onClick={() => setPercentView(!percentView)} />
                    <Label>% View</Label>
                </div>
            </div>
            <PieChart width={600} height={400}>
                <Pie
                    data={data}
                    dataKey="amount"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={120}
                    fill="#8884d8"
                    label={percentView ? ({ percent }) => getPercentageLabel(percent) : true}
                >
                    {data.map((_, index: number) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                </Pie>
                <Tooltip />
                <Legend />
            </PieChart>
        </div>
    );
};

export default CircleChart;
