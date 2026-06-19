from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    SECRET_KEY: str = "fallback-secret-key-change-this"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 10080
    DATABASE_URL: str = "sqlite:///./yatraai.db"
    OPENAI_API_KEY: str = ""
    OPENWEATHER_API_KEY: str = ""

    class Config:
        env_file = ".env"

settings = Settings()
