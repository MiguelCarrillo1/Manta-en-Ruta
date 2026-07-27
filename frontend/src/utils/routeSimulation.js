function toRad(deg) { return (deg * Math.PI) / 180; }
function toDeg(rad) { return (rad * 180) / Math.PI; }

export function buildRouteSequence(stops) {
  const ida = stops.filter((s) => s.tramo === 'ida').sort((a, b) => (a.order || 0) - (b.order || 0));
  const regreso = stops.filter((s) => s.tramo === 'regreso').sort((a, b) => (a.order || 0) - (b.order || 0));
  return [...ida, ...regreso];
}

export function calcBearing(lat1, lng1, lat2, lng2) {
  const dLng = toRad(lng2 - lng1);
  const y = Math.sin(dLng) * Math.cos(toRad(lat2));
  const x = Math.cos(toRad(lat1)) * Math.sin(toRad(lat2)) - Math.sin(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.cos(dLng);
  return (toDeg(Math.atan2(y, x)) + 360) % 360;
}

export function interpolate(p1, p2, fraction) {
  return {
    lat: p1.lat + (p2.lat - p1.lat) * fraction,
    lng: p1.lng + (p2.lng - p1.lng) * fraction,
  };
}

export function haversineKm(lat1, lng1, lat2, lng2) {
  const R = 6371;
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);
  const a = Math.sin(dLat / 2) ** 2 + Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

export function createSimulator(line) {
  const sequence = buildRouteSequence(line.stops || []);
  if (sequence.length < 2) return null;

  let segIndex = 0;
  let fraction = 0;
  const SPEED = 0.04;

  function getCurrentPair() {
    const from = sequence[segIndex];
    const to = sequence[(segIndex + 1) % sequence.length];
    return { from, to };
  }

  function tick() {
    fraction += SPEED;
    if (fraction >= 1) {
      fraction = 0;
      segIndex = (segIndex + 1) % sequence.length;
    }
    const { from, to } = getCurrentPair();
    const fLerp = Math.min(fraction, 1);
    const pos = interpolate(
      { lat: parseFloat(from.latitude), lng: parseFloat(from.longitude) },
      { lat: parseFloat(to.latitude), lng: parseFloat(to.longitude) },
      fLerp,
    );
    const bearing = calcBearing(from.latitude, from.longitude, to.latitude, to.longitude);
    const distToNext = haversineKm(pos.lat, pos.lng, parseFloat(to.latitude), parseFloat(to.longitude));
    const nextStop = distToNext < 0.05 ? null : to;
    return { pos, bearing, nextStop, segIndex };
  }

  function reset() {
    segIndex = 0;
    fraction = 0;
  }

  function getNextStop() {
    return sequence[segIndex + 1] || sequence[0];
  }

  return { tick, reset, getNextStop, sequence };
}
