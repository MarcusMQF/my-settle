import requests
import os
import contextily as ctx
import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt


import asyncio

class MapService:
    @staticmethod
    def _generate_scene_sketch_sync(lat: float, lon: float) -> str:
        """
        Synchronous implementation of scene sketch generation.
        :param lat: latitude
        :param lon: longitude
        :return: Base64 encoded image
        """
        # 1. Define the area (small buffer around the point)
        # 0.001 degrees is roughly 100 meters
        d = 0.001
        west, south = lon - d, lat - d
        east, north = lon + d, lat + d

        print(f"Fetching satellite data for {lat}, {lon}...")

        # 2. Download the image from Esri World Imagery
        # source=ctx.providers.Esri.WorldImagery is the key here
        image, extent = ctx.bounds2img(
            west, south, east, north,
            ll=True,  # Input coordinates are Lat/Lon (WGS84)
            source=ctx.providers.Esri.WorldImagery,
            zoom=19
        )

        # 3. Save the image nicely
        # We use matplotlib to save it without axes/borders
        fig = plt.figure(frameon=False)
        fig.set_size_inches(6, 6)  # Image size
        ax = plt.Axes(fig, [0., 0., 1., 1.])
        ax.set_axis_off()
        fig.add_axes(ax)

        ax.imshow(image, extent=extent, aspect='auto')

        # Save to in-memory buffer
        import io
        import base64

        buf = io.BytesIO()
        fig.savefig(buf, format='png', dpi=400, bbox_inches='tight', pad_inches=0)
        plt.close(fig)

        buf.seek(0)
        img_base64 = base64.b64encode(buf.read()).decode('utf-8')

        print(f"Success! Generated base64 image.")
        return img_base64

    @staticmethod
    async def generate_scene_sketch(lat: float, lon: float) -> str:
        """
        Async wrapper for sketch generation to prevent blocking.
        """
        return await asyncio.to_thread(MapService._generate_scene_sketch_sync, lat, lon)