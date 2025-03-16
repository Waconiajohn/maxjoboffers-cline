import React, { useState } from 'react';
import {
  Box,
  Typography,
  TextField,
  Slider,
  FormControl,
  FormGroup,
  FormControlLabel,
  Checkbox,
  Chip,
  Button,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  InputAdornment,
  Select,
  MenuItem,
  SelectChangeEvent
} from '@mui/material';
import {
  ExpandMore as ExpandMoreIcon,
  Search as SearchIcon,
  LocationOn as LocationIcon,
  AttachMoney as AttachMoneyIcon,
  Work as WorkIcon,
  FilterList as FilterListIcon,
  Clear as ClearIcon
} from '@mui/icons-material';
import { JobSearchFilters as JobSearchFiltersType } from '../../types/jobSearch';

interface JobSearchFiltersProps {
  filters: JobSearchFiltersType;
  onFilterChange: (filters: JobSearchFiltersType) => void;
  onSearch: () => void;
  onClear: () => void;
}

const employmentTypeOptions = [
  { value: 'FULL_TIME', label: 'Full-time' },
  { value: 'PART_TIME', label: 'Part-time' },
  { value: 'CONTRACTOR', label: 'Contractor' },
  { value: 'TEMPORARY', label: 'Temporary' },
  { value: 'INTERN', label: 'Intern' },
  { value: 'VOLUNTEER', label: 'Volunteer' },
  { value: 'PER_DIEM', label: 'Per diem' }
];

const experienceLevelOptions = [
  { value: 'entry', label: 'Entry level' },
  { value: 'mid', label: 'Mid level' },
  { value: 'senior', label: 'Senior level' },
  { value: 'executive', label: 'Executive' }
];

const industryOptions = [
  { value: 'Technology', label: 'Technology' },
  { value: 'Healthcare', label: 'Healthcare' },
  { value: 'Finance', label: 'Finance' },
  { value: 'Education', label: 'Education' },
  { value: 'Retail', label: 'Retail' },
  { value: 'Manufacturing', label: 'Manufacturing' },
  { value: 'Design', label: 'Design' },
  { value: 'Marketing', label: 'Marketing' }
];

