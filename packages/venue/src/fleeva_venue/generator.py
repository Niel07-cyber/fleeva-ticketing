"""Builds the Fleeva Arena layout from a compact definition.

The bowl is an ellipse. Every block is an annular sector of it, described by an
angular span (degrees, 0 = east, clockwise because SVG y points down) and a
radial band (a scale factor applied to the base ellipse radii). Seat positions
are not stored: clients derive them from the block geometry and per-row counts.
"""

import math
from dataclasses import dataclass
from typing import Any

VENUE_ID = "fleeva-arena"
VERSION = 1
VIEW_BOX = (1200, 900)
BOWL = {"cx": 600.0, "cy": 450.0, "rx": 280.0, "ry": 210.0}
PITCH = {"x": 420, "y": 300, "w": 360, "h": 300}

# Radial bands as scale factors on the base ellipse (1.0 = innermost edge).
LOWER_BAND = (1.0, 1.44)
UPPER_BAND = (1.52, 2.0)
ROWS_PER_TIER = {"lower": 20, "upper": 26}

# Tuned so total capacity lands near 32,000.
SEAT_PITCH = 3.15
AISLE_DEG = 0.8
CURVE_STEPS = 10


@dataclass(frozen=True)
class Stand:
    stand_id: str
    name: str
    start: float
    end: float
    blocks_per_tier: int


# Clockwise from the north stand. Spans sum to 360 degrees.
STANDS = [
    Stand("N", "Tribune Nord", 235, 305, 6),
    Stand("NE", "Virage Nord-Est", 305, 340, 1),
    Stand("E", "Tribune Est", 340, 380, 4),
    Stand("SE", "Virage Sud-Est", 20, 55, 1),
    Stand("S", "Tribune Sud", 55, 125, 6),
    Stand("SW", "Virage Sud-Ouest", 125, 160, 1),
    Stand("W", "Tribune Ouest", 160, 200, 4),
    Stand("NW", "Virage Nord-Ouest", 200, 235, 1),
]

CATEGORIES = {
    "CAT1": {"label": "Catégorie 1", "colour": "#1D9E75", "priceCents": 6500},
    "CAT2": {"label": "Catégorie 2", "colour": "#378ADD", "priceCents": 4500},
    "CAT3": {"label": "Catégorie 3", "colour": "#BA7517", "priceCents": 2500},
}


def point(a_deg: float, scale: float) -> tuple[float, float]:
    a = math.radians(a_deg)
    return (
        BOWL["cx"] + BOWL["rx"] * scale * math.cos(a),
        BOWL["cy"] + BOWL["ry"] * scale * math.sin(a),
    )


def arc_length(a0: float, a1: float, scale: float, steps: int = 48) -> float:
    total = 0.0
    prev = point(a0, scale)
    for i in range(1, steps + 1):
        cur = point(a0 + (a1 - a0) * i / steps, scale)
        total += math.dist(prev, cur)
        prev = cur
    return total


def sector_path(a0: float, a1: float, s0: float, s1: float) -> str:
    outer = [point(a0 + (a1 - a0) * i / CURVE_STEPS, s1) for i in range(CURVE_STEPS + 1)]
    inner = [point(a1 - (a1 - a0) * i / CURVE_STEPS, s0) for i in range(CURVE_STEPS + 1)]
    pts = outer + inner
    cmds = [f"{'M' if i == 0 else 'L'} {x:.1f} {y:.1f}" for i, (x, y) in enumerate(pts)]
    return " ".join(cmds) + " Z"


def category_for(stand_id: str, tier: str, index: int, count: int) -> str:
    if len(stand_id) == 2:  # corners
        return "CAT3"
    central = abs(index - (count - 1) / 2) <= 1  # the middle blocks of a long stand
    if tier == "lower":
        return "CAT1" if central and stand_id in ("N", "S") else "CAT2"
    return "CAT2" if central else "CAT3"


def build_block(stand: Stand, tier: str, index: int, number: int) -> dict[str, Any]:
    span = (stand.end - stand.start) / stand.blocks_per_tier
    a0 = stand.start + index * span + AISLE_DEG / 2
    a1 = stand.start + (index + 1) * span - AISLE_DEG / 2
    s0, s1 = LOWER_BAND if tier == "lower" else UPPER_BAND
    row_count = ROWS_PER_TIER[tier]

    rows = []
    for r in range(row_count):
        scale = s0 + (r + 0.5) / row_count * (s1 - s0)
        rows.append({"row": str(r + 1), "seats": int(arc_length(a0, a1, scale) // SEAT_PITCH)})

    label = point((a0 + a1) / 2, (s0 + s1) / 2)
    return {
        "blockId": f"{stand.stand_id}{number}",
        "standId": stand.stand_id,
        "tier": tier,
        "category": category_for(stand.stand_id, tier, index, stand.blocks_per_tier),
        "polygon": sector_path(a0, a1, s0, s1),
        "labelAnchor": [round(label[0], 1), round(label[1], 1)],
        "geometry": {"a0": round(a0, 3), "a1": round(a1, 3), "s0": s0, "s1": s1},
        "rowCount": row_count,
        "rows": rows,
    }


def build_layout() -> dict[str, Any]:
    blocks: list[dict[str, Any]] = []
    stands: list[dict[str, Any]] = []
    for stand in STANDS:
        ids: list[str] = []
        number = 1
        for tier in ("lower", "upper"):
            for i in range(stand.blocks_per_tier):
                block = build_block(stand, tier, i, number)
                blocks.append(block)
                ids.append(block["blockId"])
                number += 1
        stands.append({"standId": stand.stand_id, "name": stand.name, "blocks": ids})

    capacity = sum(r["seats"] for b in blocks for r in b["rows"])
    return {
        "venueId": VENUE_ID,
        "version": VERSION,
        "capacity": capacity,
        "viewBox": [0, 0, *VIEW_BOX],
        "bowl": BOWL,
        "pitch": PITCH,
        "stands": stands,
        "blocks": blocks,
        "categories": CATEGORIES,
    }
