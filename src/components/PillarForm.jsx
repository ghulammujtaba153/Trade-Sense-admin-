import React, { useEffect, useState } from 'react';
import { Button, TextField, Chip } from '@mui/material';
import axios from 'axios';
import { API_URL } from '../config/url';

const PillarForm = ({ onClose, fetchData, editData }) => {
  const [name, setName] = useState('');
  const [categories, setCategories] = useState([]);
  const [categoryInput, setCategoryInput] = useState('');

  useEffect(() => {
    if (editData) {
      setName(editData.name);
      setCategories(editData.categories);
    }
  }, [editData]);

  const handleAddCategory = () => {
    if (categoryInput && !categories.includes(categoryInput)) {
      setCategories([...categories, categoryInput]);
      setCategoryInput('');
    }
  };

  const handleSubmit = async () => {
    const payload = { name, categories };
    try {
      if (editData) {
        await axios.put(`${API_URL}/api/pillars/categories/${editData._id}`, payload);
      } else {
        await axios.post(`${API_URL}/api/pillars/categories`, payload);
      }
      fetchData();
      onClose();
    } catch (error) {
      console.error(error);
    }
  };

  const handleDeleteCategory = (cat) => {
    setCategories(categories.filter(c => c !== cat));
  };

  return (
    <div className="space-y-4">
      <TextField
        label="Pillar Name"
        fullWidth
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <div className="flex gap-2">
        <TextField
          label="Add Category"
          value={categoryInput}
          onChange={(e) => setCategoryInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleAddCategory()}
        />
        <Button onClick={handleAddCategory} variant="outlined">Add</Button>
      </div>
      <div className="flex flex-wrap gap-2">
        {categories.map((cat, idx) => (
          <Chip
            key={idx}
            label={cat}
            onDelete={() => handleDeleteCategory(cat)}
          />
        ))}
      </div>
      <div className="pt-4 text-right">
        <Button onClick={onClose} className="mr-2">Cancel</Button>
        <Button variant="contained" onClick={handleSubmit}>
          {editData ? 'Update' : 'Add'}
        </Button>
      </div>
    </div>
  );
};

export default PillarForm;
