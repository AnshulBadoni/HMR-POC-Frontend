import { useState, useCallback, useEffect } from 'react';
import { attendanceAPI } from '../services/api';

export const useAttendance = (employeeId = null) => {
  const [attendance, setAttendance] = useState([]);
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchAttendance = useCallback(async (params = {}) => {
    try {
      setLoading(true);
      setError(null);
      
      if (employeeId) {
        const response = await attendanceAPI.getByEmployee(employeeId, params);
        setAttendance(response.data.attendance_records);
        setSummary(response.data.summary);
      } else {
        const response = await attendanceAPI.getAll(params);
        setAttendance(response.data.records);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [employeeId]);

  const markAttendance = useCallback(async (data) => {
    const response = await attendanceAPI.mark(data);
    await fetchAttendance();
    return response.data;
  }, [fetchAttendance]);

  const updateAttendance = useCallback(async (id, data) => {
    const response = await attendanceAPI.update(id, data);
    setAttendance(prev => 
      prev.map(att => att.id === id ? response.data : att)
    );
    return response.data;
  }, []);

  const deleteAttendance = useCallback(async (id) => {
    await attendanceAPI.delete(id);
    setAttendance(prev => prev.filter(att => att.id !== id));
  }, []);

  useEffect(() => {
    fetchAttendance();
  }, [fetchAttendance]);

  return {
    attendance,
    summary,
    loading,
    error,
    fetchAttendance,
    markAttendance,
    updateAttendance,
    deleteAttendance,
  };
};
