const geojson = JSON.parse(
  fs.readFileSync("data/rute-cimahi-bandung.geojson", "utf8")
);
const routes = db.getCollection("rute");

routes.deleteMany({});

const routeDocuments = geojson.features.map((feature) => ({
  ...feature,
  _id: feature.properties.id,
}));

const importResult = routes.insertMany(routeDocuments);
print(`Berhasil mengimpor ${importResult.insertedIds.length} rute.`);

const indexName = routes.createIndex({ geometry: "2dsphere" });
print(`Indeks geospasial aktif: ${indexName}`);

const centralPoint = {
  type: "Point",
  coordinates: [107.58, -6.9],
};

print("\n1. Rute terdekat dalam radius 5 km ($near):");
routes
  .find(
    {
      geometry: {
        $near: {
          $geometry: centralPoint,
          $maxDistance: 5000,
        },
      },
    },
    { _id: 0, "properties.id": 1, "properties.name": 1 }
  )
  .forEach((route) => printjson(route));

print("\n2. Rute yang seluruh geometri-nya berada di area studi ($geoWithin):");
routes
  .find(
    {
      geometry: {
        $geoWithin: {
          $geometry: {
            type: "Polygon",
            coordinates: [[
              [107.52, -6.96],
              [107.7, -6.96],
              [107.7, -6.85],
              [107.52, -6.85],
              [107.52, -6.96],
            ]],
          },
        },
      },
    },
    { _id: 0, "properties.id": 1, "properties.name": 1 }
  )
  .forEach((route) => printjson(route));

print("\n3. Rute yang berpotongan dengan area pusat Bandung ($geoIntersects):");
routes
  .find(
    {
      geometry: {
        $geoIntersects: {
          $geometry: {
            type: "Polygon",
            coordinates: [[
              [107.55, -6.92],
              [107.62, -6.92],
              [107.62, -6.86],
              [107.55, -6.86],
              [107.55, -6.92],
            ]],
          },
        },
      },
    },
    { _id: 0, "properties.id": 1, "properties.name": 1 }
  )
  .forEach((route) => printjson(route));

print("\n4. Lima rute terdekat dengan titik pusat ($geoNear):");
routes
  .aggregate([
    {
      $geoNear: {
        near: centralPoint,
        distanceField: "distance_meters",
        spherical: true,
        key: "geometry",
      },
    },
    {
      $project: {
        _id: 0,
        "properties.id": 1,
        "properties.name": 1,
        distance_meters: 1,
      },
    },
    { $limit: 5 },
  ])
  .forEach((route) => printjson(route));
