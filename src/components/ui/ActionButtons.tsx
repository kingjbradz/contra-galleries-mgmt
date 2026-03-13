'use client'
import React from "react";
import { Button } from "@mui/material";
import { useRouter } from "next/navigation";
import ModalButton from "@/components/ui/ModalButton";
import DeleteConfirmation, { DeleteableType } from "@/components/ui/DeleteConfirmation";

interface ActionButtonsProps {
  showViewButton?: boolean;
  viewPath?: string;
  editForm: React.ReactElement; // The Form component (e.g., <EditArtistForm />)
  editLoadFunction?: () => Promise<void>;
  deleteAction: () => Promise<{ success?: boolean; error?: string }>;
  deleteType: DeleteableType;
  itemName: string | undefined;
  redirectPath?: string; // Where to go after a delete (optional)
  
}

export default function ActionButtons({ 
  showViewButton,
  viewPath,
  editForm, 
  deleteAction, 
  deleteType, 
  itemName,
  redirectPath,
  editLoadFunction
}: ActionButtonsProps) {
  const router = useRouter();

  const handleEditSuccess = () => {
    if (editLoadFunction) {
      editLoadFunction() // need to rework to be server only
    } else {
      router.refresh()
    }
  }

  const handleDeleteSuccess = () => {
    if (redirectPath) {
      router.push(redirectPath);
    } else {
      window.location.reload(); // need to rework to server only, back to router.refresh()
    }
  };

  return (
    <>
    {/* VIEW */}
      {showViewButton && 
       <Button onClick={() => router.push(`${viewPath}`)}>
       View
     </Button>
      }
      {/* EDIT */}
      <ModalButton label="Edit" title={`Edit ${itemName}`} variant="text" buttonProps={{ color: "secondary" }}>
        {(close) => (
          // We clone the element to pass the close/onSuccess props automatically
          React.cloneElement(editForm as React.ReactElement<any>, {
            onSuccess: () => {
              close();
              handleEditSuccess()
            }
          })
        )}
      </ModalButton>

      {/* DELETE */}
      <ModalButton label="Delete" title={`Delete ${itemName}`} variant="text" buttonProps={{color: "error"}}>
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