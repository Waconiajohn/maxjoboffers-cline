import React from 'react';
import { Chip, Stack } from '@mui/material';
import { resourceCategories, resourceTypes } from '../../mocks/resourcesAndEvents';

interface FilterChipsProps {
  selectedTypes: string[];
  selectedCategories: string[];
  onTypeChange: (types: string[]) => void;
  onCategoryChange: (categories: string[]) => void;
}

export const FilterChips: React.FC<FilterChipsProps> = ({
  selectedTypes,
  selectedCategories,
  onTypeChange,
  onCategoryChange
}) => {
  const handleTypeToggle = (type: string) => {
    if (selectedTypes.includes(type)) {
      onTypeChange(selectedTypes.filter(t => t !== type));
    } else {
      onTypeChange([...selectedTypes, type]);
    }
  };

  const handleCategoryToggle = (category: string) => {
    if (selectedCategories.includes(category)) {
      onCategoryChange(selectedCategories.filter(c => c !== category));
    } else {
      onCategoryChange([...selectedCategories, category]);
    }
  };

  return (
    <Stack direction="row" spacing={1} flexWrap="wrap" gap={1}>
      {resourceTypes.map((type) => (
        <Chip
          key={type}
          label={type}
          clickable
          color={selectedTypes.includes(type) ? 'primary' : 'default'}
          onClick={() => handleTypeToggle(type)}
          variant={selectedTypes.includes(type) ? 'filled' : 'outlined'}
        />
      ))}
      {resourceCategories.map((category) => (
        <Chip
          key={category}
          label={category}
          clickable
          color={selectedCategories.includes(category) ? 'secondary' : 'default'}
          onClick={() => handleCategoryToggle(category)}
          variant={selectedCategories.includes(category) ? 'filled' : 'outlined'}
        />
      ))}
    </Stack>
  );
};
