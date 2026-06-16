
type Filter = "all" | "active" | "completed";

interface FilterBarProps {
  filter: Filter;
  onFilterChange: (filter: Filter) => void;
  sortOrder: string;
  onSortChange: (value: string) => void;

  searchText?: string;
  onSearchChange?: (value: string) => void;
  onClearSearch?: () => void;

  isSearching?: boolean;

  // Challenge 12
  categoryFilter?: string;
  onCategoryFilterChange?: (
    category: string
  ) => void;
  categories?: string[];
}

function FilterBar({
  filter,
  onFilterChange,
  sortOrder,
  onSortChange,
  searchText = "",
  onSearchChange,
  onClearSearch,
  isSearching = false,
  categoryFilter = "",
  onCategoryFilterChange,
  categories = [],
}: FilterBarProps) {
  return (
    <div id="filter-bar">
      <button
        data-active={filter === "all"}
        onClick={() => onFilterChange("all")}
      >
        All
      </button>

      <button
        data-active={filter === "active"}
        onClick={() => onFilterChange("active")}
      >
        Active
      </button>

      <button
        data-active={filter === "completed"}
        onClick={() => onFilterChange("completed")}
      >
        Completed
      </button>

      <select
        id="category-filter"
        value={categoryFilter}
        onChange={(e) =>
          onCategoryFilterChange?.(
            e.target.value
          )
        }
      >
        <option value="">
          All categories
        </option>

        {categories.map((category) => (
          <option
            key={category}
            value={category}
          >
            {category}
          </option>
        ))}
      </select>

      <select
        id="sort-order"
        value={sortOrder}
        onChange={(e) =>
          onSortChange(e.target.value)
        }
      >
        <option value="recent">
          Recently Added
        </option>

        <option value="high">
          Priority: High to Low
        </option>

        <option value="low">
          Priority: Low to High
        </option>

        <option value="alphabetical">
          Alphabetical
        </option>
      </select>

      <input
        id="search-input"
        type="text"
        placeholder="Search tasks..."
        value={searchText}
        onChange={(e) =>
          onSearchChange?.(e.target.value)
        }
      />

      {isSearching && (
        <div id="searching-indicator">
          Searching...
        </div>
      )}

      {searchText.trim() !== "" && (
        <button
          id="clear-search"
          type="button"
          onClick={() => onClearSearch?.()}
        >
          Clear search
        </button>
      )}
    </div>
  );
}

export default FilterBar;
