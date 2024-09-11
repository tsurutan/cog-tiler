export const tileToLng = (x: number, z: number) => {
    return x * 360 / Math.pow(2,z) - 180;
}

export const tileToLat = (y: number, z: number) => {
    return Math.atan(Math.sinh(Math.PI - y * 2 * Math.PI / Math.pow(2,z))) * (180 / Math.PI);
}
