"""Export the PR regression using two installed, source-verified Python packages."""
import argparse
import json
import subprocess
from pathlib import Path

IDENTITIES = {
    "baseline": ("a8a2eb458f89114dd531f2767871c4d7d665dcc0", "2049ba8a5b1400023c6dbeef74b926cb975b9f05456116894e9ec18574641fd1"),
    "proposed": ("2ecb4b18997b9435f3c518f4462a34e68cffd4aa", "3e90979dd7b6bc6bc6a4ca0745b64e266f015a88a2b1961060b32fb6f82fee2e"),
}
RUN = r'''
import hashlib, importlib.metadata, json
from pathlib import Path
import numpy as np
from astropy.wcs import WCS
from astropy.wcs.utils import pixel_to_pixel
from reproject import reproject_interp
from reproject._wcs_utils import pixel_to_pixel_chunked
import reproject._wcs_utils as module

class PartialInverseWCS(WCS):
    def world_to_pixel_values(self, *world):
        x, y = super().world_to_pixel_values(*world)
        return np.where(x > 0, np.nan, x), y

def clean(value):
    if isinstance(value, np.ndarray): return clean(value.tolist())
    if isinstance(value, (list, tuple)): return [clean(x) for x in value]
    if isinstance(value, (float, np.floating)) and not np.isfinite(value): return "NaN"
    if isinstance(value, np.generic): return value.item()
    return value

source, target = WCS(naxis=2), PartialInverseWCS(naxis=2)
x, y = np.array([0., 1.]), np.array([0., 0.])
world = target.pixel_to_world_values(x, y)
mapped = pixel_to_pixel(target, source, x, y)
inverse = pixel_to_pixel(source, target, *mapped)
validated = pixel_to_pixel_chunked(target, source, x, y, roundtrip=True)
array, footprint = reproject_interp((np.array([[1., 2.]]), source), target, shape_out=(1, 2), order="nearest-neighbor")
print(json.dumps({
    "transformationModuleSha256": hashlib.sha256(Path(module.__file__).read_bytes()).hexdigest(),
    "dependencies": {name: importlib.metadata.version(name) for name in ["reproject", "numpy", "astropy"]},
    "output": clean(array), "footprint": clean(footprint),
    "pixels": [{"outputPixel": [float(x[i]), float(y[i])], "world": clean([a[i] for a in world]),
                "sourcePixel": clean([a[i] for a in mapped]), "inverseOutputPixel": clean([a[i] for a in inverse]),
                "validatedSourcePixel": clean([a[i] for a in validated]),
                "distanceRejects": bool(any(abs(a[i] - b[i]) > 1 for a, b in zip(inverse, [x,y]))),
                "inverseFinite": bool(all(np.isfinite(a[i]) for a in inverse)),
                "accepted": bool(all(np.isfinite(a[i]) for a in validated))} for i in range(2)]
}, allow_nan=False))
'''

def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--baseline-python", required=True)
    parser.add_argument("--proposed-python", required=True)
    parser.add_argument("--out", type=Path, default=Path("public/contribution-lab/reproject-fixture.json"))
    args = parser.parse_args()
    versions = {}
    for label, interpreter in [("baseline", args.baseline_python), ("proposed", args.proposed_python)]:
        value = json.loads(subprocess.check_output([interpreter, "-I", "-c", RUN], text=True))
        sha, checksum = IDENTITIES[label]
        assert value["transformationModuleSha256"] == checksum, f"Unexpected {label} transformation source"
        value["transformationSourceCommit"] = sha
        versions[label] = value
    assert versions["baseline"]["output"] == [[1., 2.]]
    assert versions["baseline"]["footprint"] == [[1., 1.]]
    assert versions["proposed"]["output"] == [[1., "NaN"]]
    assert versions["proposed"]["footprint"] == [[1., 0.]]
    fixture = {
        "schemaVersion": 1,
        "source": "https://github.com/astropy/reproject/pull/630",
        "regression": "test_reproject_undefined_inverse",
        "input": [[1., 2.]], "shapeOut": [1, 2], "interpolation": "nearest-neighbor",
        "coordinateMeaning": "Output grid to source grid, then inverse back to output grid. World coordinates are the linear WCS regression values, not sky degrees.",
        "provenance": "Actual installed-package execution; transformation module hashes match the pinned upstream base and submitted PR head. Package versions are recorded separately. This verifies the two-pixel fixture, not the full upstream suite.",
        **versions,
    }
    args.out.parent.mkdir(parents=True, exist_ok=True)
    args.out.write_text(json.dumps(fixture, indent=2, allow_nan=False) + "\n")
    print(json.dumps({"fixture": str(args.out), "baseline": versions["baseline"]["output"], "proposed": versions["proposed"]["output"], "footprint": versions["proposed"]["footprint"]}))

if __name__ == "__main__":
    main()
