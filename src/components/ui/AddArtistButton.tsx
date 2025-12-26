import { useState } from 'react';
import { Button, Dialog, DialogTitle } from '@mui/material';

const emails = ['username@gmail.com', 'user02@gmail.com'];

export interface DialogProps {
  open: boolean;
  selectedValue: string;
  onClose: (value: string) => void;
}

function AddArtistDialog(props: DialogProps) {
  const { onClose, selectedValue, open } = props;

  const handleClose = () => {
    onClose(selectedValue);
  };

  return (
    <Dialog onClose={handleClose} open={open}>
      <DialogTitle>Add Artist</DialogTitle>

    </Dialog>
  );
}

export default function AddArtistButton() {
  const [open, setOpen] = useState(false);
  const [selectedValue, setSelectedValue] = useState(emails[1]);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = (value: string) => {
    setOpen(false);
    setSelectedValue(value);
  };

  return (
    <div>
      <Button variant="outlined" onClick={handleClickOpen}>
        Add Artist
      </Button>
      <AddArtistDialog
        selectedValue={selectedValue}
        open={open}
        onClose={handleClose}
      />
    </div>
  );
}