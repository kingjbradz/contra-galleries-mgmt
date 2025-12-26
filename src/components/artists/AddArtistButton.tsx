import { useState } from 'react';
import { Button } from '@mui/material';
import AddArtistDialog from './AddArtistDialog';

export default function AddArtistButton() {
  const [open, setOpen] = useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = (value: string) => {
    setOpen(false);
  };

  return (
    <div>
      <Button variant="outlined" onClick={handleClickOpen}>
        Add Artist
      </Button>
      <AddArtistDialog
        open={open}
        onClose={handleClose}
      />
    </div>
  );
}