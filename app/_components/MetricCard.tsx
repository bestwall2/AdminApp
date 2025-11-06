import { ReactNode } from 'react';

interface MetricCardProps {
  title: string;
  value: string;
  icon: ReactNode;
}

export const MetricCard = ({ title, value, icon }: MetricCardProps) => {
  return (
    <div className="card p-6 transition-transform transform hover:-translate-y-1">
      <div className="flex items-center">
        <div className="p-3 bg-primary-light dark:bg-primary-dark rounded-full">
          {icon}
        </div>
        <div className="ml-4">
          <p className="text-gray-500 dark:text-gray-400">{title}</p>
          <p className="text-2xl font-bold">{value}</p>
        </div>
      </div>
    </div>
  );
};
