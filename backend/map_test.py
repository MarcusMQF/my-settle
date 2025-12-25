import contextily as ctx
import matplotlib.pyplot as plt


def get_free_satellite_image(lat, lon, zoom=19, filename="free_sat_view.jpg"):
    # 1. Define the area (small buffer around the point)
    # 0.001 degrees is roughly 100 meters
    d = 0.001
    west, south = lon - d, lat - d
    east, north = lon + d, lat + d

    print(f"Fetching satellite data for {lat}, {lon}...")

    try:
        # 2. Download the image from Esri World Imagery
        # source=ctx.providers.Esri.WorldImagery is the key here
        image, extent = ctx.bounds2img(
            west, south, east, north,
            ll=True,  # Input coordinates are Lat/Lon (WGS84)
            source=ctx.providers.Esri.WorldImagery,
            zoom=zoom
        )

        # 3. Save the image nicely
        # We use matplotlib to save it without axes/borders
        fig = plt.figure(frameon=False)
        fig.set_size_inches(6, 6)  # Image size
        ax = plt.Axes(fig, [0., 0., 1., 1.])
        ax.set_axis_off()
        fig.add_axes(ax)

        ax.imshow(image, extent=extent, aspect='auto')
        fig.savefig(filename, dpi=400, bbox_inches='tight', pad_inches=0)
        plt.close(fig)

        print(f"Success! Saved as {filename}")

    except Exception as e:
        print(f"Error: {e}")


# Example: Coordinate in Petaling Jaya, Malaysia
# Try this to see if it works for your location
get_free_satellite_image(1.54978, 103.78092)