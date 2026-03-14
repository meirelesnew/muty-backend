from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import create_engine, Column, Integer, String
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, Session
import os
from dotenv import load_dotenv

# Carrega o DATABASE_URL do arquivo .env
load_dotenv()
DATABASE_URL = os.getenv("DATABASE_URL")

# Configura o Banco de Dados
engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

# Modelo de Tabela
class Item(Base):
    __tablename__ = "items"
    id = Column(Integer, primary_key=True, index=True)
    nome = Column(String)

Base.metadata.create_all(bind=engine)

app = FastAPI()

# --- CONFIGURAÇÃO DE CORS ---
# Isso permite que o seu Frontend (Dashboard) acesse os dados aqui
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Permite qualquer origem (ideal para desenvolvimento)
    allow_credentials=True,
    allow_methods=["*"],  # Permite GET, POST, etc.
    allow_headers=["*"],
)

# Dependência do Banco
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@app.get("/")
def read_root():
    return {"status": "Online", "msg": "Muty Backend Ativo"}

@app.get("/items")
def list_items(db: Session = Depends(get_db)):
    return db.query(Item).all()