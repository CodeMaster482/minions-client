import * as React from 'react';
import {useDispatch} from 'react-redux'
import Button from '@mui/material/Button';
import SendIcon from '@mui/icons-material/Send';

export default function ContainedButton() {
  const dispatch = useDispatch();

  return (
      <Button variant="contained" size='small' type='submit' endIcon={<SendIcon />}>Send</Button>
  );
}