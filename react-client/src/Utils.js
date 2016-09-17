/**
 * Created by nico on 09.09.16.
 */

export const isSamePosition = (posA, posB) => (hasGPSattached(posA) && hasGPSattached(posB) && posA.lat === posB.lat && posA.lng === posB.lng);
export const hasGPSattached = (item) => Boolean(item && item.gps && item.gps.lat && item.gps.lng);