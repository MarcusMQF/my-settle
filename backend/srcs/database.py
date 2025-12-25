from sqlmodel import SQLModel, create_engine, Session

from sqlmodel.pool import StaticPool

sqlite_url = "sqlite://" # In-memory database

connect_args = {"check_same_thread": False}
engine = create_engine(sqlite_url, connect_args=connect_args, poolclass=StaticPool)


def create_db_and_tables():
    SQLModel.metadata.create_all(engine)


def get_session():
    with Session(engine) as session:
        yield session