export const JobSearchFilters: React.FC<JobSearchFiltersProps> = ({
  filters,
  onFilterChange,
  onSearch,
  onClear
}) => {
  const [expanded, setExpanded] = useState<string | false>('panel1');
  const [salaryRange, setSalaryRange] = useState<[number, number]>([
    filters.salary?.min || 0,
    filters.salary?.max || 200000
  ]);
  const [skill, setSkill] = useState<string>('');

  const handleAccordionChange = (panel: string) => (
    _event: React.SyntheticEvent,
    isExpanded: boolean
  ) => {
    setExpanded(isExpanded ? panel : false);
  };

  const handleQueryChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    onFilterChange({
      ...filters,
      query: event.target.value
    });
  };

  const handleLocationChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    onFilterChange({
      ...filters,
      location: event.target.value
    });
  };

  const handleRadiusChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    onFilterChange({
      ...filters,
      radius: Number(event.target.value)
    });
  };

  const handleRemoteChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    onFilterChange({
      ...filters,
      remote: event.target.checked
    });
  };

  const handleDatePostedChange = (event: SelectChangeEvent) => {
    onFilterChange({
      ...filters,
      datePosted: event.target.value as any
    });
  };

  const handleEmploymentTypeChange = (value: string) => {
    const currentTypes = filters.employmentTypes || [];
    const newTypes = currentTypes.includes(value)
      ? currentTypes.filter(type => type !== value)
      : [...currentTypes, value];

    onFilterChange({
      ...filters,
      employmentTypes: newTypes
    });
  };

  const handleExperienceLevelChange = (value: string) => {
    const currentLevels = filters.experienceLevels || [];
    const newLevels = currentLevels.includes(value)
      ? currentLevels.filter(level => level !== value)
      : [...currentLevels, value];

    onFilterChange({
      ...filters,
      experienceLevels: newLevels
    });
  };

  const handleIndustryChange = (value: string) => {
    const currentIndustries = filters.industries || [];
    const newIndustries = currentIndustries.includes(value)
      ? currentIndustries.filter(industry => industry !== value)
      : [...currentIndustries, value];

    onFilterChange({
      ...filters,
      industries: newIndustries
    });
  };

  const handleSalaryChange = (_event: Event, newValue: number | number[]) => {
    const [min, max] = newValue as number[];
    setSalaryRange([min, max]);
  };

  const handleSalaryChangeCommitted = (_event: Event, newValue: number | number[]) => {
    const [min, max] = newValue as number[];
    onFilterChange({
      ...filters,
      salary: {
        min,
        max
      }
    });
  };

  const handleAddSkill = () => {
    if (skill && skill.trim() !== '') {
      const currentSkills = filters.skills || [];
      if (!currentSkills.includes(skill)) {
        onFilterChange({
          ...filters,
          skills: [...currentSkills, skill]
        });
      }
      setSkill('');
    }
  };

  const handleRemoveSkill = (skillToRemove: string) => {
    const currentSkills = filters.skills || [];
    onFilterChange({
      ...filters,
      skills: currentSkills.filter(s => s !== skillToRemove)
    });
  };

  const handleSkillKeyPress = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      handleAddSkill();
    }
  };

  return (
    <Box sx={{ width: '100%', mb: 3 }}>
      <Box sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
        <TextField
          fullWidth
          placeholder="Job title, keywords, or company"
          value={filters.query}
          onChange={handleQueryChange}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            )
          }}
          sx={{ flexGrow: 1 }}
        />
        <Button
          variant="contained"
          color="primary"
          onClick={onSearch}
          sx={{ height: '56px', minWidth: '120px' }}
        >
          Search
        </Button>
      </Box>

      <Box sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
        <TextField
          placeholder="Location"
          value={filters.location || ''}
          onChange={handleLocationChange}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <LocationIcon />
              </InputAdornment>
            )
          }}
          sx={{ flexGrow: 1 }}
        />
        <TextField
          type="number"
          label="Radius (miles)"
          value={filters.radius || ''}
          onChange={handleRadiusChange}
          InputProps={{ inputProps: { min: 0, max: 100 } }}
          sx={{ width: '150px' }}
        />
        <FormControlLabel
          control={
            <Checkbox
              checked={filters.remote || false}
              onChange={handleRemoteChange}
            />
          }
          label="Remote only"
        />
      </Box>

      <Box sx={{ mb: 2 }}>
        <Typography variant="subtitle1" gutterBottom>
          <FilterListIcon sx={{ verticalAlign: 'middle', mr: 1 }} />
          Filters
        </Typography>
        
        <Accordion
          expanded={expanded === 'panel1'}
          onChange={handleAccordionChange('panel1')}
        >
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography>Date Posted</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <FormControl fullWidth>
              <Select
                value={filters.datePosted || 'anytime'}
                onChange={handleDatePostedChange}
              >
                <MenuItem value="anytime">Anytime</MenuItem>
                <MenuItem value="past24Hours">Past 24 hours</MenuItem>
                <MenuItem value="past3Days">Past 3 days</MenuItem>
                <MenuItem value="pastWeek">Past week</MenuItem>
                <MenuItem value="pastMonth">Past month</MenuItem>
              </Select>
            </FormControl>
          </AccordionDetails>
        </Accordion>
        
        <Accordion
          expanded={expanded === 'panel2'}
          onChange={handleAccordionChange('panel2')}
        >
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography>Employment Type</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <FormGroup>
              {employmentTypeOptions.map(option => (
                <FormControlLabel
                  key={option.value}
                  control={
                    <Checkbox
                      checked={(filters.employmentTypes || []).includes(option.value)}
                      onChange={() => handleEmploymentTypeChange(option.value)}
                    />
                  }
                  label={option.label}
                />
              ))}
            </FormGroup>
          </AccordionDetails>
        </Accordion>
        
        <Accordion
          expanded={expanded === 'panel3'}
          onChange={handleAccordionChange('panel3')}
        >
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography>Experience Level</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <FormGroup>
              {experienceLevelOptions.map(option => (
                <FormControlLabel
                  key={option.value}
                  control={
                    <Checkbox
                      checked={(filters.experienceLevels || []).includes(option.value)}
                      onChange={() => handleExperienceLevelChange(option.value)}
                    />
                  }
                  label={option.label}
                />
              ))}
            </FormGroup>
          </AccordionDetails>
        </Accordion>
        
        <Accordion
          expanded={expanded === 'panel4'}
          onChange={handleAccordionChange('panel4')}
        >
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography>Salary Range</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Box sx={{ px: 2 }}>
              <Slider
                value={salaryRange}
                onChange={handleSalaryChange}
                onChangeCommitted={handleSalaryChangeCommitted}
                valueLabelDisplay="on"
                min={0}
                max={200000}
                step={5000}
                valueLabelFormat={value => `$${value.toLocaleString()}`}
              />
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
                <Typography variant="body2" color="text.secondary">
                  ${salaryRange[0].toLocaleString()}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  ${salaryRange[1].toLocaleString()}
                </Typography>
              </Box>
            </Box>
          </AccordionDetails>
        </Accordion>
        
        <Accordion
          expanded={expanded === 'panel5'}
          onChange={handleAccordionChange('panel5')}
        >
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography>Industry</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <FormGroup>
              {industryOptions.map(option => (
                <FormControlLabel
                  key={option.value}
                  control={
                    <Checkbox
                      checked={(filters.industries || []).includes(option.value)}
                      onChange={() => handleIndustryChange(option.value)}
                    />
                  }
                  label={option.label}
                />
              ))}
            </FormGroup>
          </AccordionDetails>
        </Accordion>
        
        <Accordion
          expanded={expanded === 'panel6'}
          onChange={handleAccordionChange('panel6')}
        >
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography>Skills</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Box sx={{ mb: 2 }}>
              <TextField
                fullWidth
                placeholder="Add a skill"
                value={skill}
                onChange={(e) => setSkill(e.target.value)}
                onKeyPress={handleSkillKeyPress}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <Button onClick={handleAddSkill}>Add</Button>
                    </InputAdornment>
                  )
                }}
              />
            </Box>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              {(filters.skills || []).map(skill => (
                <Chip
                  key={skill}
                  label={skill}
                  onDelete={() => handleRemoveSkill(skill)}
                />
              ))}
            </Box>
          </AccordionDetails>
        </Accordion>
      </Box>

      <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
        <Button
          variant="outlined"
          color="secondary"
          onClick={onClear}
          startIcon={<ClearIcon />}
        >
          Clear Filters
        </Button>
      </Box>
    </Box>
  );
};
