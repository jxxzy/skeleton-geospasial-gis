"""Validate route GeoJSON before publishing; Python 3 standard library only."""
import json
import math
import sys
from pathlib import Path

DEFAULT_DATA = Path(__file__).resolve().parents[1] / "data/rute-cimahi-bandung.geojson"


def is_number(value):
    return type(value) in (int, float) and math.isfinite(value)


def is_position(value):
    return (
        isinstance(value, list)
        and len(value) >= 2
        and all(is_number(v) for v in value)
        and -180 <= value[0] <= 180
        and -90 <= value[1] <= 90
    )


def validate(data):
    errors = []
    if not isinstance(data, dict) or data.get("type") != "FeatureCollection":
        return ["Expected a GeoJSON FeatureCollection."]
    features = data.get("features")
    if not isinstance(features, list) or not features:
        return ["Expected a nonempty features list."]
    seen_ids = set()
    vertices = 0
    for index, feature in enumerate(features, 1):
        prefix = f"Feature {index}"
        if not isinstance(feature, dict) or feature.get("type") != "Feature":
            errors.append(f"{prefix}: invalid Feature.")
            continue
        props = feature.get("properties")
        geometry = feature.get("geometry")
        if not isinstance(props, dict) or not isinstance(geometry, dict):
            errors.append(f"{prefix}: missing properties or geometry.")
            continue
        route_id = props.get("id")
        if not isinstance(route_id, str) or not route_id.strip():
            errors.append(f"{prefix}: missing route ID.")
        elif route_id in seen_ids:
            errors.append(f"{prefix}: duplicate route ID {route_id}.")
        else:
            seen_ids.add(route_id)
        for key in ("distance_m", "duration_s"):
            value = props.get(key)
            if not is_number(value) or value <= 0:
                errors.append(f"{prefix}: {key} must be positive and finite.")
        for key in ("origin_coordinates", "destination_coordinates"):
            if not is_position(props.get(key)):
                errors.append(f"{prefix}: invalid {key}.")
        points = geometry.get("coordinates")
        if geometry.get("type") != "LineString" or not isinstance(points, list) or len(points) < 2:
            errors.append(f"{prefix}: expected a LineString with at least two positions.")
            continue
        vertices += len(points)
        for position_index, point in enumerate(points, 1):
            if not is_position(point):
                errors.append(f"{prefix}: invalid coordinate at position {position_index}.")
                break
        if props.get("vertex_count") != len(points):
            errors.append(f"{prefix}: vertex_count does not match actual coordinates.")
    metadata = data.get("metadata")
    if not isinstance(metadata, dict) or metadata.get("polyline_vertex_count") != vertices:
        errors.append("metadata.polyline_vertex_count does not match total coordinates.")
    return errors


def main():
    path = Path(sys.argv[1]) if len(sys.argv) > 1 else DEFAULT_DATA
    try:
        data = json.loads(path.read_text(encoding="utf-8"))
    except (OSError, UnicodeError, ValueError) as exc:
        print(f"Cannot read {path}: {exc}", file=sys.stderr)
        return 1
    errors = validate(data)
    if errors:
        for error in errors:
            print(error, file=sys.stderr)
        return 1
    print(f"Validated {len(data['features'])} routes in {path}.")
    return 0


if __name__ == "__main__":
    sys.exit(main())
