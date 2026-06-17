import os
import json

fotos = sorted(
    [
        f
        for f in os.listdir("fotos")
        if f.lower().endswith(
            (".jpg",".jpeg",".png",".webp")
        )
    ]
)

with open(
    "fotos.json",
    "w",
    encoding="utf-8"
) as f:

    json.dump(
        fotos,
        f,
        ensure_ascii=False,
        indent=2
    )
