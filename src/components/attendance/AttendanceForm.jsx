import React, { useState } from 'react';
import Select from '../ui/Select';
import Button from '../ui/Button';
import { format } from 'date-fns';

export const AttendanceForm = ({ 
  employees = [], 
  onSubmit, 
  onCancel, 
  loading = false,
  selectedEmployee = null 
}) => {
  const [formData, setFormData] = useState({
    employee_id: selectedEmployee?.toString() || '',
    date: format(new Date(), 'yyyy-MM-dd'),
    status: '',
  });
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.employee_id) {
      newErrors.employee_id = 'Please select an employee';
    }
    
    if (!formData.date) {
      newErrors.date = 'Date is required';
    } else if (new Date(formData.date) > new Date()) {
      newErrors.date = 'Cannot mark attendance for future dates';
    }
    
    if (!formData.status) {
      newErrors.status = 'Please select attendance status';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit({
        employee_id: parseInt(formData.employee_id),
        date: formData.date,
        status: formData.status,
      });
    }
  };

  const handleChange = (field) => (e) => {
    setFormData(prev => ({ ...prev, [field]: e.target.value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const employeeOptions = employees.map(emp => ({
    value: emp.id.toString(),
    label: `${emp.full_name} (${emp.employee_id})`,
  }));

  const statusOptions = [
    { value: 'Present', label: 'Present' },
    { value: 'Absent', label: 'Absent' },
  ];

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <Select
        label="Employee"
        options={employeeOptions}
        value={formData.employee_id}
        onChange={handleChange('employee_id')}
        error={errors.employee_id}
        placeholder="Select employee"
        required
      />
      
      <div className="w-full">
        <label className="label">
          Date<span className="text-red-500 ml-1">*</span>
        </label>
        <input
          type="date"
          className={`input ${errors.date ? 'input-error' : ''}`}
          value={formData.date}
          onChange={handleChange('date')}
          max={format(new Date(), 'yyyy-MM-dd')}
        />
        {errors.date && (
          <p className="mt-1.5 text-sm text-red-600">{errors.date}</p>
        )}
      </div>
      
      <Select
        label="Status"
        options={statusOptions}
        value={formData.status}
        onChange={handleChange('status')}
        error={errors.status}
        placeholder="Select status"
        required
      />

      <div className="flex gap-3 pt-4">
        <Button type="button" variant="secondary" onClick={onCancel} className="flex-1">
          Cancel
        </Button>
        <Button type="submit" loading={loading} className="flex-1">
          Mark Attendance
        </Button>
      </div>
    </form>
  );
};

export default AttendanceForm;
