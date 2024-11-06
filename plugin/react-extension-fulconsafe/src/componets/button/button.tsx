import * as React from 'react';
import BaseButton, { ButtonProps } from '@mui/material/Button'; // Imported as BaseButton

type CustomButtonProps = ButtonProps & { label?: string };

const Button = React.forwardRef<HTMLButtonElement, CustomButtonProps>(function Button(
  { label = "Send", ...props },
  ref,
) {
  return (
    <BaseButton {...props} ref={ref}>  {/* Using BaseButton from MUI */}
      {label}
    </BaseButton>
  );
});

export default Button;
