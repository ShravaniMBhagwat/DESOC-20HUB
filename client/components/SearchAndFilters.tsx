import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Search, Filter, X, Star, Clock, Users, DollarSign } from 'lucide-react';
import { categories, levels, sortOptions } from '@/data/workshops';

interface SearchAndFiltersProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  selectedCategory: string;
  setSelectedCategory: (category: string) => void;
  selectedLevel: string;
  setSelectedLevel: (level: string) => void;
  priceRange: [number, number];
  setPriceRange: (range: [number, number]) => void;
  minRating: number;
  setMinRating: (rating: number) => void;
  sortBy: string;
  setSortBy: (sort: string) => void;
  showFilters: boolean;
  setShowFilters: (show: boolean) => void;
  onlyFeatured: boolean;
  setOnlyFeatured: (featured: boolean) => void;
  onlyWithCertificate: boolean;
  setOnlyWithCertificate: (cert: boolean) => void;
  clearFilters: () => void;
}

export function SearchAndFilters({
  searchTerm,
  setSearchTerm,
  selectedCategory,
  setSelectedCategory,
  selectedLevel,
  setSelectedLevel,
  priceRange,
  setPriceRange,
  minRating,
  setMinRating,
  sortBy,
  setSortBy,
  showFilters,
  setShowFilters,
  onlyFeatured,
  setOnlyFeatured,
  onlyWithCertificate,
  setOnlyWithCertificate,
  clearFilters
}: SearchAndFiltersProps) {
  const [activeFiltersCount, setActiveFiltersCount] = useState(0);

  // Count active filters
  const getActiveFiltersCount = () => {
    let count = 0;
    if (selectedCategory !== 'All Categories') count++;
    if (selectedLevel !== 'All Levels') count++;
    if (priceRange[0] > 0 || priceRange[1] < 200) count++;
    if (minRating > 0) count++;
    if (onlyFeatured) count++;
    if (onlyWithCertificate) count++;
    return count;
  };

  return (
    <div className="space-y-4">
      {/* Search Bar and Main Controls */}
      <Card className="professional-card">
        <CardContent className="p-4">
          <div className="flex flex-col lg:flex-row gap-4 items-center">
            {/* Search Input */}
            <div className="relative flex-1 w-full">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                type="text"
                placeholder="Search workshops, instructors, or topics..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 w-full"
              />
            </div>

            {/* Quick Filters */}
            <div className="flex flex-wrap gap-2">
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  {sortOptions.map((option) => (
                    <SelectItem key={option} value={option}>
                      {option}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Button
                variant="outline"
                onClick={() => setShowFilters(!showFilters)}
                className="relative"
              >
                <Filter className="w-4 h-4 mr-2" />
                Filters
                {getActiveFiltersCount() > 0 && (
                  <Badge 
                    className="absolute -top-2 -right-2 h-5 w-5 p-0 text-xs bg-brand text-white"
                  >
                    {getActiveFiltersCount()}
                  </Badge>
                )}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Advanced Filters Panel */}
      {showFilters && (
        <Card className="professional-card">
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Level Filter */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Difficulty Level</label>
                <Select value={selectedLevel} onValueChange={setSelectedLevel}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select level" />
                  </SelectTrigger>
                  <SelectContent>
                    {levels.map((level) => (
                      <SelectItem key={level} value={level}>
                        {level}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Price Range */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">
                  Price Range: ${priceRange[0]} - ${priceRange[1]}
                </label>
                <Slider
                  value={priceRange}
                  onValueChange={(value) => setPriceRange(value as [number, number])}
                  max={200}
                  min={0}
                  step={10}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-gray-500">
                  <span>$0</span>
                  <span>$200+</span>
                </div>
              </div>

              {/* Rating Filter */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Minimum Rating</label>
                <div className="flex items-center space-x-2">
                  {[0, 3, 4, 4.5].map((rating) => (
                    <Button
                      key={rating}
                      variant={minRating === rating ? "default" : "outline"}
                      size="sm"
                      onClick={() => setMinRating(rating)}
                      className="flex items-center space-x-1"
                    >
                      <Star className="w-3 h-3" />
                      <span>{rating === 0 ? 'Any' : `${rating}+`}</span>
                    </Button>
                  ))}
                </div>
              </div>

              {/* Additional Filters */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Additional Options</label>
                <div className="space-y-2">
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={onlyFeatured}
                      onChange={(e) => setOnlyFeatured(e.target.checked)}
                      className="rounded border-gray-300"
                    />
                    <span className="text-sm">Featured only</span>
                  </label>
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={onlyWithCertificate}
                      onChange={(e) => setOnlyWithCertificate(e.target.checked)}
                      className="rounded border-gray-300"
                    />
                    <span className="text-sm">With certificate</span>
                  </label>
                </div>
              </div>
            </div>

            {/* Active Filters & Clear Button */}
            <div className="mt-6 flex items-center justify-between">
              <div className="flex flex-wrap gap-2">
                {selectedCategory !== 'All Categories' && (
                  <Badge variant="secondary" className="flex items-center gap-1">
                    {selectedCategory}
                    <X 
                      className="w-3 h-3 cursor-pointer" 
                      onClick={() => setSelectedCategory('All Categories')}
                    />
                  </Badge>
                )}
                {selectedLevel !== 'All Levels' && (
                  <Badge variant="secondary" className="flex items-center gap-1">
                    {selectedLevel}
                    <X 
                      className="w-3 h-3 cursor-pointer" 
                      onClick={() => setSelectedLevel('All Levels')}
                    />
                  </Badge>
                )}
                {(priceRange[0] > 0 || priceRange[1] < 200) && (
                  <Badge variant="secondary" className="flex items-center gap-1">
                    ${priceRange[0]} - ${priceRange[1]}
                    <X 
                      className="w-3 h-3 cursor-pointer" 
                      onClick={() => setPriceRange([0, 200])}
                    />
                  </Badge>
                )}
                {minRating > 0 && (
                  <Badge variant="secondary" className="flex items-center gap-1">
                    <Star className="w-3 h-3" />
                    {minRating}+ rating
                    <X 
                      className="w-3 h-3 cursor-pointer" 
                      onClick={() => setMinRating(0)}
                    />
                  </Badge>
                )}
                {onlyFeatured && (
                  <Badge variant="secondary" className="flex items-center gap-1">
                    Featured
                    <X 
                      className="w-3 h-3 cursor-pointer" 
                      onClick={() => setOnlyFeatured(false)}
                    />
                  </Badge>
                )}
                {onlyWithCertificate && (
                  <Badge variant="secondary" className="flex items-center gap-1">
                    Certificate
                    <X 
                      className="w-3 h-3 cursor-pointer" 
                      onClick={() => setOnlyWithCertificate(false)}
                    />
                  </Badge>
                )}
              </div>

              {getActiveFiltersCount() > 0 && (
                <Button variant="outline" size="sm" onClick={clearFilters}>
                  Clear All Filters
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
