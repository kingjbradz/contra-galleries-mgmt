import { useState } from 'react';
import { Button } from '@mui/material';
import Modal from '../ui/Modal';
import ArtistForm from './ArtistForm';

export default function AddArtistButton({
  onArtistCreated,
}: {
  onArtistCreated: () => void;
}) {
  const [open, setOpen] = useState(false);

  return (
    <div>
      <Button variant="outlined" onClick={() => setOpen(true)}>
        Add Artist
      </Button>
      <Modal
        open={open}
        onClose={() => setOpen(false)}
        title="Add Artist"
      >
        <ArtistForm onSuccess={() => {
          setOpen(false)
          onArtistCreated()
          }} />
      </Modal>
    </div>
  );
}