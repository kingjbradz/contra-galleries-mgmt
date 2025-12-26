import { ReactNode } from "react";
import { Box, Dialog, DialogTitle, DialogContent, IconButton } from "@mui/material";
import CloseIcon from '@mui/icons-material/Close';

type DialogProps = {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
};

export default function Modal({
  open,
  onClose,
  title,
  children,
}: DialogProps) {
  return (
      <Dialog open={open} onClose={onClose}>
        <Box sx={{ display: "flex", justifyContent: "space-between"}}>
        {title ? <DialogTitle>{title}</DialogTitle> : <></>}
        <IconButton aria-label="close" color="inherit" onClick={onClose}>
          <CloseIcon />
        </IconButton>
        </Box>
        <DialogContent>{children}</DialogContent>
      </Dialog>
  );
}