import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Select, MenuItem, TextField } from '@mui/material';
import { API_URL } from '../config/url';
import AddResource from '../components/minfulResources/AddResource';
import ViewResourceModal from "../components/minfulResources/ViewResource"
import { toast } from 'react-toastify';
import { FaEye, FaPen, FaRegTrashAlt } from "react-icons/fa";

const MindFulResources = () => {
  const [resources, setResources] = useState([]);
  const [filters, setFilters] = useState({
    type: '',
    category: '',
    search: ''
  });
  const [showModal, setShowModal] = useState(false);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [selectedResource, setSelectedResource] = useState(null);

  const fetchResources = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/resources`); 
      setResources(res.data);
    } catch (error) {
      console.error('Error fetching resources', error);
    }
  };

  useEffect(() => {
    fetchResources();
  }, []);

  const handleDelete =async(id) =>{
    try{
      const res =await axios.delete(`${API_URL}/api/resources/${id}`);
      console.log(res.data)
      fetchResources();
      toast.success("Deleted successfully")
    }catch (error){
      toast.error("Error", error)
    }
  }

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const filteredResources = resources.filter((res) => {
    const matchesType = filters.type ? res.type === filters.type : true;
    const matchesCategory = filters.category ? res.category === filters.category : true;
    const matchesSearch = filters.search
      ? res.title.toLowerCase().includes(filters.search.toLowerCase())
      : true;

    return matchesType && matchesCategory && matchesSearch;
  });

  

  return (
    <div className="p-4">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-semibold">Mindful Resources</h2>
        <button onClick={() => setShowModal(true)} className="bg-primary hover:scale-105 trnasition-transform text-white px-4 py-2 rounded-lg transition">
          Add Resource
        </button>
      </div>

      {showModal && (
        <AddResource
          onClose={() => setShowModal(false)}
          onSuccess={() => {
            setShowModal(false);
            setSelectedResource(null);
            fetchResources(); // reload your data table
          }}
          resource={selectedResource}
        />
      )}

      {
        viewModalOpen && (
          <ViewResourceModal
            open={viewModalOpen}
            onClose={() => {setViewModalOpen(false); setSelectedResource(null)}}
            resource={selectedResource}
          />
        )
      }

      {/* Filters */}
      <div className="flex flex-wrap gap-4 mb-4">
        <TextField
          label="Search by Title"
          variant="outlined"
          size="small"
          value={filters.search}
          onChange={(e) => handleFilterChange('search', e.target.value)}
        />
        <Select
          displayEmpty
          value={filters.type}
          onChange={(e) => handleFilterChange('type', e.target.value)}
          size="small"
        >
          <MenuItem value="">All Types</MenuItem>
          <MenuItem value="audio">Audio</MenuItem>
          <MenuItem value="video">Video</MenuItem>
        </Select>
        <Select
          displayEmpty
          value={filters.category}
          onChange={(e) => handleFilterChange('category', e.target.value)}
          size="small"
        >
          <MenuItem value="">All Categories</MenuItem>
          <MenuItem value="meditation">Meditation</MenuItem>
          <MenuItem value="motivation">Motivation</MenuItem>
          <MenuItem value="affirmation">Affirmation</MenuItem>
          <MenuItem value="breathing">Breathing</MenuItem>
          <MenuItem value="focus">Focus</MenuItem>
          <MenuItem value="stress-relief">Stress Relief</MenuItem>
        </Select>
      </div>

      {/* Table */}
      <TableContainer component={Paper} className="rounded-lg shadow-md">
        <Table>

        <TableHead>
  <TableRow className="bg-gray-100">
    <TableCell>Title</TableCell>
    <TableCell>Type</TableCell>
    <TableCell>Category</TableCell>
    <TableCell>Tags</TableCell>
    <TableCell>Duration (s)</TableCell>
    <TableCell>Premium</TableCell>
    <TableCell align="center">Actions</TableCell> {/* 👈 New column */}
  </TableRow>
</TableHead>
<TableBody>
  {filteredResources.map((res) => (
    <TableRow key={res._id}>
      <TableCell>{res.title}</TableCell>
      <TableCell>{res.type}</TableCell>
      <TableCell>{res.category}</TableCell>
      <TableCell>{res.tags.join(', ')}</TableCell>
      <TableCell>{res.duration}</TableCell>
      <TableCell>{res.isPremium ? 'Yes' : 'No'}</TableCell>
      <TableCell align="center">
        {/* 👇 Action Buttons */}
        <button
          onClick={() => {
            setSelectedResource(res);
            setViewModalOpen(true);
          }}
          className="text-blue-600 hover:underline mr-2"
        >
          <FaEye />
        </button>
        <button
          onClick={() => {setSelectedResource(res); setShowModal(true);}}
          className="text-yellow-600 hover:underline mr-2"
        >
          <FaPen />
        </button>
        <button
          onClick={() => handleDelete(res._id)}
          className="text-red-600 hover:underline"
        >
          <FaRegTrashAlt />
        </button>
      </TableCell>
    </TableRow>
  ))}
  {filteredResources.length === 0 && (
    <TableRow>
      <TableCell colSpan={7} align="center" className="text-gray-500 py-4">
        No resources found.
      </TableCell>
    </TableRow>
  )}
</TableBody>

          
          
        </Table>
      </TableContainer>
    </div>
  );
};

export default MindFulResources;
