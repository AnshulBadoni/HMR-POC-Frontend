import { useState, useCallback, useEffect } from 'react';
import { employeeAPI } from '../services/api';

export const useEmployees = () => {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchEmployees = useCallback(async (search = '') => {
    try {
      setLoading(true);
      setError(null);
      const response = await employeeAPI.getAll({ search });
      setEmployees(response.data.employees);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  const createEmployee = useCallback(async (data) => {
    const response = await employeeAPI.create(data);
    setEmployees(prev => [response.data, ...prev]);
    return response.data;
  }, []);

  const deleteEmployee = useCallback(async (id) => {
    await employeeAPI.delete(id);
    setEmployees(prev => prev.filter(emp => emp.id !== id));
  }, []);

  useEffect(() => {
    fetchEmployees();
  }, [fetchEmployees]);

  return {
    employees,
    loading,
    error,
    fetchEmployees,
    createEmployee,
    deleteEmployee,
  };
};
