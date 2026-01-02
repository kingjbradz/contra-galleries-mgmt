import { useState } from 'react';
import { Button } from '@mui/material';
import Modal from '../../ui/Modal';
import AddArtworkForm from './AddArtworkForm';

export default function AddArtworkButton({
  onArtworkCreated,
}: {
  onArtworkCreated: () => void;
}) {
  const [open, setOpen] = useState(false);

  return (
    <div>
      <Button variant="outlined" onClick={() => setOpen(true)}>
        Add Artwork
      </Button>
      <Modal
        open={open}
        onClose={() => setOpen(false)}
        title="Add Artwork"
      >
        <AddArtworkForm onSuccess={() => {
          setOpen(false)
          onArtworkCreated()
          }} />
      </Modal>
    </div>
  );
}