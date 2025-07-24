const categories = ['Shooting', 'Skating', 'Passing'];

function CategorySelector({ selectedCategory, onSelectCategory }) {
  return (
    <div className="category-selector">
      <h2 className="category-title">What do you want to improve today?</h2>
      <div className="category-btn-row">
        {categories.map(category => (
          <button
            key={category}
            onClick={() => onSelectCategory(category)}
            className={`category-btn${selectedCategory === category ? ' selected' : ''}`}
          >
            {category}
          </button>
        ))}
      </div>
    </div>
  );
}

export default CategorySelector;
