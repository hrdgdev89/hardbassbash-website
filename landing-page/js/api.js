/* ============================================================
   HardBassBash — PocketBase API Client & Page Renderers
   Version: 1.0.0
   
   Usage: Include AFTER pocketbase.umd.js SDK
   Then call window.HBB.initXxxPage() at the bottom of each page.
   ============================================================ */

(function () {
    'use strict';

    // =========================================================
    // CONFIG
    // =========================================================
    const PB_URL = 'http://127.0.0.1:8090';

    // Guard: SDK must be loaded before api.js runs
    if (typeof PocketBase === 'undefined') {
        console.error('[HBB] PocketBase SDK not loaded! Make sure pocketbase.umd.js is included before api.js.');
        window.HBB = { initHomePage(){}, initEventsPage(){}, initArtistsPage(){}, initMusicPage(){}, initShopPage(){}, initContactPage(){} };
        return;
    }

    const pb = new PocketBase(PB_URL);

    // Fallback image paths (from local /images/ folder)
    const FALLBACK_IMAGES = {
        event:   'images/hero_bg.png',
        artist:  'images/artist_oschie.png',
        release: 'images/release_1.png',
        product: 'images/merch_tshirt.png',
    };

    // Artist slug → local image filename mapping (for fallback)
    const ARTIST_IMAGE_MAP = {
        'oschie':     'images/artist_oschie.png',
        'jourdy-cox': 'images/artist_jourdy_cox.png',
        'marth':      'images/artist_marth.png',
        'kittyflip':  'images/artist_kittyflip.png',
        'micju':      'images/artist_micju.png',
        'barra':      'images/artist_barra.png',
        'hrdg':       'images/artist_hrdg.png',
    };


    // =========================================================
    // HELPERS
    // =========================================================
    function getFileUrl(record, filename) {
        if (!filename) return null;
        return pb.files.getURL(record, filename);
    }

    function formatDate(dateStr) {
        if (!dateStr) return '';
        const d = new Date(dateStr);
        return d.toLocaleDateString('en-GB', {
            day:   '2-digit',
            month: 'short',
            year:  'numeric',
        });
    }

    function igSvg() {
        return `<svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058
            1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664
            4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849
            0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057
            1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78
            2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072
            4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0
            3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948
            0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0
            5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759
            6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4
            0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796
            0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645
            1.439-1.44s-.644-1.44-1.439-1.44z"/>
        </svg>`;
    }


    // =========================================================
    // DATA FETCHERS
    // =========================================================

    async function getArtists() {
        try {
            return await pb.collection('artists').getFullList({
                filter: 'active = true',
                sort:   '+order_num',
            });
        } catch (err) {
            console.warn('[HBB] Could not load artists (is PocketBase running?):', err.message);
            return [];
        }
    }

    async function getEvents({ status = null, city = null } = {}) {
        try {
            let filter = 'published = true';
            if (status)                filter += ` && status = "${status}"`;
            if (city && city !== 'all') filter += ` && city = "${city}"`;

            return await pb.collection('events').getFullList({
                filter,
                sort:   status === 'past' ? '-event_date' : '+event_date',
                expand: 'artists',
            });
        } catch (err) {
            console.warn('[HBB] Could not load events:', err.message);
            return [];
        }
    }

    async function getReleases(limit = 0) {
        try {
            const opts = {
                filter: 'published = true',
                sort:   '-release_date',
                expand: 'artists',
            };
            if (limit > 0) {
                return (await pb.collection('releases').getList(1, limit, opts)).items;
            }
            return await pb.collection('releases').getFullList(opts);
        } catch (err) {
            console.warn('[HBB] Could not load releases:', err.message);
            return [];
        }
    }

    async function getMixes() {
        try {
            return await pb.collection('mixes').getFullList({
                filter: 'published = true',
                sort:   '-created',
                expand: 'artist',
            });
        } catch (err) {
            console.warn('[HBB] Could not load mixes:', err.message);
            return [];
        }
    }

    async function getProducts(category = null) {
        try {
            let filter = 'published = true';
            if (category && category !== 'all') filter += ` && category = "${category}"`;
            return await pb.collection('products').getFullList({
                filter,
                sort: '+name',
            });
        } catch (err) {
            console.warn('[HBB] Could not load products:', err.message);
            return [];
        }
    }

    async function submitContact(data) {
        try {
            const record = await pb.collection('contact_messages').create({
                first_name: data.firstName,
                last_name:  data.lastName  || '',
                email:      data.email,
                instagram:  data.instagram || '',
                subject:    data.subject,
                message:    data.message,
                status:     'new',
            });
            return { success: true, record };
        } catch (err) {
            console.error('[HBB] Contact submit failed:', err);
            return { success: false, error: err.message || 'Submission failed' };
        }
    }

    async function subscribeNewsletter(email) {
        try {
            const record = await pb.collection('newsletter_subscribers').create({ email });
            return { success: true, record };
        } catch (err) {
            console.error('[HBB] Newsletter subscribe failed:', err);
            return { success: false, error: err.message || 'Subscribe failed' };
        }
    }


    // =========================================================
    // HTML RENDERERS
    // =========================================================

    function renderEventCard(event, isPast) {
        const dateStr  = formatDate(event.event_date);
        const timeStr  = event.event_time ? ` &nbsp;·&nbsp; ${event.event_time}` : '';
        const imgUrl   = event.image ? getFileUrl(event, event.image) : FALLBACK_IMAGES.event;
        const cityLow  = (event.city || '').toLowerCase();

        const badge = isPast
            ? `<span class="event-card__badge event-card__badge--past">Past</span>`
            : `<span class="event-card__badge">Upcoming</span>`;

        const btn = isPast
            ? `<span class="btn btn-outline btn-sm" style="opacity:0.4;pointer-events:none;">Ended</span>`
            : `<a href="${event.ticket_url || 'https://www.instagram.com/hardbassbash/'}" target="_blank" rel="noopener" class="btn btn-primary btn-sm">Get Tickets</a>`;

        return `
        <div class="event-card reveal" data-city="${cityLow}">
            <div class="event-card__image">
                <img src="${imgUrl}" alt="${event.title}" loading="lazy">
                ${badge}
            </div>
            <div class="event-card__body">
                <div class="event-card__date">${dateStr}${timeStr}</div>
                <h3 class="event-card__title">${event.title}</h3>
                <p class="event-card__venue">📍 ${event.venue || ''}</p>
                <div class="event-card__footer">
                    <span class="event-card__city-tag">${event.city || ''}</span>
                    ${btn}
                </div>
            </div>
        </div>`;
    }

    function renderArtistCard(artist, index) {
        const imgUrl  = artist.photo
            ? getFileUrl(artist, artist.photo)
            : (ARTIST_IMAGE_MAP[artist.slug] || FALLBACK_IMAGES.artist);
        const igUrl   = artist.instagram || 'https://www.instagram.com/hardbassbash/';
        const delay   = index > 0 ? ` reveal-delay-${Math.min(index % 5, 4)}` : '';

        return `
        <div class="artist-card reveal${delay}">
            <div class="artist-card__image">
                <img src="${imgUrl}" alt="${artist.name}" loading="lazy">
            </div>
            <div class="artist-card__overlay">
                <div class="artist-card__name">${artist.name}</div>
                <div class="artist-card__role">${artist.role || 'DJ · Producer'}</div>
                <div class="artist-card__social">
                    <a href="${igUrl}" target="_blank" rel="noopener" title="Instagram">
                        ${igSvg()}
                    </a>
                </div>
            </div>
        </div>`;
    }

    function renderArtistFullCard(artist, index) {
        const imgUrl  = artist.photo
            ? getFileUrl(artist, artist.photo)
            : (ARTIST_IMAGE_MAP[artist.slug] || FALLBACK_IMAGES.artist);
        const igUrl   = artist.instagram || 'https://www.instagram.com/hardbassbash/';
        const num     = String(index + 1).padStart(2, '0');
        const delay   = index > 0 ? ` reveal-delay-${Math.min(index % 4, 3)}` : '';

        return `
        <div class="artist-full-card reveal${delay}">
            <div class="artist-full-card__image">
                <img src="${imgUrl}" alt="${artist.name}" loading="lazy">
                <div class="artist-full-card__num">${num}</div>
            </div>
            <div class="artist-full-card__body">
                <h2 class="artist-full-card__name">${artist.name.toUpperCase()}</h2>
                <p class="artist-full-card__role">${artist.role || 'DJ · Producer'}</p>
                <p class="artist-full-card__bio">${artist.bio || ''}</p>
                <div class="artist-full-card__footer">
                    <div class="artist-full-card__social">
                        <a href="${igUrl}" target="_blank" rel="noopener" title="Instagram">
                            ${igSvg()}
                        </a>
                    </div>
                    <a href="events.html" class="btn btn-primary btn-sm">View Events</a>
                </div>
            </div>
        </div>`;
    }

    function renderReleaseCard(release, index) {
        const imgUrl      = release.cover
            ? getFileUrl(release, release.cover)
            : `images/release_${(index % 3) + 1}.png`;
        const artistNames = release.expand?.artists?.map(a => a.name).join(' & ') || 'HardBassBash';
        const year        = release.release_date ? new Date(release.release_date).getFullYear() : '';
        const delay       = index > 0 ? ` reveal-delay-${Math.min(index % 4, 3)}` : '';

        return `
        <div class="release-card reveal${delay}">
            <div class="release-card__cover">
                <img src="${imgUrl}" alt="${release.title}" loading="lazy">
                <div class="release-card__play">▶</div>
            </div>
            <div class="release-card__title">${release.title}</div>
            <div class="release-card__artist">${artistNames}</div>
            <div class="release-card__type">${release.type || 'Release'} &nbsp;·&nbsp; ${year}</div>
        </div>`;
    }

    function renderMixCard(mix, index) {
        const artist    = mix.expand?.artist;
        const artistName = artist?.name || 'HardBassBash';
        const imgUrl = (mix.cover   ? getFileUrl(mix,   mix.cover)    : null)
                    || (artist?.photo ? getFileUrl(artist, artist.photo) : null)
                    || FALLBACK_IMAGES.artist;
        const delay = index > 0 ? ` reveal-delay-${Math.min(index, 2)}` : '';
        const scBtn = mix.soundcloud_url
            ? `<a href="${mix.soundcloud_url}" target="_blank" rel="noopener" class="btn btn-outline btn-sm">Listen on SoundCloud</a>`
            : '';

        return `
        <div class="mix-card reveal${delay}">
            <div class="mix-card__cover">
                <img src="${imgUrl}" alt="${mix.title}" loading="lazy">
            </div>
            <div class="mix-card__info">
                <div class="mix-card__num">${mix.episode || ''}</div>
                <h3 class="mix-card__title">${mix.title}</h3>
                <div class="mix-card__artist">${artistName}</div>
                <p class="mix-card__desc">${mix.description || ''}</p>
                <div class="mix-card__meta">
                    ${mix.duration ? `<span class="mix-card__meta-item">${mix.duration}</span>` : ''}
                    ${mix.genre    ? `<span class="mix-card__meta-item">${mix.genre}</span>`    : ''}
                    ${mix.year     ? `<span class="mix-card__meta-item">${mix.year}</span>`     : ''}
                </div>
                ${scBtn}
            </div>
        </div>`;
    }

    function renderProductCard(product, index) {
        const imgUrl   = product.image ? getFileUrl(product, product.image) : FALLBACK_IMAGES.product;
        const tagMap   = { available: 'Available', limited: 'Limited', coming_soon: 'Coming Soon' };
        const tagLabel = tagMap[product.status] || 'Available';
        const delay    = index > 0 ? ` reveal-delay-${Math.min(index % 4, 3)}` : '';
        const btn      = product.status === 'coming_soon'
            ? `<a href="https://www.instagram.com/hardbassbash/" target="_blank" rel="noopener" class="btn btn-outline btn-sm">Notify Me</a>`
            : `<a href="https://www.instagram.com/hardbassbash/" target="_blank" rel="noopener" class="btn btn-primary btn-sm">Order via IG</a>`;

        return `
        <div class="product-card reveal${delay}" data-category="${product.category || 'all'}">
            <div class="product-card__image">
                <img src="${imgUrl}" alt="${product.name}" loading="lazy">
                <span class="product-card__tag">${tagLabel}</span>
            </div>
            <div class="product-card__body">
                <div class="product-card__name">${product.name}</div>
                <div class="product-card__desc">${product.description || ''}</div>
                <div class="product-card__footer">
                    <div class="product-card__price">${product.price_display || ''}</div>
                    ${btn}
                </div>
            </div>
        </div>`;
    }


    // =========================================================
    // EMPTY / LOADING STATES
    // =========================================================
    function renderLoading() {
        return `<div class="hbb-loading" aria-busy="true"><span class="hbb-spinner"></span><span>Loading...</span></div>`;
    }

    function renderEmpty(msg) {
        return `<p class="hbb-empty">${msg}</p>`;
    }

    function setContent(id, html) {
        const el = document.getElementById(id);
        if (el) el.innerHTML = html;
    }


    // =========================================================
    // UTILITIES
    // =========================================================

    /** Re-trigger scroll-reveal IntersectionObserver for new elements */
    function triggerReveal() {
        const obs = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    obs.unobserve(entry.target);
                }
            });
        }, { threshold: 0.08 });

        document.querySelectorAll('.reveal:not(.visible)').forEach(el => obs.observe(el));
    }

    /** City filter for events page */
    function initCityFilter(gridId) {
        document.querySelectorAll('.filter-btn[data-filter]').forEach(btn => {
            btn.addEventListener('click', () => {
                document.querySelectorAll('.filter-btn[data-filter]').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                const filter = btn.dataset.filter;
                const cards  = document.querySelectorAll(`#${gridId} .event-card`);
                cards.forEach(card => {
                    const show = filter === 'all' || card.dataset.city === filter;
                    card.style.display = show ? '' : 'none';
                });
            });
        });
    }

    /** Category filter for shop page */
    function initCategoryFilter(gridId) {
        document.querySelectorAll('.filter-btn[data-filter]').forEach(btn => {
            btn.addEventListener('click', () => {
                document.querySelectorAll('.filter-btn[data-filter]').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                const filter = btn.dataset.filter;
                const cards  = document.querySelectorAll(`#${gridId} .product-card`);
                cards.forEach(card => {
                    const show = filter === 'all' || card.dataset.category === filter;
                    card.style.display = show ? '' : 'none';
                });
            });
        });
    }


    // =========================================================
    // PAGE INITIALIZERS
    // =========================================================

    /**
     * Home Page (index.html)
     * - Loads 3 upcoming events → #homeEventsGrid
     * - Loads all artists     → #homeArtistsGrid
     */
    async function initHomePage() {
        // Events preview
        setContent('homeEventsGrid', renderLoading());
        const upcoming = await getEvents({ status: 'upcoming' });
        if (upcoming.length) {
            setContent('homeEventsGrid', upcoming.slice(0, 3).map(e => renderEventCard(e, false)).join(''));
        } else {
            setContent('homeEventsGrid', renderEmpty('No upcoming events right now. Follow <a href="https://www.instagram.com/hardbassbash/" target="_blank" rel="noopener" style="color:var(--accent)">@hardbassbash</a> for announcements.'));
        }

        // Artists preview
        setContent('homeArtistsGrid', renderLoading());
        const artists = await getArtists();
        if (artists.length) {
            setContent('homeArtistsGrid', artists.map((a, i) => renderArtistCard(a, i)).join(''));
        } else {
            setContent('homeArtistsGrid', renderEmpty(
                'Could not load artists. Make sure PocketBase is running at <code>http://127.0.0.1:8090</code>'
            ));
        }

        triggerReveal();
    }

    /**
     * Events Page (events.html)
     * - Loads upcoming events → #upcomingGrid
     * - Loads past events     → #pastGrid
     */
    async function initEventsPage() {
        // Upcoming
        setContent('upcomingGrid', renderLoading());
        const upcoming = await getEvents({ status: 'upcoming' });
        if (upcoming.length) {
            setContent('upcomingGrid', upcoming.map(e => renderEventCard(e, false)).join(''));
            initCityFilter('upcomingGrid');
        } else {
            setContent('upcomingGrid', renderEmpty('No upcoming events right now. Follow <a href="https://www.instagram.com/hardbassbash/" target="_blank" rel="noopener" style="color:var(--accent)">@hardbassbash</a> for announcements.'));
        }

        // Past
        setContent('pastGrid', renderLoading());
        const past = await getEvents({ status: 'past' });
        if (past.length) {
            setContent('pastGrid', past.map(e => renderEventCard(e, true)).join(''));
        } else {
            setContent('pastGrid', renderEmpty('No past events recorded yet.'));
        }

        triggerReveal();
    }

    /**
     * Artists Page (artists.html)
     * - Loads all artists → #artistsGrid
     */
    async function initArtistsPage() {
        setContent('artistsGrid', renderLoading());
        const artists = await getArtists();
        if (artists.length) {
            setContent('artistsGrid', artists.map((a, i) => renderArtistFullCard(a, i)).join(''));
            triggerReveal();
        } else {
            setContent('artistsGrid', renderEmpty('Artists coming soon.'));
        }
    }

    /**
     * Music Page (music.html)
     * - Loads releases → #releasesGrid
     * - Loads mixes    → #mixesList
     */
    async function initMusicPage() {
        setContent('releasesGrid', renderLoading());
        const releases = await getReleases();
        if (releases.length) {
            setContent('releasesGrid', releases.map((r, i) => renderReleaseCard(r, i)).join(''));
        } else {
            setContent('releasesGrid', renderEmpty('No releases yet. Coming soon!'));
        }

        setContent('mixesList', renderLoading());
        const mixes = await getMixes();
        if (mixes.length) {
            setContent('mixesList', mixes.map((m, i) => renderMixCard(m, i)).join(''));
        } else {
            setContent('mixesList', renderEmpty('No mixes yet. Coming soon!'));
        }

        triggerReveal();
    }

    /**
     * Shop Page (shop.html)
     * - Loads products → #shopGrid
     */
    async function initShopPage() {
        setContent('shopGrid', renderLoading());
        const products = await getProducts();
        if (products.length) {
            setContent('shopGrid', products.map((p, i) => renderProductCard(p, i)).join(''));
            triggerReveal();
            initCategoryFilter('shopGrid');
        } else {
            setContent('shopGrid', renderEmpty('Shop coming soon!'));
        }
    }

    /**
     * Contact Page (contact.html)
     * - Handles form submission → PocketBase contact_messages
     */
    function initContactPage() {
        const form = document.getElementById('contactForm');
        if (!form) return;

        form.addEventListener('submit', async (e) => {
            e.preventDefault();

            const btn         = document.getElementById('submitBtn');
            const origText    = btn.textContent;
            btn.textContent   = 'Sending...';
            btn.disabled      = true;

            // Clear previous errors
            form.querySelectorAll('.hbb-form-error').forEach(el => el.remove());

            const data = {
                firstName: document.getElementById('firstName')?.value || '',
                lastName:  document.getElementById('lastName')?.value  || '',
                email:     document.getElementById('email')?.value     || '',
                instagram: document.getElementById('instagram')?.value || '',
                subject:   document.getElementById('subject')?.value   || '',
                message:   document.getElementById('message')?.value   || '',
            };

            const result = await submitContact(data);

            if (result.success) {
                form.innerHTML = `
                    <div class="hbb-success">
                        <div class="hbb-success__icon">✓</div>
                        <h3>Message Sent!</h3>
                        <p>Thanks <strong>${data.firstName}</strong>! We'll get back to you within 24–48 hours.<br>
                        In the meantime, follow us on <a href="https://www.instagram.com/hardbassbash/" target="_blank" rel="noopener" style="color:var(--accent)">@hardbassbash</a>.</p>
                    </div>`;
            } else {
                btn.textContent = origText;
                btn.disabled    = false;
                const errEl = document.createElement('div');
                errEl.className   = 'hbb-form-error';
                errEl.textContent = 'Failed to send message. Please try again or DM us on Instagram.';
                form.prepend(errEl);
                setTimeout(() => errEl.remove(), 6000);
            }
        });
    }


    // =========================================================
    // EXPORT — window.HBB
    // =========================================================
    window.HBB = {
        pb,
        getFileUrl,
        getArtists,
        getEvents,
        getReleases,
        getMixes,
        getProducts,
        submitContact,
        subscribeNewsletter,
        initHomePage,
        initEventsPage,
        initArtistsPage,
        initMusicPage,
        initShopPage,
        initContactPage,
        triggerReveal,
    };

})();
