// src/components/TrailerModal.js
import React from "react";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

const TrailerModal = ({ open, handleClose, trailerKey, title }) => {
  // Stop video when closing modal by resetting src (optional but good practice)
  const onClose = () => {
    handleClose(); // Call the parent's close handler
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          bgcolor: "black", // Dark background for the modal itself
          overflow: "visible", // Allow close button to potentially overlap slightly if needed
        },
      }}
    >
      <IconButton
        aria-label="close"
        onClick={onClose}
        sx={{
          position: "absolute",
          right: 8,
          top: 8,
          color: (theme) => theme.palette.grey[500],
          zIndex: 1, // Ensure it's above video
          bgcolor: "rgba(0,0,0,0.5)",
          "&:hover": {
            bgcolor: "rgba(0,0,0,0.7)",
          },
        }}
      >
        <CloseIcon />
      </IconButton>
      <DialogContent
        sx={{
          p: 0,
          overflow: "hidden",
          position: "relative",
          aspectRatio: "16/9",
        }}
      >
        {trailerKey ? (
          <Box
            component="iframe"
            sx={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              border: "none",
            }}
            src={`https://www.youtube.com/embed/${trailerKey}?autoplay=1&rel=0`} // Autoplay, don't show related videos
            title={`${title} Trailer`}
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        ) : (
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              height: "300px",
            }}
          >
            <Typography color="error">Trailer not available.</Typography>
          </Box>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default TrailerModal;
