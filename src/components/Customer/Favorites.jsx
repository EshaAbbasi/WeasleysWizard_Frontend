import { useState, useEffect } from "react";
import customerService from "../../services/customerService";

const Favorites = () => {
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    customerService
      .getMyFavorites()
      .then(setFavorites)
      .catch(() => setFavorites([]));
  }, []);

  return (
    <div>
      <h2>My Favorites ({favorites.length})</h2>
      {favorites.map((fav) => (
        <div key={fav.id}>Product #{fav.product_id}</div>
      ))}
    </div>
  );
};

export default Favorites;
