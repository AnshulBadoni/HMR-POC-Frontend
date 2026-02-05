import React, { useState } from 'react';
import Input from '../ui/Input';
import Select from '../ui/Select';
import Button from '../ui/Button';

const departments = [
  { value: 'Engineering', label: 'Engineering' },
  { value: 'Product', label: 'Product' },
  { value: 'Design', label: 'Design' },
  { value: 'Marketing', label: 'Marketing' },
  { value: 'Sales', label: 'Sales' },
  { value: 'HR', label: 'Human Resources' },
  { value: 'Finance', label: 'Finance' },
  { value: 'Operations', label: 'Operations' },
];

export const EmployeeForm = ({ onSubmit, onCancel, loading = false }) => {
  const [formData, setFormData] = useState({
    employee_id: '',
    full_name: '',
    email: '',
    department: '',
  });
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.employee_id.trim()) {
      newErrors.employee_id = 'Employee ID is required';
    } else if (!/^[A-Za-z0-9-_]+$/.test(formData.employee_id)) {
      newErrors.employee_id = 'Only letters, numbers, hyphens, and underscores allowed';
    }
    
    if (!formData.full_name.trim()) {
      newErrors.full_name = 'Full name is required';
    } else if (formData.full_name.length < 2) {
      newErrors.full_name = 'Name must be at least 2 characters';
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    
    if (!formData.department) {
      newErrors.department = 'Department is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit(formData);
    }
  };

  const handleChange = (field) => (e) => {
    setFormData(prev => ({ ...prev, [field]: e.target.value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <Input
        label="Employee ID"
        placeholder="e.g., EMP-001"
        value={formData.employee_id}
        onChange={handleChange('employee_id')}
        error={errors.employee_id}
        required
      />
      
      <Input
        label="Full Name"
        placeholder="Enter full name"
        value={formData.full_name}
        onChange={handleChange('full_name')}
        error={errors.full_name}
        required
      />
      
      <Input
        label="Email Address"
        type="email"
        placeholder="email@example.com"
        value={formData.email}
        onChange={handleChange('email')}
        error={errors.email}
        required
      />
      
      <Select
        label="Department"
        options={departments}
        value={formData.department}
        onChange={handleChange('department')}
        error={errors.department}
        required
      />

      <div className="flex gap-3 pt-4">
        <Button type="button" variant="secondary" onClick={onCancel} className="flex-1">
          Cancel
        </Button>
        <Button type="submit" loading={loading} className="flex-1">
          Add Employee
        </Button>
      </div>
    </form>
  );
};

export default EmployeeForm;
