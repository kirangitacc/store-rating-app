import { useEffect, useState ,useCallback} from 'react';
import Header from '../Header';
import './index.css';

const StoreListings = () => {
  const [search, setSearch] = useState({ name: '', address: '' });
  const [stores, setStores] = useState([]);
  const [ratingInput, setRatingInput] = useState({});
  const [editingRating, setEditingRating] = useState({});
  const token = localStorage.getItem('jwt_token');

  
const fetchStores = useCallback(async () => {
  try {
    const res = await fetch(
      `http://localhost:5000/stores/search?name=${search.name}&address=${search.address}`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    const data = await res.json();
    setStores(data);
  } catch (error) {
    console.error('Error fetching stores:', error);
  }
}, [search.name, search.address, token]);

useEffect(() => {
  fetchStores(); // ✅ No more lint warning
}, [fetchStores]);

  const handleRatingChange = (storeId, value) => {
    setRatingInput((prev) => ({ ...prev, [storeId]: value }));
  };

  const submitRating = async (storeId) => {
    const rating = ratingInput[storeId];
    if (!rating || rating < 1 || rating > 5) {
      alert('Please enter a rating between 1 and 5');
      return;
    }

    try {
      await fetch('http://localhost:5000/ratings', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ storeId, rating }),
      });

      alert('Rating submitted!');
      setRatingInput((prev) => ({ ...prev, [storeId]: '' }));
      setEditingRating((prev) => ({ ...prev, [storeId]: false }));

      await fetchStores(); // ✅ Refresh store list after rating
    } catch (error) {
      console.error('Error submitting rating:', error);
    }
  };

  const toggleEditing = (storeId) => {
    setEditingRating((prev) => ({ ...prev, [storeId]: !prev[storeId] }));
  };

  return (
      <div className="store-listings">
        <Header />
        <main className="store-content">
          <h2>Store Listings</h2>

          <div className="search-bar">
            <input
              type="text"
              placeholder="Name"
              value={search.name}
              onChange={(e) =>
                setSearch({ ...search, name: e.target.value })
              }
            />
            <input
              type="text"
              placeholder="Address"
              value={search.address}
              onChange={(e) =>
                setSearch({ ...search, address: e.target.value })
              }
            />
          </div>

          <div className="store-grid">
            {Array.isArray(stores) && stores.length > 0 ? (
              stores.map((store) => (
                <div key={store.id} className="store-card">
                  <h3>{store.name}</h3>
                  <p><strong>Address:</strong> {store.address}</p>
                  <p><strong>Overall Rating:</strong> ⭐ {store.average_rating ?? 'N/A'} / 5</p>
                  <p><strong>Your Rating:</strong> {store.user_rating ? `${store.user_rating} / 5` : 'Not submitted'}</p>

                  {editingRating[store.id] ? (
                    <>
                      <input
                        type="number"
                        min="1"
                        max="5"
                        placeholder="Rate 1–5"
                        value={ratingInput[store.id] || ''}
                        onChange={(e) =>
                        handleRatingChange(store.id, Number(e.target.value))
                        }
                      />
                      <button onClick={() => submitRating(store.id)}>Submit</button>
                      <button onClick={() => toggleEditing(store.id)}>Cancel</button>
                    </>
                  ) : (
                    <button onClick={() => toggleEditing(store.id)}>
                      {store.user_rating ? 'Modify Rating' : 'Submit Rating'}
                    </button>
                  )}
                </div>
              ))
            ) : (
              <p>No stores available.</p>
            )}
          </div>
        </main>
      </div>
  );
};

export default StoreListings;
