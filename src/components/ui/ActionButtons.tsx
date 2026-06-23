'use client'
import React from "react";
import { Button } from "@mui/material";
import { useRouter } from "next/navigation";
import ModalButton from "@/components/ui/ModalButton";
import DeleteConfirmation, { DeleteableType } from "@/components/ui/DeleteConfirmation";
import VisibilityIcon from '@mui/icons-material/Visibility';
import EditIcon from '@mui/icons-material/Edit';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';

interface ActionButtonsProps {
  viewPath?: string;
  editForm?: React.ReactElement; // The Form component (e.g., <EditArtistForm />)
  deleteAction: () => Promise<{ success?: boolean; error?: string }>;
  deleteType: DeleteableType;
  itemName: string | undefined;
  redirectPath?: string; // Where to go after a delete (optional)
}

export default function ActionButtons({ 
  viewPath,
  editForm, 
  deleteAction, 
  deleteType, 
  itemName,
  redirectPath,
}: ActionButtonsProps) {
  const router = useRouter();

  const handleDeleteSuccess = () => {
    if (redirectPath) {
      router.push(redirectPath);
    } else {
      router.refresh(); // need to rework to server only, back to router.refresh()
    }
  };

  return (
    <>
    {/* VIEW */}
      {viewPath && 
       <Button onClick={() => router.push(`${viewPath}`)} endIcon={<VisibilityIcon />} sx={{ mr: 1 }} size="small">
       View
     </Button>
      }
      {/* EDIT */}
      {editForm && <ModalButton label="Edit" title={`Edit ${itemName}`} variant="text" buttonProps={{ color: "secondary", endIcon: <EditIcon />, sx: { mr: 1 }, size: "small" }}>
        {(close) => (
          // We clone the element to pass the close/onSuccess props automatically
          React.cloneElement(editForm as React.ReactElement<Record<string, unknown>>, {
            onSuccess: () => {
              close();
              router.refresh()
            }
          })
        )}
      </ModalButton>}

      {/* DELETE */}
      <ModalButton label="Delete" title={`Delete ${itemName}`} variant="text" buttonProps={{color: "error", endIcon: <DeleteForeverIcon />, size: "small"}}>
        {(close) => (
          <DeleteConfirmation
            type={deleteType}
            action={deleteAction}
            onSuccess={() => {
              close();
              handleDeleteSuccess();
            }}
          />
        )}
      </ModalButton>
    </>
  );
}