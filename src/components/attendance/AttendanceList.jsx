import React from 'react';
import { CalendarCheck, Trash2 } from 'lucide-react';
import { format } from 'date-fns';
import Badge from '../ui/Badge';
import Button from '../ui/Button';
import EmptyState from '../ui/EmptyState';
import { PageLoader } from '../ui/Spinner';

export const AttendanceList = ({ 
  attendance, 
  loading, 
  error, 
  onDelete, 
  onAddNew,
  showEmployee = true 
}) => {
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

  if (attendance.length === 0) {
    return (
      <EmptyState
        icon={CalendarCheck}
        title="No attendance records"
        description="Start tracking attendance by marking the first record."
        action={onAddNew}
        actionLabel="Mark Attendance"
      />
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-gray-200">
            {showEmployee && (
              <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Employee</th>
            )}
            <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Date</th>
            <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Status</th>
            {showEmployee && (
              <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Department</th>
            )}
            <th className="text-right py-3 px-4 text-sm font-medium text-gray-500">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {attendance.map((record) => (
            <tr key={record.id} className="hover:bg-gray-50 transition-colors">
              {showEmployee && (
                <td className="py-4 px-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
                      <span className="text-primary-700 font-medium text-sm">
                        {record.employee_name?.charAt(0) || 'E'}
                      </span>
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{record.employee_name}</p>
                      <p className="text-sm text-gray-500">{record.employee_code}</p>
                    </div>
                  </div>
                </td>
              )}
              <td className="py-4 px-4 text-gray-900">
                {format(new Date(record.date), 'MMM d, yyyy')}
              </td>
              <td className="py-4 px-4">
                <Badge variant={record.status === 'Present' ? 'success' : 'danger'}>
                  {record.status}
                </Badge>
              </td>
              {showEmployee && (
                <td className="py-4 px-4 text-gray-600">{record.department}</td>
              )}
              <td className="py-4 px-4 text-right">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onDelete(record)}
                  className="text-red-600 hover:bg-red-50"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AttendanceList;
