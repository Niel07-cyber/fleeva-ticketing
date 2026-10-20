import json
from pathlib import Path

from fleeva_venue.cli import main
from fleeva_venue.generator import STANDS, build_layout

COMMITTED = Path(__file__).parents[3] / "apps/web/public/venues/fleeva-arena/v1/layout.json"


def test_stand_spans_cover_the_full_circle() -> None:
    assert sum(s.end - s.start for s in STANDS) == 360


def test_capacity_is_close_to_32000() -> None:
    assert 30_000 <= build_layout()["capacity"] <= 34_000


def test_block_ids_are_unique_and_listed_in_their_stand() -> None:
    layout = build_layout()
    ids = [b["blockId"] for b in layout["blocks"]]
    assert len(ids) == len(set(ids))
    listed = [i for s in layout["stands"] for i in s["blocks"]]
    assert sorted(listed) == sorted(ids)


def test_back_rows_have_more_seats_than_front_rows() -> None:
    block = build_layout()["blocks"][0]
    assert block["rows"][-1]["seats"] > block["rows"][0]["seats"]


def test_every_block_category_is_defined() -> None:
    layout = build_layout()
    assert {b["category"] for b in layout["blocks"]} <= set(layout["categories"])


def test_generation_is_deterministic() -> None:
    assert build_layout() == build_layout()


def test_committed_layout_is_up_to_date(tmp_path: Path) -> None:
    out = tmp_path / "layout.json"
    main([str(out)])
    assert json.loads(out.read_text()) == json.loads(COMMITTED.read_text()), (
        "layout.json is stale: run `make venue`"
    )
