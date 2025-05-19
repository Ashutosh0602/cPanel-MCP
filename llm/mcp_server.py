from mcp.server.fastmcp import FastMCP, Context
from langchain_chroma import Chroma
from langchain_ollama import OllamaEmbeddings

DB_DIR   = "./swagger_chroma"
embedding_function = OllamaEmbeddings(model="nomic-embed-text:latest")
VECTOR_DB = Chroma(persist_directory=DB_DIR, embedding_function=embedding_function) 


mcp = FastMCP("Codebase QA Server")          # server name visible to clients

@mcp.tool(description="Ask any question about the local codebase")
def ask_code(question: str, k: int = 20) -> str:
    """Semantic search + RAG answer over the indexed repo."""
    docs = VECTOR_DB.similarity_search(question, k=k)
    snippets = "\n\n".join(f"{d.metadata['path']}:\n{d.page_content[:400]}…" for d in docs)
    # answer = chain.run(question=question, snippets=snippets)
     # Prepare a clean context to pass to the LLM via mcphost
    formatted_context = (
        f"### Relevant code snippets for:\n"
        f"**{question}**\n\n"
        f"{snippets}\n\n"
        f"(Note: If unsure, recommend where to check next.)"
    )
    # ctx.markdown(answer)                     # nicely formatted for rich clients
    return formatted_context

# if __name__ == "__main__":
#     # HTTP is handy for multi‑process; stdio works for Cursor / VS Code
#     mcp.run(transport="http", host="127.0.0.1", port=3333)

if __name__ == "__main__":
    # Initialize and run the server
    mcp.run(transport='stdio')




