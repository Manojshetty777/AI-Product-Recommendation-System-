from flask import Flask, request, jsonify
from flask_cors import CORS
import numpy as np
from sklearn.metrics.pairwise import cosine_similarity

app = Flask(__name__)
CORS(app)

# -------------------- PRODUCTS --------------------

PRODUCTS = [

    # Electronics
    {"id":1,"name":"Sony WH-1000XM5","category":"Electronics","price":399,"rating":4.8,"reviews":12400,"tags":["headphones","wireless","sony"]},
    {"id":2,"name":"Apple AirPods Pro","category":"Electronics","price":249,"rating":4.7,"reviews":89300,"tags":["earbuds","apple"]},
    {"id":3,"name":"JBL Flip 6","category":"Electronics","price":129,"rating":4.6,"reviews":21000,"tags":["speaker","bluetooth"]},

    # Computers
    {"id":4,"name":"MacBook Pro M3","category":"Computers","price":1999,"rating":4.9,"reviews":5600,"tags":["laptop","apple"]},
    {"id":5,"name":"Dell XPS 15","category":"Computers","price":1699,"rating":4.6,"reviews":3400,"tags":["laptop","windows"]},

    # TVs
    {"id":6,"name":"Samsung 55 4K OLED","category":"TVs","price":1299,"rating":4.7,"reviews":8200,"tags":["tv","4k","oled"]},
    {"id":7,"name":"LG C3 OLED 65","category":"TVs","price":1799,"rating":4.8,"reviews":6700,"tags":["tv","gaming"]},

    # Phones
    {"id":8,"name":"iPhone 15 Pro","category":"Phones","price":999,"rating":4.8,"reviews":45600,"tags":["apple","smartphone"]},
    {"id":9,"name":"Samsung Galaxy S24","category":"Phones","price":899,"rating":4.7,"reviews":32100,"tags":["android"]},

    # Tablets
    {"id":10,"name":"iPad Pro M2","category":"Tablets","price":1099,"rating":4.8,"reviews":9800,"tags":["tablet","apple"]},
    {"id":11,"name":"Samsung Galaxy Tab S9","category":"Tablets","price":799,"rating":4.6,"reviews":5400,"tags":["tablet","android"]},

    # Cameras
    {"id":12,"name":"Sony A7 IV","category":"Cameras","price":2499,"rating":4.9,"reviews":3300,"tags":["camera","mirrorless"]},
    {"id":13,"name":"Canon EOS R6","category":"Cameras","price":2199,"rating":4.8,"reviews":2900,"tags":["camera","dslr"]},

    # Gaming
    {"id":14,"name":"PlayStation 5","category":"Gaming","price":499,"rating":4.8,"reviews":31200,"tags":["console"]},
    {"id":15,"name":"Xbox Series X","category":"Gaming","price":499,"rating":4.7,"reviews":28600,"tags":["console"]},

    # Home
    {"id":16,"name":"Dyson V15 Detect","category":"Home","price":749,"rating":4.6,"reviews":12100,"tags":["vacuum"]},
    {"id":17,"name":"Instant Pot Pro","category":"Home","price":149,"rating":4.7,"reviews":54300,"tags":["kitchen"]},

    # Smart Home
    {"id":18,"name":"Amazon Echo Dot","category":"Smart Home","price":49,"rating":4.5,"reviews":89000,"tags":["alexa"]},
    {"id":19,"name":"Google Nest Hub","category":"Smart Home","price":99,"rating":4.6,"reviews":21000,"tags":["google"]},
]

# -------------------- BUILD SIMILARITY MATRIX --------------------

def build_features():
    categories = list(set(p["category"] for p in PRODUCTS))
    features = []

    for p in PRODUCTS:
        row = [1 if p["category"] == c else 0 for c in categories]
        row.append(p["price"] / 2500)   # normalize price
        row.append(p["rating"] / 5.0)  # normalize rating
        features.append(row)

    return np.array(features)

FEATURE_MATRIX = build_features()
SIM_MATRIX = cosine_similarity(FEATURE_MATRIX)

# -------------------- ROUTES --------------------

@app.route("/api/products")
def get_products():
    category = request.args.get("category", "All")
    search = request.args.get("search", "").lower()

    filtered = PRODUCTS

    if category != "All":
        filtered = [p for p in filtered if p["category"] == category]

    if search:
        filtered = [
            p for p in filtered
            if search in p["name"].lower()
            or any(search in tag for tag in p["tags"])
        ]

    return jsonify({"products": filtered})

@app.route("/api/recommend/similar/<int:pid>")
def similar(pid):
    idx = next((i for i, p in enumerate(PRODUCTS) if p["id"] == pid), None)

    if idx is None:
        return jsonify({"recommendations": []})

    scores = list(enumerate(SIM_MATRIX[idx]))
    scores.sort(key=lambda x: x[1], reverse=True)

    recs = [PRODUCTS[i] for i, _ in scores if PRODUCTS[i]["id"] != pid][:6]

    return jsonify({"recommendations": recs})

@app.route("/api/recommend/trending")
def trending():
    sorted_p = sorted(PRODUCTS, key=lambda p: p["reviews"] * p["rating"], reverse=True)
    return jsonify({"recommendations": sorted_p[:6]})

@app.route("/api/recommend/deals")
def deals():
    sorted_p = sorted(PRODUCTS, key=lambda p: p["rating"] / p["price"], reverse=True)
    return jsonify({"recommendations": sorted_p[:6]})

# -------------------- RUN --------------------

if __name__ == "__main__":
    print("🚀 Backend running on http://localhost:5000")
    app.run(debug=True, port=5000)