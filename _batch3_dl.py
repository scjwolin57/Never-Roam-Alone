import json, os, time
import requests
from concurrent.futures import ThreadPoolExecutor, as_completed

with open("/tmp/b3_work/download_list.json") as f:
    items = json.load(f)

HEADERS = {"User-Agent": "NeverRoamAloneBot/1.0 (contact: jcwolinsky@gmail.com) research/photo-sourcing"}
OUTDIR = "/tmp/b3_work/dl"
os.makedirs(OUTDIR, exist_ok=True)

def is_good(path):
    if not os.path.exists(path) or os.path.getsize(path) < 2000:
        return False
    with open(path, "rb") as f:
        head = f.read(20)
    if head.startswith(b"<!DOCTYPE") or head.startswith(b"<html") or head.startswith(b"<?xml"):
        return False
    return True

def download(it):
    path = os.path.join(OUTDIR, it["fname"])
    if is_good(path):
        return (it["fname"], True)
    sess = requests.Session()
    sess.headers.update(HEADERS)
    for attempt in range(4):
        try:
            r = sess.get(it["url"], timeout=20)
            if r.status_code == 200 and not r.content[:20].startswith(b"<!DOCTYPE") and not r.content[:20].startswith(b"<html"):
                with open(path, "wb") as f:
                    f.write(r.content)
                return (it["fname"], True)
            time.sleep(2 + attempt * 2)
        except Exception:
            time.sleep(2 + attempt * 2)
    return (it["fname"], False)

todo = [it for it in items if not is_good(os.path.join(OUTDIR, it["fname"]))]
print(f"{len(todo)} to download out of {len(items)}")

ok, fail = 0, []
with ThreadPoolExecutor(max_workers=4) as ex:
    futs = [ex.submit(download, it) for it in todo]
    for fut in as_completed(futs):
        fname, success = fut.result()
        if success:
            ok += 1
        else:
            fail.append(fname)

print("ok:", ok, "fail:", len(fail))
for f in fail:
    print("FAIL:", f)
