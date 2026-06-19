from pydantic import BaseModel
from datetime import datetime

class ExpenseCreate(BaseModel):
    trip_id: int
    title: str
    amount: float
    category: str
    expense_date: str

class ExpenseUpdate(BaseModel):
    title: str
    amount: float
    category: str
    expense_date: str

class ExpenseOut(BaseModel):
    id: int
    trip_id: int
    title: str
    amount: float
    category: str
    expense_date: str

    class Config:
        from_attributes = True
