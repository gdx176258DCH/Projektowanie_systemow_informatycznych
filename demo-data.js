// Fictional demo records. Photos are illustrative Unsplash images, not these artists' work.
globalThis.ArtVintDemo = (() => {
  const data = {
  "version": 1,
  "artworks": [
    {
      "id": 1795168800000,
      "title": "Światło w pracowni",
      "author": "@marta_asp",
      "category": "Malarstwo",
      "technique": "Akryl na płótnie",
      "dimensions": "60 × 80 cm",
      "description": "Przykładowa oferta do prezentacji ArtVint. Światło w pracowni. Parametry i opis są fikcyjne, a zdjęcie z Unsplash służy wyłącznie jako ilustracja. W demonstracji możesz sprawdzić portfolio, negocjacje i zamówienia.",
      "price": 690,
      "negotiatedPrice": null,
      "negotiable": true,
      "custom": true,
      "framed": true,
      "unique": true,
      "verification": {
        "analysis": {
          "passed": true,
          "width": 700,
          "height": 467,
          "analyzedAt": "2026-11-20T10:00:00.000Z"
        },
        "approvedAt": "2026-11-20T11:00:00.000Z",
        "approvedBy": "@admin"
      },
      "placeholderImage": false,
      "likes": 12,
      "likedBy": [
        "@piotr_kolekcjoner"
      ],
      "sold": false,
      "image": "https://images.unsplash.com/photo-1544967082-d9d25d867d66?auto=format&fit=crop&w=700&h=467&q=80"
    },
    {
      "id": 1795168800001,
      "title": "Wazon z pracowni",
      "author": "@glina_w_ogniu",
      "category": "Ceramika i Szkło",
      "technique": "Ceramika szkliwiona",
      "dimensions": "25 × 14 cm",
      "description": "Przykładowa oferta do prezentacji ArtVint. Wazon z pracowni. Parametry i opis są fikcyjne, a zdjęcie z Unsplash służy wyłącznie jako ilustracja. W demonstracji możesz sprawdzić portfolio, negocjacje i zamówienia.",
      "price": 180,
      "negotiatedPrice": null,
      "negotiable": false,
      "custom": true,
      "framed": true,
      "unique": true,
      "verification": {
        "analysis": {
          "passed": true,
          "width": 700,
          "height": 467,
          "analyzedAt": "2026-11-20T10:00:00.000Z"
        },
        "approvedAt": "2026-11-20T11:00:00.000Z",
        "approvedBy": "@admin"
      },
      "placeholderImage": false,
      "likes": 11,
      "likedBy": [
        "@piotr_kolekcjoner"
      ],
      "sold": false,
      "image": "https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?auto=format&fit=crop&w=700&h=467&q=80"
    },
    {
      "id": 1795168800002,
      "title": "Kompozycja w błękicie",
      "author": "@marta_asp",
      "category": "Grafika i Linoryt",
      "technique": "Grafika warsztatowa",
      "dimensions": "30 × 40 cm",
      "description": "Przykładowa oferta do prezentacji ArtVint. Kompozycja w błękicie. Parametry i opis są fikcyjne, a zdjęcie z Unsplash służy wyłącznie jako ilustracja. W demonstracji możesz sprawdzić portfolio, negocjacje i zamówienia.",
      "price": 240,
      "negotiatedPrice": null,
      "negotiable": true,
      "custom": false,
      "framed": false,
      "unique": true,
      "verification": null,
      "placeholderImage": false,
      "likes": 10,
      "likedBy": [],
      "sold": false,
      "image": "https://images.unsplash.com/photo-1582555172866-f73bb12a2ab3?auto=format&fit=crop&w=700&h=467&q=80"
    },
    {
      "id": 1795168800003,
      "title": "Kadr z podróży",
      "author": "@piotr_kolekcjoner",
      "category": "Fotografia Analogowa",
      "technique": "Fotografia, odbitka na papierze",
      "dimensions": "40 × 60 cm",
      "description": "Przykładowa oferta do prezentacji ArtVint. Kadr z podróży. Parametry i opis są fikcyjne, a zdjęcie z Unsplash służy wyłącznie jako ilustracja. W demonstracji możesz sprawdzić portfolio, negocjacje i zamówienia.",
      "price": 320,
      "negotiatedPrice": null,
      "negotiable": true,
      "custom": false,
      "framed": true,
      "unique": false,
      "verification": {
        "analysis": {
          "passed": true,
          "width": 700,
          "height": 467,
          "analyzedAt": "2026-11-20T10:00:00.000Z"
        },
        "approvedAt": "2026-11-20T11:00:00.000Z",
        "approvedBy": "@admin"
      },
      "placeholderImage": false,
      "likes": 9,
      "likedBy": [],
      "sold": false,
      "image": "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=700&h=467&q=80"
    },
    {
      "id": 1795168800004,
      "title": "Forma ceramiczna",
      "author": "@glina_w_ogniu",
      "category": "Ceramika i Szkło",
      "technique": "Ręcznie formowana glina",
      "dimensions": "18 × 20 cm",
      "description": "Przykładowa oferta do prezentacji ArtVint. Forma ceramiczna. Parametry i opis są fikcyjne, a zdjęcie z Unsplash służy wyłącznie jako ilustracja. W demonstracji możesz sprawdzić portfolio, negocjacje i zamówienia.",
      "price": 210,
      "negotiatedPrice": null,
      "negotiable": false,
      "custom": true,
      "framed": true,
      "unique": true,
      "verification": {
        "analysis": {
          "passed": true,
          "width": 700,
          "height": 467,
          "analyzedAt": "2026-11-20T10:00:00.000Z"
        }
      },
      "placeholderImage": false,
      "likes": 8,
      "likedBy": [],
      "sold": false,
      "image": "https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?auto=format&fit=crop&w=700&h=467&q=80"
    },
    {
      "id": 1795168800005,
      "title": "Barwy miasta",
      "author": "@marta_asp",
      "category": "Plakat i Ilustracja",
      "technique": "Ilustracja na papierze",
      "dimensions": "A3",
      "description": "Przykładowa oferta do prezentacji ArtVint. Barwy miasta. Parametry i opis są fikcyjne, a zdjęcie z Unsplash służy wyłącznie jako ilustracja. W demonstracji możesz sprawdzić portfolio, negocjacje i zamówienia.",
      "price": 150,
      "negotiatedPrice": null,
      "negotiable": false,
      "custom": true,
      "framed": false,
      "unique": false,
      "verification": {
        "analysis": {
          "passed": true,
          "width": 700,
          "height": 467,
          "analyzedAt": "2026-11-20T10:00:00.000Z"
        },
        "approvedAt": "2026-11-20T11:00:00.000Z",
        "approvedBy": "@admin"
      },
      "placeholderImage": false,
      "likes": 7,
      "likedBy": [],
      "sold": false,
      "image": "https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=700&h=467&q=80"
    },
    {
      "id": 1795168800006,
      "title": "Szkic do nowej kolekcji",
      "author": "@glina_w_ogniu",
      "category": "Rzeźba i Drewno",
      "technique": "Studium formy",
      "dimensions": "20 × 20 cm",
      "description": "Przykładowa oferta do prezentacji ArtVint. Szkic do nowej kolekcji. Parametry i opis są fikcyjne, a zdjęcie z Unsplash służy wyłącznie jako ilustracja. W demonstracji możesz sprawdzić portfolio, negocjacje i zamówienia.",
      "price": 450,
      "negotiatedPrice": null,
      "negotiable": true,
      "custom": false,
      "framed": false,
      "unique": true,
      "verification": {
        "analysis": {
          "passed": false,
          "width": 80,
          "height": 80,
          "analyzedAt": "2026-11-20T10:00:00.000Z"
        }
      },
      "placeholderImage": false,
      "likes": 6,
      "likedBy": [],
      "sold": false,
      "image": "https://images.unsplash.com/photo-1582555172866-f73bb12a2ab3?auto=format&fit=crop&w=80&h=80&q=80"
    },
    {
      "id": 1795168800007,
      "title": "Zapis światła",
      "author": "@piotr_kolekcjoner",
      "category": "Fotografia Analogowa",
      "technique": "Fotografia na papierze matowym",
      "dimensions": "30 × 45 cm",
      "description": "Przykładowa oferta do prezentacji ArtVint. Zapis światła. Parametry i opis są fikcyjne, a zdjęcie z Unsplash służy wyłącznie jako ilustracja. W demonstracji możesz sprawdzić portfolio, negocjacje i zamówienia.",
      "price": 260,
      "negotiatedPrice": null,
      "negotiable": true,
      "custom": true,
      "framed": false,
      "unique": false,
      "verification": null,
      "placeholderImage": false,
      "likes": 5,
      "likedBy": [],
      "sold": false,
      "image": "https://images.unsplash.com/photo-1578301978693-85fa9c0320b9?auto=format&fit=crop&w=700&h=467&q=80"
    },
    {
      "id": 1795168800008,
      "title": "Wspomnienie lata",
      "author": "@marta_asp",
      "category": "Malarstwo",
      "technique": "Olej na płótnie",
      "dimensions": "70 × 90 cm",
      "description": "Przykładowa oferta do prezentacji ArtVint. Wspomnienie lata. Parametry i opis są fikcyjne, a zdjęcie z Unsplash służy wyłącznie jako ilustracja. W demonstracji możesz sprawdzić portfolio, negocjacje i zamówienia.",
      "price": 900,
      "negotiatedPrice": null,
      "negotiable": false,
      "custom": false,
      "framed": true,
      "unique": true,
      "verification": {
        "analysis": {
          "passed": true,
          "width": 700,
          "height": 467,
          "analyzedAt": "2026-11-20T10:00:00.000Z"
        },
        "approvedAt": "2026-11-20T11:00:00.000Z",
        "approvedBy": "@admin"
      },
      "placeholderImage": false,
      "likes": 4,
      "likedBy": [],
      "sold": true,
      "image": "https://images.unsplash.com/photo-1544967082-d9d25d867d66?auto=format&fit=crop&w=700&h=467&q=80"
    },
    {
      "id": 1795168800009,
      "title": "Naczynie do kolekcji",
      "author": "@glina_w_ogniu",
      "category": "Ceramika i Szkło",
      "technique": "Kamionka szkliwiona",
      "dimensions": "12 × 18 cm",
      "description": "Przykładowa oferta do prezentacji ArtVint. Naczynie do kolekcji. Parametry i opis są fikcyjne, a zdjęcie z Unsplash służy wyłącznie jako ilustracja. W demonstracji możesz sprawdzić portfolio, negocjacje i zamówienia.",
      "price": 160,
      "negotiatedPrice": null,
      "negotiable": false,
      "custom": false,
      "framed": true,
      "unique": true,
      "verification": {
        "analysis": {
          "passed": true,
          "width": 700,
          "height": 467,
          "analyzedAt": "2026-11-20T10:00:00.000Z"
        },
        "approvedAt": "2026-11-20T11:00:00.000Z",
        "approvedBy": "@admin"
      },
      "placeholderImage": false,
      "likes": 3,
      "likedBy": [],
      "sold": true,
      "image": "https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?auto=format&fit=crop&w=700&h=467&q=80"
    },
    {
      "id": 1795168800010,
      "title": "Mała kolekcja grafik",
      "author": "@piotr_kolekcjoner",
      "category": "Plakat i Ilustracja",
      "technique": "Druk artystyczny",
      "dimensions": "21 × 30 cm",
      "description": "Przykładowa oferta do prezentacji ArtVint. Mała kolekcja grafik. Parametry i opis są fikcyjne, a zdjęcie z Unsplash służy wyłącznie jako ilustracja. W demonstracji możesz sprawdzić portfolio, negocjacje i zamówienia.",
      "price": 120,
      "negotiatedPrice": null,
      "negotiable": false,
      "custom": false,
      "framed": false,
      "unique": false,
      "verification": null,
      "placeholderImage": false,
      "likes": 2,
      "likedBy": [],
      "sold": true,
      "image": "https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=700&h=467&q=80"
    },
    {
      "id": 1795168800011,
      "title": "Forma i kolor",
      "author": "@glina_w_ogniu",
      "category": "Ceramika i Szkło",
      "technique": "Glina, szkliwo satynowe",
      "dimensions": "22 × 16 cm",
      "description": "Przykładowa oferta do prezentacji ArtVint. Forma i kolor. Parametry i opis są fikcyjne, a zdjęcie z Unsplash służy wyłącznie jako ilustracja. W demonstracji możesz sprawdzić portfolio, negocjacje i zamówienia.",
      "price": 190,
      "negotiatedPrice": null,
      "negotiable": true,
      "custom": true,
      "framed": true,
      "unique": true,
      "verification": {
        "analysis": {
          "passed": true,
          "width": 700,
          "height": 467,
          "analyzedAt": "2026-11-20T10:00:00.000Z"
        },
        "approvedAt": "2026-11-20T11:00:00.000Z",
        "approvedBy": "@admin"
      },
      "placeholderImage": false,
      "likes": 1,
      "likedBy": [],
      "sold": false,
      "image": "https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?auto=format&fit=crop&w=700&h=467&q=80"
    }
  ],
  "profiles": {
    "@marta_asp": {
      "handle": "@marta_asp",
      "name": "Marta Kowalska",
      "studioName": "Pracownia Marty",
      "city": "Gdańsk",
      "specialization": "Malarstwo i grafika",
      "education": "Profil demonstracyjny",
      "yearsActive": 4,
      "followers": 0,
      "followedBy": [],
      "avatar": "artist-avatar.svg",
      "cover": "https://images.unsplash.com/photo-1544967082-d9d25d867d66?auto=format&fit=crop&w=700&h=467&q=80",
      "bio": "Fikcyjna artystka na potrzeby demonstracji. Portfolio prezentuje obrazy, ilustracje oraz archiwum sprzedanych prac.",
      "manifesto": "Przykładowe portfolio do prezentacji funkcji ArtVint.",
      "exhibitions": [
        "2026 – Wystawa demonstracyjna ArtVint (dane fikcyjne)"
      ]
    },
    "@glina_w_ogniu": {
      "handle": "@glina_w_ogniu",
      "name": "Anna Nowak",
      "studioName": "Glina w Ogniu",
      "city": "Tczew",
      "specialization": "Ceramika i małe formy rzeźbiarskie",
      "education": "Profil demonstracyjny",
      "yearsActive": 5,
      "followers": 0,
      "followedBy": [],
      "avatar": "artist-avatar.svg",
      "cover": "https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?auto=format&fit=crop&w=700&h=467&q=80",
      "bio": "Fikcyjna pracownia ceramiczna. Przykładowe oferty pozwalają przetestować analizę zdjęć, zamówienia i oceny po zakupie.",
      "manifesto": "Przykładowe portfolio do prezentacji funkcji ArtVint.",
      "exhibitions": [
        "2026 – Wystawa demonstracyjna ArtVint (dane fikcyjne)"
      ]
    },
    "@piotr_kolekcjoner": {
      "handle": "@piotr_kolekcjoner",
      "name": "Piotr Wiśniewski",
      "studioName": "Kadry Piotra",
      "city": "Gdynia",
      "specialization": "Fotografia analogowa",
      "education": "Profil demonstracyjny",
      "yearsActive": 6,
      "followers": 0,
      "followedBy": [],
      "avatar": "artist-avatar.svg",
      "cover": "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=700&h=467&q=80",
      "bio": "Fikcyjny kolekcjoner i autor fotografii. Konto ma przykładowe zakupy, ulubione prace oraz portfolio.",
      "manifesto": "Przykładowe portfolio do prezentacji funkcji ArtVint.",
      "exhibitions": [
        "2026 – Wystawa demonstracyjna ArtVint (dane fikcyjne)"
      ]
    }
  },
  "orders": [
    {
      "id": "ORD-DEMO-001",
      "artworkId": 1795168800008,
      "title": "Wspomnienie lata",
      "seller": "@marta_asp",
      "buyer": "@piotr_kolekcjoner",
      "technique": "Olej na płótnie",
      "dimensions": "70 × 90 cm",
      "image": "https://images.unsplash.com/photo-1544967082-d9d25d867d66?auto=format&fit=crop&w=700&h=467&q=80",
      "price": 900,
      "total": "971.00",
      "delivery": "Kurier (dostawa demonstracyjna)",
      "payment": "Zamówienie testowe bez płatności",
      "date": "2026-11-21",
      "verification": {
        "analysis": {
          "passed": true,
          "width": 700,
          "height": 467,
          "analyzedAt": "2026-11-20T10:00:00.000Z"
        },
        "approvedAt": "2026-11-20T11:00:00.000Z",
        "approvedBy": "@admin"
      },
      "status": "Zakup demonstracyjny",
      "reviewed": true
    },
    {
      "id": "ORD-DEMO-002",
      "artworkId": 1795168800009,
      "title": "Naczynie do kolekcji",
      "seller": "@glina_w_ogniu",
      "buyer": "@piotr_kolekcjoner",
      "technique": "Kamionka szkliwiona",
      "dimensions": "12 × 18 cm",
      "image": "https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?auto=format&fit=crop&w=700&h=467&q=80",
      "price": 160,
      "total": "194.00",
      "delivery": "Kurier (dostawa demonstracyjna)",
      "payment": "Zamówienie testowe bez płatności",
      "date": "2026-11-21",
      "verification": {
        "analysis": {
          "passed": true,
          "width": 700,
          "height": 467,
          "analyzedAt": "2026-11-20T10:00:00.000Z"
        },
        "approvedAt": "2026-11-20T11:00:00.000Z",
        "approvedBy": "@admin"
      },
      "status": "Zakup demonstracyjny",
      "reviewed": false
    },
    {
      "id": "ORD-DEMO-003",
      "artworkId": 1795168800010,
      "title": "Mała kolekcja grafik",
      "seller": "@piotr_kolekcjoner",
      "buyer": "@marta_asp",
      "technique": "Druk artystyczny",
      "dimensions": "21 × 30 cm",
      "image": "https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=700&h=467&q=80",
      "price": 120,
      "total": "152.00",
      "delivery": "Kurier (dostawa demonstracyjna)",
      "payment": "Zamówienie testowe bez płatności",
      "date": "2026-11-21",
      "verification": null,
      "status": "Zakup demonstracyjny",
      "reviewed": true
    }
  ],
  "reviews": [
    {
      "id": 1795255200101,
      "artist": "@marta_asp",
      "author": "@piotr_kolekcjoner",
      "orderTitle": "Wspomnienie lata",
      "rating": 5,
      "text": "Opinia demonstracyjna: staranne wykonanie i dobry kontakt z pracownią.",
      "date": "2026-11-22"
    },
    {
      "id": 1795255200102,
      "artist": "@piotr_kolekcjoner",
      "author": "@marta_asp",
      "orderTitle": "Mała kolekcja grafik",
      "rating": 4,
      "text": "Opinia demonstracyjna: udany zakup do kolekcji, sprawnie ustalona dostawa.",
      "date": "2026-11-23"
    }
  ]
};
  const prefix = "artvint_demo_clean_";
  const marker = prefix + "seed_version";

  function seed(storage, { force = false } = {}) {
    if (!force && storage.getItem(marker) === String(data.version)) return false;
    function read(key, fallback) {
      try { return JSON.parse(storage.getItem(prefix + key)) ?? fallback; }
      catch { return fallback; }
    }
    const deleted = new Set(read("artvint_deleted_accounts", []));
    const active = handle => !deleted.has(handle);
    const collections = {
      artvint_v6_items: data.artworks.filter(item => active(item.author)),
      artvint_v6_orders: data.orders.filter(order => active(order.buyer) && active(order.seller)),
      artvint_v6_reviews: data.reviews.filter(review => active(review.author) && active(review.artist))
    };
    for (const [key, examples] of Object.entries(collections)) {
      const saved = force ? [] : read(key, []);
      const records = Array.isArray(saved) ? saved : [];
      const ids = new Set(records.map(record => record.id));
      storage.setItem(prefix + key, JSON.stringify([...records, ...examples.filter(record => !ids.has(record.id))]));
    }
    const profiles = Object.fromEntries(Object.entries(data.profiles).filter(([handle]) => active(handle)));
    const savedProfiles = force ? {} : read("artvint_v6_artists", {});
    storage.setItem(prefix + "artvint_v6_artists", JSON.stringify({ ...profiles, ...savedProfiles }));
    storage.setItem(marker, String(data.version));
    return true;
  }
  return { data, seed };
})();
