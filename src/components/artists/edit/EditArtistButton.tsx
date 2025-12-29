import { useState } from 'react';
import { Button } from '@mui/material';
import Modal from '../../ui/Modal';
import EditArtistForm from './EditArtistForm';
import { Artist } from '@/app/(protected)/artists/page';

export default function EditArtistButton({
  artist,
  onArtistEdited,
}: {
  artist: Artist,
  onArtistEdited: () => void;
}) {
  const [open, setOpen] = useState(false);

  return (
    <div>
      <Button variant="outlined" onClick={() => setOpen(true)}>
        Edit Artist
      </Button>
      <Modal
        open={open}
        onClose={() => setOpen(false)}
        title="Edit Artist"
      >
        <EditArtistForm artist={artist} onSuccess={() => {
          setOpen(false)
          onArtistEdited()
          }} />
      </Modal>
    </div>
  );
}