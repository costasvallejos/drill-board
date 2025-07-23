const categories = ['Shooting', 'Skating', 'Passing'];

function CategorySelector({ selectedCategory, onSelectCategory }) {
  return (
    <div style={{ marginBottom: '1rem' }}>
      <h2>What do you want to improve today?</h2>
      <div style={{ display: 'flex', gap: '1rem' }}>
        {categories.map(category => (
          <button
            key={category}
            onClick={() => onSelectCategory(category)}
            style={{
              padding: '0.5rem 1rem',
              cursor: 'pointer',
              border: selectedCategory === category ? '2px solid #0077cc' : '1px solid #ccc',
              backgroundColor: selectedCategory === category ? '#e0f0ff' : '#fff',
              borderRadius: '4px',
              fontWeight: selectedCategory === category ? 'bold' : 'normal',
            }}
          >
            {category}
          </button>
        ))}
      </div>
    </div>
  );
}

export default CategorySelector;
