
# cog-tiler

## Overview
This package allows you to read Cloud Optimized GeoTIFF (COG) files and generate PNG images from xyz tiles. It utilizes `geotiff.js` and `node-canvas` under the hood.

## Installation
```bash
npm install cog-tiler
```

## Usage Example
```javascript
app.get('/tiles/:z/:x/:y', async (req, res) => {
    const {x: xs,y: ys,z: zs} = req.params;
    const x = Number(xs);
    const y = Number(ys);
    const z = Number(zs);
    const tiff = await fromFile(path.resolve(process.cwd(), "data/sample.tif"));
    const image = await tiff.readImage(x, y, z);
    tiff.close();
    res.setHeader("Content-Type", "image/png");
    res.send(image);
});
```

## License
MIT
