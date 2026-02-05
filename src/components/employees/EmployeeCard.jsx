import React from 'react';
import { Mail, Trash2, Calendar } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Badge from '../ui/Badge';
import Button from '../ui/Button';
import { format } from 'date-fns';

export const EmployeeCard = ({ employee, onDelete }) => {
  const navigate = useNavigate();

  return (
    <div className="card p-5 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center">
            <span className="text-primary-700 font-semibold text-lg">
              {employee.full_name.charAt(0).toUpperCase()}
            </span>
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">{employee.full_name}</h3>
            <p className="text-sm text-gray-500">{employee.employee_id}</p>
          </div>
        </div>
        <Badge variant="info">{employee.department}</Badge>
      </div>

      <div className="mt-4 space-y-2">
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <Mail className="w-4 h-4" />
          <span>{employee.email}</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <Calendar className="w-4 h-4" />
          <span>Joined {format(new Date(employee.created_at), 'MMM d, yyyy')}</span>
        </div>
      </div>

      <div className="mt-4 pt-4 border-t border-gray-100 flex gap-2">
        <Button
          variant="secondary"
          size="sm"
          className="flex-1"
          onClick={() => navigate(`/attendance?employee=${employee.id}`)}
        >
          View Attendance
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onDelete(employee)}
          className="text-red-600 hover:bg-red-50"
        >
          <Trash2 className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
};

export default EmployeeCard;
