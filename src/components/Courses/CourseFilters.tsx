
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface CourseFiltersProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  selectedDifficulty: string;
  onDifficultyChange: (value: string) => void;
  selectedCategory: string;
  onCategoryChange: (value: string) => void;
  categories: Array<{ id: string; name: string; }> | undefined;
}

const CourseFilters = ({
  searchTerm,
  onSearchChange,
  selectedDifficulty,
  onDifficultyChange,
  selectedCategory,
  onCategoryChange,
  categories
}: CourseFiltersProps) => {
  const { t } = useTranslation('courses');
  
  return (
    <div className="mb-8 grid grid-cols-1 md:grid-cols-3 gap-4">
      <div className="relative">
        <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
        <Input
          placeholder={t('filters.search')}
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-10"
        />
      </div>
      
      <Select value={selectedDifficulty} onValueChange={onDifficultyChange}>
        <SelectTrigger>
          <SelectValue placeholder={t('filters.difficulty.label')} />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">{t('filters.difficulty.all')}</SelectItem>
          <SelectItem value="beginner">{t('filters.difficulty.beginner')}</SelectItem>
          <SelectItem value="intermediate">{t('filters.difficulty.intermediate')}</SelectItem>
          <SelectItem value="advanced">{t('filters.difficulty.advanced')}</SelectItem>
        </SelectContent>
      </Select>

      <Select value={selectedCategory} onValueChange={onCategoryChange}>
        <SelectTrigger>
          <SelectValue placeholder={t('filters.category.label')} />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">{t('filters.category.all')}</SelectItem>
          {categories?.map((category) => (
            <SelectItem key={category.id} value={category.id}>
              {category.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default CourseFilters;
