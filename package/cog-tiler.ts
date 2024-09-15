import {createCanvas} from 'canvas';
import GeoTIFF, { fromFile as readGeoTiffFromFile } from 'geotiff';
import {tileToLat, tileToLng} from './utils.js';

class COGeoTiff {
    constructor(private readonly tiff: GeoTIFF, private readonly size: number = 256) {
    }

    async readImage(x: number, y: number, z: number) {
        const minLng = tileToLng(x, z);
        const minLat = tileToLat(y, z);
        const maxLng = tileToLng(x + 1, z);
        const maxLat = tileToLat(y + 1, z);
        const bbox = [minLng, minLat, maxLng, maxLat];
        const raster = await this.tiff.readRasters({
            bbox,
            height: this.size,
            width: this.size,
            interleave: true,
            samples: [0, 1, 2]
        })
        const canvas = createCanvas(this.size, this.size);
        const cxt = canvas.getContext("2d")
        const imageData = cxt.createImageData(this.size, this.size);

        for (let i = 0, j = 0; i < imageData.data.length; i += 4) {
            imageData.data[i] = raster[j] as number;
            imageData.data[i + 1] = raster[j + 1] as number;
            imageData.data[i + 2] = raster[j + 2] as number;
            const alpha = imageData.data[i] + imageData.data[i + 1] + imageData.data[i + 2]
            imageData.data[i + 3] = alpha === 0 ? 0 : 255;
            j += 3;
        }
        cxt.putImageData(imageData, 0, 0)
        return canvas.toBuffer("image/png");
    }

    close() {
        this.tiff.close();
    }
}

export const fromFile = async (path: string) => {
    const tiff = await readGeoTiffFromFile(path);
    return new COGeoTiff(tiff);
}
