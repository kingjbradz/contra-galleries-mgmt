import { Dialog, DialogContent, DialogTitle } from '@mui/material';
import ArtistForm from './ArtistForm';

export interface DialogProps {
  open: boolean;
  // selectedValue: string;
  onClose: (value: string) => void;
}

export default function AddArtistDialog(props: DialogProps) {
  const { onClose, open } = props;

  const handleClose = () => {
    // refreshArtist
  };

  return (
    <Dialog onClose={handleClose} open={open}>
      <DialogTitle>Add Artist</DialogTitle>
      <DialogContent>
        <ArtistForm />
      </DialogContent>
    </Dialog>
  );
}