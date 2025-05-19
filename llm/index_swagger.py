import os, hashlib, pathlib, concurrent.futures, json
from langchain_chroma import Chroma
from langchain_ollama import OllamaEmbeddings
from langchain_text_splitters import Language, RecursiveCharacterTextSplitter, RecursiveJsonSplitter
from pathspec import PathSpec
from tqdm import tqdm

REPO = pathlib.Path("/Users/arai1/Godaddy/clone/diablo-prov-api/swagger/v1/")
DB   = "./swagger_chroma"
EMB  = OllamaEmbeddings(model="nomic-embed-text:latest")
MAX_BATCH_SIZE = 40000  

# --------- helper: honour .gitignore ----------

def wanted(p: pathlib.Path) -> bool:
    return p.is_file()

# --------- choose language splitter ----------
# lang_map = {
#     ".json": Language.JSON,
# }

def split_file(path: pathlib.Path):
    json_path = REPO / "swagger.json"
    with open(json_path, "r", encoding="utf-8") as f:
        json_data = json.load(f)  # Parsed JSON

    splitter = RecursiveJsonSplitter(max_chunk_size=300)

    for chunk in splitter.split_json(json_data):
        chunk_str = json.dumps(chunk, sort_keys=True)  # Convert dict -> string
        yield chunk_str, {
            "path": str(path.relative_to(REPO)),
            "hash": hashlib.md5(chunk_str.encode("utf-8")).hexdigest(),
            "mod_time": path.stat().st_mtime
        }



# --------- build / update index ----------
chroma = Chroma(persist_directory=DB, embedding_function=EMB)

def process(path):
    docs = list(split_file(path))
    new = [d for d in docs if not chroma.get(where={"hash": d[1]["hash"]})["ids"]]
    if new:
        for i in range(0, len(new), MAX_BATCH_SIZE):
            batch = new[i:i + MAX_BATCH_SIZE]
            chroma.add_texts([t for t, _ in batch],
                            metadatas=[m for _, m in batch])
        
all_files = list(filter(wanted, REPO.rglob("*")))
print(f"Found {len(all_files)} files to process.")

for path in tqdm(all_files, desc="Indexing files"):
    process(path)

print("✅ Index up‑to‑date:", DB)




