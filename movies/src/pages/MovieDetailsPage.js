import React from 'react';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { useParams } from 'react-router-dom';

const MovieDetailsPage = () => {
  const { movieId } = useParams();
  return (
    <Container>
      <Typography variant="h4">Movie Details for ID: {movieId}</Typography>
    </Container>
  );
};
export default MovieDetailsPage;