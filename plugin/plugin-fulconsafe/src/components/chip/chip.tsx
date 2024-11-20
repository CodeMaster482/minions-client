import React from 'react';
import { Chip, Box } from '@mui/material';
import { getCategoryLabel, getCategoryColor, getTextColor } from '../../lib/categoriesMap';

type CategoryChipsProps = {
  categories: string[];
};

const CategoryChips: React.FC<CategoryChipsProps> = ({ categories }) => {
  return (
    <Box sx={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
      {categories.map((category, index) => {
        const bgColor = getCategoryColor(category);
        const txtColor = getTextColor(bgColor);

        return (
          <Chip
            size="small"
            key={index}
            label={getCategoryLabel(category, 'en')}
            variant="filled"
            sx={{
              margin: '2px',
              backgroundColor: bgColor,
              color: txtColor,
            }}
          />
        );
      })}
    </Box>
  );
};

export default CategoryChips;
