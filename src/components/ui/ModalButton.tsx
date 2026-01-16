import { useState, ReactNode } from 'react';
import { Button, ButtonProps } from '@mui/material';
import Modal from './Modal';

interface ModalButtonProps {
  label: string;
  title: string;
  buttonProps?: ButtonProps; // Allows you to customize variant, color, etc.
  children: (closeModal: () => void) => ReactNode; // Render prop pattern
  variant?: ButtonProps['variant']
}

export default function ModalButton({
  label,
  title,
  buttonProps,
  children,
  variant = "outlined"
}: ModalButtonProps) {
  const [open, setOpen] = useState(false);

  const handleClose = () => setOpen(false);

  return (
    <>
      <Button 
        variant={variant}
        {...buttonProps} 
        onClick={() => setOpen(true)}
      >
        {label}
      </Button>
      
      <Modal 
        open={open} 
        onClose={handleClose} 
        title={title}
      >
        {/* We pass handleClose so the form inside can close the modal */}
        {children(handleClose)}
      </Modal>
    </>
  );
}