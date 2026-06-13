
type Filter = "all" | "active" | "completed";

interface FilterBarProps {
  filter: Filter;
  onFilterChange: (filter: Filter) => void;
  sortOrder: string;
  onSortChange: (value: string) => void;
}

function FilterBar({
  filter,
  onFilterChange,
  sortOrder,
  onSortChange,
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
        id="sort-order"
        value={sortOrder}
        onChange={(e) => onSortChange(e.target.value)}
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
    </div>
  );
}

export default FilterBar;

