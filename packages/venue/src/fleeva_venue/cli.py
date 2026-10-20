import argparse
import json
from pathlib import Path

from fleeva_venue.generator import build_layout


def main(argv: list[str] | None = None) -> None:
    parser = argparse.ArgumentParser(description="Generate the venue layout.json")
    parser.add_argument("output", type=Path)
    args = parser.parse_args(argv)

    args.output.parent.mkdir(parents=True, exist_ok=True)
    args.output.write_text(json.dumps(build_layout(), indent=1) + "\n", encoding="utf-8")


if __name__ == "__main__":
    main()
