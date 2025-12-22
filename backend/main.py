import os

import uvicorn
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager

from srcs.database import create_db_and_tables
from srcs.routes import auth, session, report, police, utility

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup
    create_db_and_tables()
    yield
    # Shutdown

app = FastAPI(title="mySettle Backend", lifespan=lifespan)

# CORS: Allow All for Demo
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include Routers
app.include_router(auth.router)
app.include_router(session.router)
app.include_router(report.router)
app.include_router(police.router)
app.include_router(utility.router)

@app.get("/")
def read_root():
    return {"message": "mySettle Backend is Running 🚀"}


if __name__ == "__main__":
    import uvicorn
    from srcs.config import HOST, PORT
    uvicorn.run(
        "main:app",
        host=HOST,
        port=PORT,
        reload=True
    )