import React, { useState, useEffect } from 'react';
import {
  Container,
  Paper,
  TextField,
  Button,
  List,
  ListItem,
  ListItemText,
  IconButton,
  Typography,
  Box,
  Alert,
  Snackbar,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Card,
  CardContent,
  Divider,
  Stack
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import ContactPhoneIcon from '@mui/icons-material/ContactPhone';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Cancel';

export default function PhonebookApp() {
  const [contacts, setContacts] = useState([]);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [deleteDialog, setDeleteDialog] = useState({ open: false, contactId: null });
  const [editingId, setEditingId] = useState(null);
  const [editName, setEditName] = useState('');
  const [editPhone, setEditPhone] = useState('');

  // Load contacts from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem('phonebook_contacts');
    if (stored) {
      try {
        setContacts(JSON.parse(stored));
      } catch (e) {
        console.error('Error loading contacts:', e);
      }
    }
  }, []);

  // Save contacts to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('phonebook_contacts', JSON.stringify(contacts));
  }, [contacts]);

  const handleAddContact = (e) => {
    e.preventDefault();
    
    if (!name.trim() || !phone.trim()) {
      setSnackbar({
        open: true,
        message: 'Please fill in both name and phone number',
        severity: 'error'
      });
      return;
    }

    const newContact = {
      id: Date.now(),
      name: name.trim(),
      phone: phone.trim()
    };

    setContacts([...contacts, newContact]);
    setName('');
    setPhone('');
    setSnackbar({
      open: true,
      message: 'Contact added successfully!',
      severity: 'success'
    });
  };

  const handleDeleteClick = (id) => {
    setDeleteDialog({ open: true, contactId: id });
  };

  const handleDeleteConfirm = () => {
    setContacts(contacts.filter(c => c.id !== deleteDialog.contactId));
    setSnackbar({
      open: true,
      message: 'Contact deleted successfully',
      severity: 'info'
    });
    setDeleteDialog({ open: false, contactId: null });
  };

  const handleDeleteCancel = () => {
    setDeleteDialog({ open: false, contactId: null });
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const handleEditClick = (contact) => {
    setEditingId(contact.id);
    setEditName(contact.name);
    setEditPhone(contact.phone);
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditName('');
    setEditPhone('');
  };

  const handleSaveEdit = (id) => {
    if (!editName.trim() || !editPhone.trim()) {
      setSnackbar({
        open: true,
        message: 'Please fill in both name and phone number',
        severity: 'error'
      });
      return;
    }

    setContacts(contacts.map(c => 
      c.id === id ? { ...c, name: editName.trim(), phone: editPhone.trim() } : c
    ));
    setEditingId(null);
    setEditName('');
    setEditPhone('');
    setSnackbar({
      open: true,
      message: 'Contact updated successfully!',
      severity: 'success'
    });
  };

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Box sx={{ textAlign: 'center', mb: 4 }}>
        <ContactPhoneIcon sx={{ fontSize: 60, color: 'primary.main', mb: 2 }} />
        <Typography variant="h3" component="h1" gutterBottom fontWeight="bold">
          Phonebook
        </Typography>
        <Typography variant="subtitle1" color="text.secondary">
          Manage your contacts easily
        </Typography>
      </Box>

      {/* Add Contact Form */}
      <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
        <Typography variant="h5" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
          <PersonAddIcon /> Add New Contact
        </Typography>
        <Box component="form" onSubmit={handleAddContact}>
          <Stack spacing={2}>
            <TextField
              fullWidth
              label="Name"
              variant="outlined"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
            <TextField
              fullWidth
              label="Phone Number"
              variant="outlined"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
              type="tel"
            />
            <Button
              type="submit"
              variant="contained"
              size="large"
              fullWidth
              startIcon={<PersonAddIcon />}
            >
              Add Contact
            </Button>
          </Stack>
        </Box>
      </Paper>

      {/* Contacts List */}
      <Paper elevation={3} sx={{ p: 3 }}>
        <Typography variant="h5" gutterBottom>
          My Contacts ({contacts.length})
        </Typography>
        <Divider sx={{ mb: 2 }} />
        
        {contacts.length === 0 ? (
          <Card sx={{ bgcolor: 'grey.50', textAlign: 'center', py: 6 }}>
            <CardContent>
              <ContactPhoneIcon sx={{ fontSize: 80, color: 'grey.400', mb: 2 }} />
              <Typography variant="h6" color="text.secondary">
                No contacts yet
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Add your first contact using the form above
              </Typography>
            </CardContent>
          </Card>
        ) : (
          <List>
            {contacts.map((contact, index) => (
              <React.Fragment key={contact.id}>
                <ListItem
                  sx={{
                    bgcolor: 'background.paper',
                    '&:hover': { bgcolor: 'action.hover' },
                    borderRadius: 1,
                    mb: 1,
                    flexDirection: 'column',
                    alignItems: 'stretch'
                  }}
                >
                  {editingId === contact.id ? (
                    <Box sx={{ width: '100%' }}>
                      <Stack spacing={2} sx={{ mb: 2 }}>
                        <TextField
                          fullWidth
                          size="small"
                          value={editName}
                          onChange={(e) => setEditName(e.target.value)}
                          label="Name"
                        />
                        <TextField
                          fullWidth
                          size="small"
                          value={editPhone}
                          onChange={(e) => setEditPhone(e.target.value)}
                          label="Phone"
                          type="tel"
                        />
                      </Stack>
                      <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end' }}>
                        <Button
                          size="small"
                          variant="contained"
                          color="success"
                          startIcon={<SaveIcon />}
                          onClick={() => handleSaveEdit(contact.id)}
                        >
                          Save
                        </Button>
                        <Button
                          size="small"
                          variant="outlined"
                          startIcon={<CancelIcon />}
                          onClick={handleCancelEdit}
                        >
                          Cancel
                        </Button>
                      </Box>
                    </Box>
                  ) : (
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
                      <ListItemText
                        primary={contact.name}
                        secondary={contact.phone}
                        primaryTypographyProps={{ variant: 'h6', fontWeight: 500 }}
                        secondaryTypographyProps={{ variant: 'body1' }}
                      />
                      <Box>
                        <IconButton
                          edge="end"
                          aria-label="edit"
                          onClick={() => handleEditClick(contact)}
                          color="primary"
                        >
                          <EditIcon />
                        </IconButton>
                        <IconButton
                          edge="end"
                          aria-label="delete"
                          onClick={() => handleDeleteClick(contact.id)}
                          color="error"
                        >
                          <DeleteIcon />
                        </IconButton>
                      </Box>
                    </Box>
                  )}
                </ListItem>
                {index < contacts.length - 1 && <Divider />}
              </React.Fragment>
            ))}
          </List>
        )}
      </Paper>

      {/* Success/Error Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialog.open}
        onClose={handleDeleteCancel}
      >
        <DialogTitle>Delete Contact?</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this contact? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteCancel}>Cancel</Button>
          <Button onClick={handleDeleteConfirm} color="error" variant="contained">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}