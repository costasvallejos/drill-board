import CategorySelector from '../components/CategorySelector';

export default function Home() {
    const [selectedCategory, setSelectedCategory] = useState(null);
  
    return (
      <div style={{ padding: '1rem' }}>
        <CategorySelector
          selectedCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
        />
  
        {selectedCategory ? (
          <p>You selected: <strong>{selectedCategory}</strong></p>
        ) : (
          <p>Please select a category to see drills.</p>
        )}
  
        {/* Drill list and visualization will go here later */}
      </div>
    );
  }