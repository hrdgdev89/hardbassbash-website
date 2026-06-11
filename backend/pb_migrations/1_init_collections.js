/// <reference path="../pb_data/types.d.ts" />

/**
 * HardBassBash — Initial Collections & Seed Data
 * Migration: 1_init_collections.js
 *
 * Creates 7 collections with proper API rules and seeds
 * initial artist data.
 *
 * Run: ./pocketbase migrate up
 */

migrate((app) => {

    // =========================================================
    // 1. ARTISTS
    // =========================================================
    const artists = new Collection({
        name: "artists",
        type: "base",
        listRule: "",
        viewRule: "",
        createRule: null,
        updateRule: null,
        deleteRule: null,
        fields: [
            { name: "name",       type: "text",   required: true },
            { name: "slug",       type: "text",   required: true },
            { name: "role",       type: "text"                   },
            { name: "bio",        type: "editor"                 },
            { name: "photo",      type: "file",   maxSelect: 1, maxSize: 10485760 },
            { name: "order_num",  type: "number"                 },
            { name: "instagram",  type: "url"                    },
            { name: "soundcloud", type: "url"                    },
            { name: "active",     type: "bool"                   },
        ],
        indexes: [
            "CREATE UNIQUE INDEX idx_artists_slug ON artists (slug)",
        ],
    });
    app.save(artists);


    // =========================================================
    // 2. EVENTS
    // =========================================================
    const events = new Collection({
        name: "events",
        type: "base",
        listRule: "",
        viewRule: "",
        createRule: null,
        updateRule: null,
        deleteRule: null,
        fields: [
            { name: "title",       type: "text", required: true },
            { name: "city",        type: "select", maxSelect: 1, values: ["Jakarta","Bandung","Yogyakarta","Surabaya"] },
            { name: "venue",       type: "text"  },
            { name: "event_date",  type: "date"  },
            { name: "event_time",  type: "text"  },
            { name: "status",      type: "select", maxSelect: 1, values: ["upcoming","past"] },
            { name: "image",       type: "file",   maxSelect: 1, maxSize: 10485760 },
            { name: "ticket_url",  type: "url"   },
            { name: "description", type: "text"  },
            {
                name: "artists",
                type: "relation",
                required: false,
                maxSelect: null,
                collectionId: artists.id,
                cascadeDelete: false,
            },
            { name: "published", type: "bool" },
        ],
    });
    app.save(events);


    // =========================================================
    // 3. RELEASES
    // =========================================================
    const releases = new Collection({
        name: "releases",
        type: "base",
        listRule: "",
        viewRule: "",
        createRule: null,
        updateRule: null,
        deleteRule: null,
        fields: [
            { name: "title",         type: "text",   required: true },
            {
                name: "artists",
                type: "relation",
                required: false,
                maxSelect: null,
                collectionId: artists.id,
                cascadeDelete: false,
            },
            { name: "type",          type: "select", maxSelect: 1, values: ["Single","EP","Album","Compilation"] },
            { name: "cover",         type: "file",   maxSelect: 1, maxSize: 10485760 },
            { name: "release_date",  type: "date"  },
            { name: "spotify_url",   type: "url"   },
            { name: "soundcloud_url",type: "url"   },
            { name: "bandcamp_url",  type: "url"   },
            { name: "youtube_url",   type: "url"   },
            { name: "description",   type: "text"  },
            { name: "published",     type: "bool"  },
        ],
    });
    app.save(releases);


    // =========================================================
    // 4. MIXES / PODCASTS
    // =========================================================
    const mixes = new Collection({
        name: "mixes",
        type: "base",
        listRule: "",
        viewRule: "",
        createRule: null,
        updateRule: null,
        deleteRule: null,
        fields: [
            { name: "episode",       type: "text"   },
            { name: "title",         type: "text",   required: true },
            {
                name: "artist",
                type: "relation",
                required: false,
                maxSelect: 1,
                collectionId: artists.id,
                cascadeDelete: false,
            },
            { name: "cover",         type: "file",   maxSelect: 1, maxSize: 10485760 },
            { name: "duration",      type: "text"   },
            { name: "genre",         type: "text"   },
            { name: "year",          type: "number" },
            { name: "soundcloud_url",type: "url"    },
            { name: "description",   type: "text"   },
            { name: "published",     type: "bool"   },
        ],
    });
    app.save(mixes);


    // =========================================================
    // 5. PRODUCTS (Shop)
    // =========================================================
    const products = new Collection({
        name: "products",
        type: "base",
        listRule: "",
        viewRule: "",
        createRule: null,
        updateRule: null,
        deleteRule: null,
        fields: [
            { name: "name",          type: "text",   required: true },
            { name: "category",      type: "select", maxSelect: 1, values: ["tops","accessories"] },
            { name: "description",   type: "text"   },
            { name: "price",         type: "number" },
            { name: "price_display", type: "text"   },
            { name: "image",         type: "file",   maxSelect: 1, maxSize: 10485760 },
            { name: "status",        type: "select", maxSelect: 1, values: ["available","limited","coming_soon"] },
            { name: "published",     type: "bool"   },
        ],
    });
    app.save(products);


    // =========================================================
    // 6. CONTACT MESSAGES
    //    - Public: create only (contact form)
    //    - Admin: list/view/update/delete
    // =========================================================
    const contactMessages = new Collection({
        name: "contact_messages",
        type: "base",
        listRule:   "@request.auth.id != ''",
        viewRule:   "@request.auth.id != ''",
        createRule: "",
        updateRule: "@request.auth.id != ''",
        deleteRule: "@request.auth.id != ''",
        fields: [
            { name: "first_name", type: "text",  required: true  },
            { name: "last_name",  type: "text"                   },
            { name: "email",      type: "email", required: true  },
            { name: "instagram",  type: "text"                   },
            { name: "subject",    type: "select", maxSelect: 1, values: ["booking","collab","press","merch","community","other"] },
            { name: "message",    type: "text",  required: true  },
            { name: "status",     type: "select", maxSelect: 1, values: ["new","read","replied"] },
        ],
    });
    app.save(contactMessages);


    // =========================================================
    // 7. NEWSLETTER SUBSCRIBERS
    //    - Public: create (subscribe form)
    //    - Admin: list/view/delete
    // =========================================================
    const newsletter = new Collection({
        name: "newsletter_subscribers",
        type: "base",
        listRule:   "@request.auth.id != ''",
        viewRule:   "@request.auth.id != ''",
        createRule: "",
        updateRule: null,
        deleteRule: "@request.auth.id != ''",
        fields: [
            { name: "email", type: "email", required: true },
        ],
        indexes: [
            "CREATE UNIQUE INDEX idx_newsletter_email ON newsletter_subscribers (email)",
        ],
    });
    app.save(newsletter);


    // =========================================================
    // SEED DATA — Artists
    // =========================================================
    const artistsData = [
        {
            name:      "Oschie",
            slug:      "oschie",
            role:      "DJ · Producer",
            bio:       "One of the founding members of HardBassBash, Oschie brings a relentless, mechanical energy to every set. Known for his ability to read the crowd and push the dancefloor to its absolute limit with raw industrial hard techno.",
            order_num: 1,
            instagram: "https://www.instagram.com/hardbassbash/",
            active:    true,
        },
        {
            name:      "Jourdy Cox",
            slug:      "jourdy-cox",
            role:      "DJ · Producer",
            bio:       "Jourdy Cox is known for crafting dark, hypnotic journeys through the harder end of the techno spectrum. His productions blend industrial textures with hard-hitting percussion, creating a sound that is uniquely his own.",
            order_num: 2,
            instagram: "https://www.instagram.com/hardbassbash/",
            active:    true,
        },
        {
            name:      "Marth",
            slug:      "marth",
            role:      "DJ · Producer",
            bio:       "Marth's sets are a masterclass in tension and release. Drawing from the deepest cuts of hard techno and industrial, he builds atmospheres that feel like sonic architecture — each layer precisely placed for maximum impact.",
            order_num: 3,
            instagram: "https://www.instagram.com/hardbassbash/",
            active:    true,
        },
        {
            name:      "KittyFlip",
            slug:      "kittyflip",
            role:      "DJ · Producer",
            bio:       "KittyFlip brings a unique perspective to hard techno — blending ferocious energy with precise, technical mixing. Her sets are a statement: powerful, unpredictable, and impossible to ignore. A rising force in Indonesia's underground scene.",
            order_num: 4,
            instagram: "https://www.instagram.com/hardbassbash/",
            active:    true,
        },
        {
            name:      "Micju",
            slug:      "micju",
            role:      "DJ · Producer",
            bio:       "Micju's deep understanding of rhythm and structure sets him apart. His productions carry weight — dense, distorted, and designed to hit hard. On the decks, he translates that same energy into marathon sets built for the underground faithful.",
            order_num: 5,
            instagram: "https://www.instagram.com/hardbassbash/",
            active:    true,
        },
        {
            name:      "Barra",
            slug:      "barra",
            role:      "DJ · Producer",
            bio:       "Barra is the sonic architect of HardBassBash. His studio work pushes into experimental territory while remaining firmly rooted in hard techno — abstract structures, mechanical rhythms, and a fearless approach to sound design.",
            order_num: 6,
            instagram: "https://www.instagram.com/hardbassbash/",
            active:    true,
        },
        {
            name:      "HRDG",
            slug:      "hrdg",
            role:      "DJ · Producer",
            bio:       "HRDG is the wild card of the HardBassBash family. Straddling the line between hard techno and raw industrial, his sets are unpredictable and visceral — a chaotic force that always ends in euphoria.",
            order_num: 7,
            instagram: "https://www.instagram.com/hardbassbash/",
            active:    true,
        },
    ];

    for (const data of artistsData) {
        const record = new Record(artists, data);
        app.save(record);
    }

    // =========================================================
    // SEED DATA — Products (Shop)
    // =========================================================
    const productsData = [
        {
            name:          "HBB Tee Vol.1",
            category:      "tops",
            description:   "Premium heavyweight cotton. Oversized fit. Black.",
            price:         250000,
            price_display: "IDR 250K",
            status:        "available",
            published:     true,
        },
        {
            name:          "HBB Hoodie Vol.1",
            category:      "tops",
            description:   "400gsm fleece. Kangaroo pocket. Oversized fit. Black.",
            price:         450000,
            price_display: "IDR 450K",
            status:        "limited",
            published:     true,
        },
        {
            name:          "HBB Longsleeve",
            category:      "tops",
            description:   "Heavyweight cotton. Oversized fit. Back logo print. Black.",
            price:         300000,
            price_display: "IDR 300K",
            status:        "limited",
            published:     true,
        },
        {
            name:          "HBB Tote Bag",
            category:      "accessories",
            description:   "Heavy canvas tote. Logo print. Black & White.",
            price:         150000,
            price_display: "IDR 150K",
            status:        "coming_soon",
            published:     true,
        },
        {
            name:          "HBB Sticker Pack",
            category:      "accessories",
            description:   "Die-cut vinyl stickers. Set of 5 designs. Waterproof.",
            price:         50000,
            price_display: "IDR 50K",
            status:        "available",
            published:     true,
        },
        {
            name:          "HBB 6-Panel Cap",
            category:      "accessories",
            description:   "Structured 6-panel. Embroidered logo. Black.",
            price:         200000,
            price_display: "IDR 200K",
            status:        "coming_soon",
            published:     true,
        },
    ];

    for (const data of productsData) {
        const record = new Record(products, data);
        app.save(record);
    }

}, (app) => {

    // =========================================================
    // DOWN — Revert migration (delete collections in reverse order)
    // =========================================================
    const toDelete = [
        "newsletter_subscribers",
        "contact_messages",
        "products",
        "mixes",
        "releases",
        "events",
        "artists",
    ];

    for (const name of toDelete) {
        try {
            const c = app.findCollectionByNameOrId(name);
            app.delete(c);
        } catch (_) {
            // collection may not exist; skip
        }
    }

});
