/**
 * Created by nico on 09.09.16.
 */
import $ from 'jquery';

export const serverRequest = (cb) => {
    return $.ajax({
            type: "GET",
            url: window.location.protocol + '//' + window.location.hostname + ':' + 3001 + '/api/list',
            error: (xhr, status, error) => {
                console.log("Error: " + xhr.responseText);
            },
            success: cb
        }
    )
};
export const isSamePosition = (posA, posB) => Boolean(posA.lat === posB.lat && posA.lng === posB.lng);
export const hasGPSattached = (item) => Boolean(item && item.gps && item.gps.lat && item.gps.lng);