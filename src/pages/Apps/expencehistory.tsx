import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography, IconButton, Menu, MenuItem, Tooltip, Dialog, DialogActions, DialogContent, DialogTitle, TextField, Button, Input, Avatar } from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { BASE_URL } from '../Helper/handle-api';

// Utility function to format the date
const formatDate = (dateString: string): string => {
  const datePart = dateString.split('T')[0];
  const [year, month, day] = datePart.split('-');
  return `${day}/${month}/${year}`;
};

const ExpenceHistory: React.FC = () => {
  const [data, setData] = useState<any[]>([]);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedItem, setSelectedItem] = useState<any | null>(null);
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    amount: '',
    referenceNumber: '',
    date: '',
    description: '',
    modeOfPayment: 'UPI',
  });
  const [image, setImage] = useState<File | null>(null);
  const [openImageDialog, setOpenImageDialog] = useState(false); // State to control image dialog
  const [fullImage, setFullImage] = useState<string | null>(null); // Full-size image URL

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/expence`);
        setData(response.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  const handleClick = (event: React.MouseEvent<HTMLElement>, item: any) => {
    setAnchorEl(event.currentTarget);
    setSelectedItem(item);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleEdit = () => {
    if (selectedItem) {
      setFormData({
        amount: selectedItem.amount,
        referenceNumber: selectedItem.referenceNumber,
        date: new Date(selectedItem.date).toISOString().split('T')[0], // Format date
        description: selectedItem.description,
        modeOfPayment: selectedItem.modeOfPayment,
      });
      setOpen(true);
      handleClose();
    } else {
      console.error('No item selected for editing'); // Additional error check
    }
  };

  const handleDelete = async () => {
    if (selectedItem) {
      try {
        await axios.delete(`${BASE_URL}/expence/${selectedItem._id}`);
        setData(data.filter(item => item._id !== selectedItem._id));
        handleClose();
      } catch (error) {
        console.error('Error deleting item:', error);
      }
    } else {
      console.error('No item selected for deletion');
    }
  };

  const handleModalClose = () => {
    setOpen(false);
  };

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!selectedItem) {
      console.error('No item selected');
      return;
    }

    try {
      const formDataToSend = new FormData();
      formDataToSend.append('amount', formData.amount);
      formDataToSend.append('referenceNumber', formData.referenceNumber);
      formDataToSend.append('date', formData.date);
      formDataToSend.append('description', formData.description);
      formDataToSend.append('modeOfPayment', formData.modeOfPayment);

      // Append image if available
      if (image) {
        formDataToSend.append('image', image);
      }

      await axios.put(`${BASE_URL}/expence/${selectedItem._id}`, formDataToSend, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      // Update local state
      setData(data.map(item => item._id === selectedItem._id ? { ...item, ...formData } : item));

      handleModalClose();
    } catch (error) {
      console.error('Error updating item:', error);
    }
  };

  const handleImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedImage = e.target.files ? e.target.files[0] : null;
    setImage(selectedImage);
  };

  const handleAvatarClick = (imagePath: string) => {
    setFullImage(`${BASE_URL}/images/${imagePath}`);
    setOpenImageDialog(true);
  };

  const handleImageDialogClose = () => {
    setOpenImageDialog(false);
    setFullImage(null);
  };

  const payNow = () => {
      window.location.href = '/apps/expence';
  }
  return (
    <Paper style={{ padding: '20px' }}>
      <Typography variant="h6" component="h2" gutterBottom style={{display:"flex"}}>
        Expense History
        <Button variant="contained" color="primary" style={{marginLeft:"auto"}} onClick={payNow}>Pay Now</Button>
      </Typography>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>REC.NO</TableCell>
              <TableCell>Amount</TableCell>
              <TableCell>Date</TableCell>
              <TableCell>Description</TableCell>
              <TableCell>Image</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.map((item) => (
              <TableRow key={item._id}>
                <TableCell>{item.receiptNumber}</TableCell>
                <TableCell>{item.amount}</TableCell>
                <TableCell>{formatDate(item.date)}</TableCell>
                <TableCell>{item.description}</TableCell>
                <TableCell>
                  <Avatar
                    src={`${BASE_URL}/images/${item.image}`}
                    alt="Expense Image"
                    style={{ cursor: 'pointer' }}
                    onClick={() => handleAvatarClick(item.image)} // Show full image on click
                  />
                </TableCell>
                <TableCell>
                  <Tooltip title="Actions">
                    <IconButton onClick={(e) => handleClick(e, item)}>
                      <MoreVertIcon />
                    </IconButton>
                  </Tooltip>
                  <Menu
                    anchorEl={anchorEl}
                    open={Boolean(anchorEl) && selectedItem === item}
                    onClose={handleClose}
                  >
                    <MenuItem onClick={handleEdit} disabled={!selectedItem}>Edit</MenuItem>
                    <MenuItem onClick={handleDelete} disabled={!selectedItem}>Delete</MenuItem>
                  </Menu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Full-size Image Dialog */}
      <Dialog open={openImageDialog} onClose={handleImageDialogClose}>
        {/* <DialogTitle>Full Image</DialogTitle> */}
        <DialogContent>
          {fullImage && <img src={fullImage} alt="Full-size" style={{ width: '100%' }} />}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleImageDialogClose}>Close</Button>
        </DialogActions>
      </Dialog>

      {/* Edit Modal */}
      <Dialog open={open} onClose={handleModalClose}>
        <DialogTitle>Edit Expense</DialogTitle>
        <DialogContent>
          <form onSubmit={handleFormSubmit}>
            <TextField
              margin="dense"
              label="Amount"
              type="number"
              name="amount"
              value={formData.amount}
              onChange={handleFormChange}
              fullWidth
              required
            />
            <TextField
              margin="dense"
              label="Reference Number"
              type="text"
              name="referenceNumber"
              value={formData.referenceNumber}
              onChange={handleFormChange}
              fullWidth
            />
            <TextField
              margin="dense"
              label="Date"
              type="date"
              name="date"
              value={formData.date}
              onChange={handleFormChange}
              fullWidth
              required
            />
            <TextField
              margin="dense"
              label="Description"
              type="text"
              name="description"
              value={formData.description}
              onChange={handleFormChange}
              fullWidth
              required
            />
            <TextField
              margin="dense"
              label="Mode of Payment"
              type="text"
              name="modeOfPayment"
              value={formData.modeOfPayment}
              onChange={handleFormChange}
              fullWidth
              required
            />
            <Input
              type="file"
              onChange={handleImage}
            />
            <DialogActions>
              <Button onClick={handleModalClose}>Cancel</Button>
              <Button type="submit" color="primary">Save</Button>
            </DialogActions>
          </form>
        </DialogContent>
      </Dialog>
    </Paper>
  );
};

export default ExpenceHistory;
