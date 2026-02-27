import { useEffect, useState } from "react";

const API = "http://localhost:5000/api";

function App() {
  const [products, setProducts] = useState([]);
  const [category, setCategory] = useState("All");
  const [search, setSearch] = useState("");
  const [recommendations, setRecommendations] = useState([]);

  // =========================
  // LOAD PRODUCTS + AUTO RECOMMENDATIONS
  // =========================
  useEffect(() => {
    const loadData = async () => {
      try {
        const res = await fetch(
          `${API}/products?category=${category}&search=${search}`
        );
        const data = await res.json();

        setProducts(data.products);

        // Automatically load recommendations for selected category
        if (data.products.length > 0) {
          const firstProduct = data.products[0];

          const recRes = await fetch(
            `${API}/recommend/similar/${firstProduct.id}`
          );
          const recData = await recRes.json();

          setRecommendations([...recData.recommendations]);
        } else {
          setRecommendations([]);
        }
      } catch (err) {
        console.error(err);
      }
    };

    loadData();
  }, [category, search]);

  // =========================
  // RECOMMENDATION BUTTONS
  // =========================

  const fetchTrending = async () => {
    try {
      const res = await fetch(`${API}/recommend/trending`);
      const data = await res.json();
      setRecommendations([...data.recommendations]);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchDeals = async () => {
    try {
      const res = await fetch(`${API}/recommend/deals`);
      const data = await res.json();
      setRecommendations([...data.recommendations]);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchSimilar = async (id) => {
    try {
      const res = await fetch(`${API}/recommend/similar/${id}`);
      const data = await res.json();
      setRecommendations([...data.recommendations]);
    } catch (err) {
      console.error(err);
    }
  };

  const toINR = (price) =>
    `₹${(price * 84).toLocaleString("en-IN")}`;

  const categories = [
    "All",
    "Electronics",
    "Computers",
    "TVs",
    "Phones",
    "Tablets",
    "Cameras",
    "Gaming",
    "Home",
    "Smart Home"
  ];

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>AI Product Recommendation</h1>
      <p style={styles.subtitle}>Smart recommendations at your fingertips</p>

      {/* Search */}
      <div style={styles.searchWrapper}>
        <input
          style={styles.searchInput}
          placeholder="Search products..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* Category Buttons */}
      <div style={styles.buttonRow}>
        {categories.map((c) => (
          <button
            key={c}
            style={category === c ? styles.activeBtn : styles.btn}
            onClick={() => setCategory(c)}
          >
            {c}
          </button>
        ))}
      </div>

      {/* Action Buttons */}
      <div style={styles.buttonRow}>
        <button style={styles.btn} onClick={fetchTrending}>
          Trending
        </button>
        <button style={styles.btn} onClick={fetchDeals}>
          Best Deals
        </button>
      </div>

      {/* Products Grid */}
      <div style={styles.grid}>
        {products.map((p) => (
          <div key={p.id} style={styles.card}>
            <h3>{p.name}</h3>
            <p>{p.category}</p>
            <p>{toINR(p.price)}</p>
            <p>⭐ {p.rating}</p>
            <button
              style={styles.smallBtn}
              onClick={() => fetchSimilar(p.id)}
            >
              Similar
            </button>
          </div>
        ))}
      </div>

      {/* Recommendations Section */}
      <h2 style={{ marginTop: 60, textAlign: "center" }}>
        Recommendations
      </h2>

      {recommendations.length === 0 ? (
        <p style={{ opacity: 0.6, textAlign: "center" }}>
          Recommendations will appear automatically
        </p>
      ) : (
        <div style={styles.grid}>
          {recommendations.map((r) => (
            <div key={r.id} style={styles.card}>
              <h3>{r.name}</h3>
              <p>{r.category}</p>
              <p>{toINR(r.price)}</p>
              <p>⭐ {r.rating}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

const styles = {
  container: {
    minHeight: "100vh",
    padding: 40,
    background: "linear-gradient(135deg,#0f172a,#1e3a8a)",
    color: "white",
    fontFamily: "Segoe UI"
  },
  title: {
    textAlign: "center",
    fontSize: 42,
    marginBottom: 5
  },
  subtitle: {
    textAlign: "center",
    opacity: 0.7,
    marginBottom: 40
  },
  searchWrapper: {
    display: "flex",
    justifyContent: "center",
    marginBottom: 30
  },
  searchInput: {
    width: "60%",
    padding: 16,
    borderRadius: 40,
    border: "none",
    outline: "none",
    fontSize: 16,
    background: "rgba(255,255,255,0.15)",
    color: "white"
  },
  buttonRow: {
    textAlign: "center",
    marginBottom: 20
  },
  btn: {
    margin: 8,
    padding: "10px 20px",
    borderRadius: 30,
    border: "none",
    background: "rgba(255,255,255,0.2)",
    color: "white",
    cursor: "pointer"
  },
  activeBtn: {
    margin: 8,
    padding: "10px 20px",
    borderRadius: 30,
    border: "none",
    background: "white",
    color: "#1e3a8a",
    cursor: "pointer"
  },
  smallBtn: {
    marginTop: 10,
    padding: "6px 14px",
    borderRadius: 20,
    border: "none",
    background: "white",
    color: "#1e3a8a",
    cursor: "pointer"
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill,minmax(250px,1fr))",
    gap: 20,
    marginTop: 20
  },
  card: {
    background: "rgba(255,255,255,0.1)",
    padding: 20,
    borderRadius: 20,
    backdropFilter: "blur(10px)"
  }
};

export default App;