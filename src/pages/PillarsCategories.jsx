import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Button,
  Container,
  Dialog,
  DialogTitle,
  DialogContent,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
} from '@mui/material';
import { Edit, Delete } from '@mui/icons-material';
import { API_URL } from '../config/url';
import PageLoader from '../components/PageLoader';
import PillarForm from '../components/PillarForm';


const PillarsCategories = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [editData, setEditData] = useState(null);

  const fetchData = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/pillars/categories`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      setData(res.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleClose = () => {
    setOpen(false);
    setEditData(null);
  };

  const handleEdit = (row) => {
    setEditData(row);
    setOpen(true);
  };

  const handleDelete = async (id) => {
    await axios.delete(`${API_URL}/api/pillars/categories/${id}`);
    fetchData();
  };

  if (loading) return <PageLoader />;

  return (
    <Container>
      <div className="flex justify-between items-center py-4">
        <Typography variant="h5">Pillars & Categories</Typography>
        <Button variant="contained" onClick={() => setOpen(true)}>
          + Add Pillar
        </Button>
      </div>

      <TableContainer component={Paper}>
        <Table aria-label="Pillars table">
          <TableHead>
            <TableRow>
              <TableCell><strong>Name</strong></TableCell>
              <TableCell><strong>Categories</strong></TableCell>
              <TableCell align="right"><strong>Actions</strong></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.map((row) => (
              <TableRow key={row._id}>
                <TableCell>{row.name}</TableCell>
                <TableCell>{row.categories.join(', ')}</TableCell>
                <TableCell align="right">
                  <IconButton onClick={() => handleEdit(row)} color="primary">
                    <Edit />
                  </IconButton>
                  <IconButton onClick={() => handleDelete(row._id)} color="error">
                    <Delete />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
            {data.length === 0 && (
              <TableRow>
                <TableCell colSpan={3} align="center">
                  No pillars found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
        <DialogTitle>{editData ? 'Update Pillar' : 'Add New Pillar'}</DialogTitle>
        <DialogContent>
          <PillarForm
            onClose={handleClose}
            fetchData={fetchData}
            editData={editData}
          />
        </DialogContent>
      </Dialog>
    </Container>
  );
};

export default PillarsCategories;
