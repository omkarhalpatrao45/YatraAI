from sqlalchemy import Column, Integer, String, Float, DateTime, ForeignKey, Text
from sqlalchemy.orm import relationship
from datetime import datetime
from app.database.db import Base

class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    email = Column(String, unique=True, index=True, nullable=False)
    password_hash = Column(String, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    trips = relationship("Trip", back_populates="user", cascade="all, delete")

class Trip(Base):
    __tablename__ = "trips"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    destination = Column(String, nullable=False)
    budget = Column(Float, nullable=False)
    start_date = Column(String, nullable=False)
    end_date = Column(String, nullable=False)
    travelers = Column(Integer, default=1)
    interests = Column(String, default="")
    itinerary_json = Column(Text, default="{}")
    created_at = Column(DateTime, default=datetime.utcnow)
    user = relationship("User", back_populates="trips")
    expenses = relationship("Expense", back_populates="trip", cascade="all, delete")

class Expense(Base):
    __tablename__ = "expenses"
    id = Column(Integer, primary_key=True, index=True)
    trip_id = Column(Integer, ForeignKey("trips.id"), nullable=False)
    title = Column(String, nullable=False)
    amount = Column(Float, nullable=False)
    category = Column(String, nullable=False)
    expense_date = Column(String, nullable=False)
    trip = relationship("Trip", back_populates="expenses")
