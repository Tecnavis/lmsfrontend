import React, { useState } from 'react';
import { Modal, Box, Button, TextField, Typography } from '@mui/material';
import axios from 'axios';
import { BASE_URL } from '../Helper/handle-api';

interface HolidayFormProps {
  open: boolean;
  onClose: () => void;
  fetchAttendanceRecords: () => void; // Add this prop
}

const HolidayForm: React.FC<HolidayFormProps> = ({ open, onClose, fetchAttendanceRecords }) => {
  const [fromDate, setFromDate] = useState<string>('');
  const [toDate, setToDate] = useState<string>('');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async () => {
    try {
      const response = await axios.post(`${BASE_URL}/attendance/update-attendance`, {
        fromDate,
        toDate,
      });

      if (response.status === 200) {
        alert('Holidays updated successfully');
        onClose(); // Close the modal
        fetchAttendanceRecords(); // Fetch updated attendance records
      } else {
        setError('Failed to update holidays');
      }
    } catch (error) {
      console.error('Error updating holidays:', error);
      setError('Failed to update holidays');
    }
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Box sx={{
        width: 400,
        bgcolor: 'background.paper',
        padding: 4,
        margin: 'auto',
        marginTop: '10%',
        borderRadius: 1,
      }}>
        <Typography variant="h6">Select Date Range for Holidays</Typography>
        <TextField
          label="From Date"
          type="date"
          value={fromDate}
          onChange={(e) => setFromDate(e.target.value)}
          fullWidth
          margin="normal"
          InputLabelProps={{ shrink: true }}
        />
        <TextField
          label="To Date"
          type="date"
          value={toDate}
          onChange={(e) => setToDate(e.target.value)}
          fullWidth
          margin="normal"
          InputLabelProps={{ shrink: true }}
        />
        <Button
          variant="contained"
          color="primary"
          onClick={handleSubmit}
          sx={{ marginTop: 2 }}
        >
          Submit
        </Button>
        {error && <Typography color="error">{error}</Typography>}
      </Box>
    </Modal>
  );
};

export default HolidayForm;
