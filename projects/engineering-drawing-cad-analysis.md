# Engineering Drawing & CAD Analysis

> Research on turning point clouds into room models and 2D plans, alongside mechanical CAD projection and drawing analysis.

## Summary
My engineering-geometry work at Riverstart covers two distinct problems. The building prototype infers a room model from a point cloud and exports floor plans. The mechanical-part research evaluates scans against reference CAD and projects supplied STEP models into engineering views. The examples below show the actual data and geometry behind each track.

## Building point cloud -> room model -> floor plan
The building prototype reads XYZ or NumPy point clouds with declared units, estimates rectangular room bounds and detects door/window openings from gaps in the wall points. These are geometric methods; wall thickness is a declared input. A semantic model records the room, walls and openings, supplying both the 3D visualization and 2D floor-plan exports. The figures use a saved synthetic fixture, with its original point cloud, geometry JSON and SVG plan available below.

## Mechanical scans, reference CAD and engineering views
The mechanical track evaluates scan-to-reference registration separately from STEP-to-drawing projection. It compares Open Cascade, CadQuery and build123d routes, checks visible and hidden edges, and compares generated views with supplied drawings. The through-bore example below isolates the projection stage with known analytic geometry. A reference STEP used for registration is an input, not a model reconstructed from the scan.

## Current stage
The room workflow has passed a synthetic software-path test; real-building reconstruction still needs reference data and engineering acceptance. It currently assumes a single axis-aligned room. IFC export is experimental, with cross-format opening placement under review. Mechanical results establish registration and projection baselines; arbitrary scan-to-parametric CAD and manufacturing-ready drawing generation remain separate research goals.

## Project Figures

![The same synthetic room shown as an XYZ point cloud, inferred 3D wall and opening geometry, and the exported 2D floor plan](https://zack-dev-cm.github.io/docs/images/point-cloud-room-workflow-v1.webp)

Building prototype: saved point-cloud input, a 3D rendering of the inferred semantic room model, and its actual SVG floor plan. This is one synthetic room test; the 3D view renders semantic JSON, not the experimental IFC export.

![Detailed comparison of the synthetic room point cloud and inferred walls with a door and window at matching positions](https://zack-dev-cm.github.io/docs/images/point-cloud-room-model-v1.webp)

Building prototype, enlarged: the input points and inferred room geometry share the same coordinates and viewpoint. Transparency reveals the interior and openings.

![Actual STEP rendering of a synthetic through-bore block, shown in an orthographic 3D view with millimeter axes](https://zack-dev-cm.github.io/docs/images/cad-analytic-fixture-source.webp)

Separate mechanical CAD track: a synthetic through-bore STEP fixture for projection and hidden-line tests. This solid is a supplied test input.

![XY and XZ projections of the same synthetic block, with solid visible edges and dashed hidden bore edges](https://zack-dev-cm.github.io/docs/images/cad-analytic-fixture-projections.webp)

Mechanical CAD output: generated XY and XZ views of the same through-bore fixture, with visible edges in solid lines and hidden edges dashed.

## Project Link
https://zack-dev-cm.github.io/projects/engineering-drawing-cad-analysis.md

## Key Features
- Infer axis-aligned room boundaries, walls and rectangular openings from XYZ point clouds
- Represent inferred geometry as a semantic room model and export 2D DXF/SVG floor plans
- Evaluate mechanical scan registration against supplied CAD references
- Generate visible and hidden 2D edges from STEP models using Open Cascade
- Preserve source geometry and outputs for comparison and engineering review

## Tech Stack
- Python
- Open Cascade
- CadQuery
- build123d
- NumPy
- SciPy
- IfcOpenShell
- ezdxf
- Geometry Processing

## Links
- [Inspect the generated room floor plan (SVG)](https://zack-dev-cm.github.io/docs/artifacts/point-cloud-room-demo/floor-plan.svg)
- [Inspect the inferred room geometry (JSON)](https://zack-dev-cm.github.io/docs/artifacts/point-cloud-room-demo/semantic-model.json)
- [Download the synthetic point-cloud input (XYZ)](https://zack-dev-cm.github.io/docs/artifacts/point-cloud-room-demo/synthetic-room.xyz)
- [Inspect the mechanical fixture projections (SVG)](https://zack-dev-cm.github.io/docs/images/cad-analytic-fixture-hlr-source.svg)
