import React, { useState } from 'react';
import { TextField, Button, Grid, MenuItem, Paper, Typography, Box } from '@mui/material';
import { styled } from '@mui/system';
import axios from 'axios';
import { BASE_URL } from '../Helper/handle-api';
import Swal from 'sweetalert2';

const PaymentFormContainer = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  maxWidth: 600,
  margin: 'auto',
  borderRadius: 10,
  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
}));

const PaymentForm: React.FC = () => {
  const [formData, setFormData] = useState({
    amount: '',
    referenceNumber: '',
    date: new Date().toISOString().slice(0, 10), // Default to today
    image: '',
    description: '',
    modeOfPayment: 'UPI',
  });

  const [imageFile, setImageFile] = useState<File | null>(null); // Handle image upload

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setImageFile(e.target.files[0]); // Get the selected file
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Create form data to send via POST, including the image if uploaded
    const data = new FormData();
    data.append('amount', formData.amount);
    data.append('referenceNumber', formData.referenceNumber);
    data.append('date', formData.date);
    data.append('description', formData.description);
    data.append('modeOfPayment', formData.modeOfPayment);

    if (imageFile) {
      data.append('image', imageFile);
    }

    try {
      const response = await axios.post(`${BASE_URL}/expence`, data, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      Swal.fire({
        icon: 'success',
        title: 'Payment Submitted',
        text: 'Your payment has been submitted successfully!',
      });
    } catch (error) {
      // Show error alert using SweetAlert
      Swal.fire({
        icon: 'error',
        title: 'Payment Failed',
        text: 'There was an error submitting your payment.',
      });
    }
  };

  return (
    <PaymentFormContainer elevation={3}>
      <Typography variant="h5" component="h2" gutterBottom align="center">
        Payment Form
      </Typography>

      <form onSubmit={handleSubmit}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <TextField
              label="Amount"
              name="amount"
              type="number"
              value={formData.amount}
              onChange={handleChange}
              fullWidth
              required
              variant="outlined"
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              label="Reference Number (Optional)"
              name="referenceNumber"
              value={formData.referenceNumber}
              onChange={handleChange}
              fullWidth
              variant="outlined"
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              label="Date"
              name="date"
              type="date"
              value={formData.date}
              onChange={handleChange}
              fullWidth
              variant="outlined"
              InputLabelProps={{
                shrink: true,
              }}
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              label="Image (Optional)"
              name="image"
              type="file"
              onChange={handleFileChange}
              fullWidth
              variant="outlined"
              InputLabelProps={{
                shrink: true,
              }}
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              label="Description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              fullWidth
              multiline
              rows={3}
              variant="outlined"
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              label="Mode of Payment"
              name="modeOfPayment"
              select
              value={formData.modeOfPayment}
              onChange={handleChange}
              fullWidth
              required
              variant="outlined"
            >
              <MenuItem value="UPI">UPI</MenuItem>
              <MenuItem value="Cash">Cash</MenuItem>
            </TextField>
          </Grid>

          <Grid item xs={12}>
            <Box textAlign="center">
              <Button type="submit" variant="contained" color="primary" size="large">
                Submit Payment
              </Button>
            </Box>
          </Grid>
        </Grid>
      </form>
    </PaymentFormContainer>
  );
};

export default PaymentForm;
