/// <reference path="../pb_data/types.d.ts" />

/**
 * Migration: Increase file size limit for artist photos, events, releases
 * New limit: 50MB per file
 */

migrate((app) => {

    // Update artists collection — photo field limit to 50MB
    const artists = app.findCollectionByNameOrId("artists");
    for (const field of artists.fields) {
        if (field.name === "photo") {
            field.maxSize = 52428800; // 50MB
        }
    }
    app.save(artists);

    // Update events collection — image field limit to 50MB
    const events = app.findCollectionByNameOrId("events");
    for (const field of events.fields) {
        if (field.name === "image") {
            field.maxSize = 52428800;
        }
    }
    app.save(events);

    // Update releases collection — cover field limit to 50MB
    const releases = app.findCollectionByNameOrId("releases");
    for (const field of releases.fields) {
        if (field.name === "cover") {
            field.maxSize = 52428800;
        }
    }
    app.save(releases);

    // Update mixes collection — cover field limit to 50MB
    const mixes = app.findCollectionByNameOrId("mixes");
    for (const field of mixes.fields) {
        if (field.name === "cover") {
            field.maxSize = 52428800;
        }
    }
    app.save(mixes);

    // Update products collection — image field limit to 50MB
    const products = app.findCollectionByNameOrId("products");
    for (const field of products.fields) {
        if (field.name === "image") {
            field.maxSize = 52428800;
        }
    }
    app.save(products);

}, (app) => {
    // Revert back to 10MB
    const collections = ["artists", "events", "releases", "mixes", "products"];
    const fieldNames  = { artists: "photo", events: "image", releases: "cover", mixes: "cover", products: "image" };

    for (const name of collections) {
        try {
            const col = app.findCollectionByNameOrId(name);
            for (const field of col.fields) {
                if (field.name === fieldNames[name]) {
                    field.maxSize = 10485760; // 10MB
                }
            }
            app.save(col);
        } catch (_) {}
    }
});
