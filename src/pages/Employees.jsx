import React, { useState } from 'react';
import { Plus, Search, AlertTriangle } from 'lucide-react';
import Header from '../components/layout/Header';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Modal from '../components/ui/Modal';
import EmployeeList from '../components/employees/EmployeeList';
import EmployeeForm from '../components/employees/EmployeeForm';
import { useEmployees } from '../hooks/useEmployees';
import { useToast } from '../context/ToastContext';

export const Employees = () => {
  const { employees, loading, error, fetchEmployees, createEmployee, deleteEmployee } = useEmployees();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const toast = useToast();

  const handleCreateEmployee = async (data) => {
    try {
      setSubmitting(true);
      await createEmployee(data);
      setIsModalOpen(false);
      toast.success('Employee added successfully!');
    } catch (err) {
      toast.error(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteClick = (employee) => {
    setSelectedEmployee(employee);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    try {
      await deleteEmployee(selectedEmployee.id);
      setIsDeleteModalOpen(false);
      setSelectedEmployee(null);
      toast.success('Employee deleted successfully!');
    } catch (err) {
      toast.error(err.message);
    }
  };

  const handleSearch = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    fetchEmployees(query);
  };

  return (
    <div className="ml-64 min-h-screen bg-gray-50">
      <Header
        title="Employees"
        subtitle={`Manage your team of ${employees.length} employees`}
        action={
          <Button onClick={() => setIsModalOpen(true)}>
            <Plus className="w-4 h-4" />
            Add Employee
          </Button>
        }
      />

      <main className="p-8">
        <Card className="mb-6">
          <div className="p-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search employees by name, ID, or department..."
                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                value={searchQuery}
                onChange={handleSearch}
              />
            </div>
          </div>
        </Card>

        <EmployeeList
          employees={employees}
          loading={loading}
          error={error}
          onDelete={handleDeleteClick}
          onAddNew={() => setIsModalOpen(true)}
        />
      </main>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Add New Employee"
      >
        <EmployeeForm
          onSubmit={handleCreateEmployee}
          onCancel={() => setIsModalOpen(false)}
          loading={submitting}
        />
      </Modal>

      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        title="Delete Employee"
        size="sm"
      >
        <div className="text-center">
          <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertTriangle className="w-6 h-6 text-red-600" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Are you sure?
          </h3>
          <p className="text-gray-500 mb-6">
            This will permanently delete <strong>{selectedEmployee?.full_name}</strong> and all their attendance records. This action cannot be undone.
          </p>
          <div className="flex gap-3">
            <Button
              variant="secondary"
              onClick={() => setIsDeleteModalOpen(false)}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              variant="danger"
              onClick={handleConfirmDelete}
              className="flex-1"
            >
              Delete
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default Employees;
