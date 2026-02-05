import React from 'react';
import { Users } from 'lucide-react';
import EmployeeCard from './EmployeeCard';
import EmptyState from '../ui/EmptyState';
import { PageLoader } from '../ui/Spinner';

export const EmployeeList = ({ employees, loading, error, onDelete, onAddNew }) => {
  if (loading) {
    return <PageLoader />;
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600 mb-4">{error}</p>
      </div>
    );
  }

  if (employees.length === 0) {
    return (
      <EmptyState
        icon={Users}
        title="No employees yet"
        description="Get started by adding your first employee to the system."
        action={onAddNew}
        actionLabel="Add Employee"
      />
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
      {employees.map((employee) => (
        <EmployeeCard
          key={employee.id}
          employee={employee}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
};

export default EmployeeList;
