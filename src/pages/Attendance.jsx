import React, { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Plus, Filter, AlertTriangle } from 'lucide-react';
import { format } from 'date-fns';
import Header from '../components/layout/Header';
import Card, { CardBody } from '../components/ui/Card';
import Button from '../components/ui/Button';
import Modal from '../components/ui/Modal';
import AttendanceList from '../components/attendance/AttendanceList';
import AttendanceForm from '../components/attendance/AttendanceForm';
import { useAttendance } from '../hooks/useAttendance';
import { useEmployees } from '../hooks/useEmployees';
import { useToast } from '../context/ToastContext';

export const Attendance = () => {
  const [searchParams] = useSearchParams();
  const selectedEmployeeId = searchParams.get('employee');
  
  const { employees } = useEmployees();
  const { attendance, summary, loading, error, fetchAttendance, markAttendance, deleteAttendance } = useAttendance(selectedEmployeeId ? parseInt(selectedEmployeeId) : null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [dateFilter, setDateFilter] = useState('');
  const toast = useToast();

  const selectedEmployee = selectedEmployeeId 
    ? employees.find(e => e.id === parseInt(selectedEmployeeId))
    : null;

  const handleMarkAttendance = async (data) => {
    try {
      setSubmitting(true);
      await markAttendance(data);
      setIsModalOpen(false);
      toast.success('Attendance marked successfully!');
    } catch (err) {
      toast.error(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteClick = (record) => {
    setSelectedRecord(record);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    try {
      await deleteAttendance(selectedRecord.id);
      setIsDeleteModalOpen(false);
      setSelectedRecord(null);
      toast.success('Attendance record deleted!');
    } catch (err) {
      toast.error(err.message);
    }
  };

  const handleDateFilter = (e) => {
    const date = e.target.value;
    setDateFilter(date);
    fetchAttendance({ date_filter: date || undefined });
  };

  return (
    <div className="ml-64 min-h-screen bg-gray-50">
      <Header
        title={selectedEmployee ? `${selectedEmployee.full_name}'s Attendance` : 'Attendance'}
        subtitle={selectedEmployee ? `Tracking attendance for ${selectedEmployee.employee_id}` : 'Track and manage employee attendance'}
        action={
          <Button onClick={() => setIsModalOpen(true)}>
            <Plus className="w-4 h-4" />
            Mark Attendance
          </Button>
        }
      />

      <main className="p-8">
        {selectedEmployee && summary && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <Card className="p-4">
              <p className="text-sm text-gray-500">Total Days</p>
              <p className="text-2xl font-bold text-gray-900">{summary.total_days}</p>
            </Card>
            <Card className="p-4">
              <p className="text-sm text-gray-500">Present</p>
              <p className="text-2xl font-bold text-green-600">{summary.present_days}</p>
            </Card>
            <Card className="p-4">
              <p className="text-sm text-gray-500">Absent</p>
              <p className="text-2xl font-bold text-red-600">{summary.absent_days}</p>
            </Card>
            <Card className="p-4">
              <p className="text-sm text-gray-500">Attendance Rate</p>
              <p className="text-2xl font-bold text-primary-600">{summary.attendance_percentage}%</p>
            </Card>
          </div>
        )}

        {!selectedEmployee && (
          <Card className="mb-6">
            <div className="p-4 flex items-center gap-4">
              <Filter className="w-5 h-5 text-gray-400" />
              <input
                type="date"
                className="input max-w-xs"
                value={dateFilter}
                onChange={handleDateFilter}
                placeholder="Filter by date"
              />
              {dateFilter && (
                <Button variant="ghost" size="sm" onClick={() => handleDateFilter({ target: { value: '' } })}>
                  Clear
                </Button>
              )}
            </div>
          </Card>
        )}

        <Card>
          <CardBody>
            <AttendanceList
              attendance={attendance}
              loading={loading}
              error={error}
              onDelete={handleDeleteClick}
              onAddNew={() => setIsModalOpen(true)}
              showEmployee={!selectedEmployee}
            />
          </CardBody>
        </Card>
      </main>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Mark Attendance"
      >
        <AttendanceForm
          employees={employees}
          onSubmit={handleMarkAttendance}
          onCancel={() => setIsModalOpen(false)}
          loading={submitting}
          selectedEmployee={selectedEmployeeId}
        />
      </Modal>

      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        title="Delete Attendance Record"
        size="sm"
      >
        <div className="text-center">
          <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertTriangle className="w-6 h-6 text-red-600" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Delete this record?
          </h3>
          <p className="text-gray-500 mb-6">
            This will permanently delete the attendance record for{' '}
            {selectedRecord && format(new Date(selectedRecord.date), 'MMM d, yyyy')}.
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

export default Attendance;
