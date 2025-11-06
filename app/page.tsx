"use client";

import { Users, BarChart, Activity } from 'lucide-react';
import { MetricCard } from './_components/MetricCard';

export default function Dashboard() {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <MetricCard
          title="Users"
          value="1,234"
          icon={<Users className="text-white" />}
        />
        <MetricCard
          title="Revenue"
          value="$56,789"
          icon={<BarChart className="text-white" />}
        />
        <MetricCard
          title="Active Sessions"
          value="567"
          icon={<Activity className="text-white" />}
        />
      </div>
    </div>
  );
}
