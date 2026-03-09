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
  // editLoadFunction: () => void;
  deleteAction: () => Promise<{ success?: boolean; error?: string }>;
  deleteType: DeleteableType;
  itemName: string;
  redirectPath?: string; // Where to go after a delete (optional)
}

export default function ActionButtons({ 
  showViewButton,
  viewPath,
  editForm, 
  deleteAction, 
  deleteType, 
  itemName,
  redirectPath 
}: ActionButtonsProps) {
  const router = useRouter();

  const handleDeleteSuccess = () => {
    if (redirectPath) {
      router.push(redirectPath);
    } else {
      router.refresh(); // Refresh the current server component data
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
      <ModalButton label="Edit" title={`Edit ${itemName}`} variant="text">
        {(close) => (
          // We clone the element to pass the close/onSuccess props automatically
          React.cloneElement(editForm as React.ReactElement<any>, {
            onSuccess: () => {
              close();
              router.refresh();
            }
          })
        )}
      </ModalButton>

      {/* DELETE */}
      <ModalButton label="Delete" title={`Delete ${itemName}`} variant="text">
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