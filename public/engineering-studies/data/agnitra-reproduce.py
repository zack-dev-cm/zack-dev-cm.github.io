"""Run a small, deterministic CPU profiling example with Agnitra 0.2.4.

Install: python -m pip install 'agnitra==0.2.4'
Run:     python reproduce.py

This randomly initialized network is a profiling fixture. It is not a trained
model, an optimization comparison, or a performance benchmark.
"""
from pathlib import Path
import json
import os
import platform

os.environ["CUDA_VISIBLE_DEVICES"] = "-1"
import torch
from cli.profile import run


def main():
    torch.manual_seed(7)
    torch.set_num_threads(1)
    output = Path("agnitra-example-output")
    output.mkdir(exist_ok=True)
    model = torch.nn.Sequential(
        torch.nn.Conv2d(3, 8, kernel_size=3, padding=1),
        torch.nn.ReLU(),
        torch.nn.AdaptiveAvgPool2d((1, 1)),
        torch.nn.Flatten(),
        torch.nn.Linear(8, 4),
    ).eval()
    model_path = output / "sample_convnet.pt"
    # Only load the fixture created by this script; do not use untrusted files.
    torch.save(model, model_path)
    status = run(model_path, (1, 3, 32, 32), output / "telemetry.json", output)
    if status:
        raise SystemExit(status)
    result = json.loads((output / "profile_result_sample_convnet.json").read_text())
    model_profile = result["model_profile"]
    assert model_profile["parameter_count_total"] == 260
    assert result["summary"]["num_events"] > 0
    report = {
        "example": "Agnitra CPU profiling example",
        "package_release": "0.2.4",
        "scope": "Recorded shapes from a randomly initialized profiling fixture; no optimization or accuracy comparison.",
        "environment": {"device": result["device"], "python": platform.python_version(), "pytorch": torch.__version__},
        "input_shape": [1, 3, 32, 32],
        "output_shape": [1, 4],
        "dtype": model_profile["model_dtype"],
        "layers": [
            {key: layer[key] for key in ["name", "type", "input_shapes", "output_shapes", "output_dtype"]}
            for layer in model_profile["layers"] if layer["name"]
        ],
        "recorded_operators": [event["name"] for event in result["summary"]["top_by_time"]],
    }
    (output / "shape-report.json").write_text(json.dumps(report, indent=2) + "\n")
    print("Recorded model structure and operator events in", output)


if __name__ == "__main__":
    main()
