from __future__ import annotations
from typing import List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database.db import get_db
from app.schemas.expense import ExpenseCreate, ExpenseUpdate, ExpenseOut
from app.repositories.expense_repo import create_expense, get_expenses_by_trip, update_expense, delete_expense
from app.repositories.trip_repo import get_trip
from app.core.security import get_current_user
from app.models.models import User

router = APIRouter(prefix="/expenses", tags=["expenses"])

@router.post("", response_model=ExpenseOut)
def add_expense(expense: ExpenseCreate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    trip = get_trip(db, expense.trip_id, current_user.id)
    if not trip:
        raise HTTPException(status_code=404, detail="Trip not found")
    return create_expense(db, expense)

@router.get("/{trip_id}", response_model=List[ExpenseOut])
def list_expenses(trip_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    trip = get_trip(db, trip_id, current_user.id)
    if not trip:
        raise HTTPException(status_code=404, detail="Trip not found")
    return get_expenses_by_trip(db, trip_id)

@router.put("/{expense_id}", response_model=ExpenseOut)
def edit_expense(expense_id: int, data: ExpenseUpdate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    exp = update_expense(db, expense_id, data)
    if not exp:
        raise HTTPException(status_code=404, detail="Expense not found")
    return exp

@router.delete("/{expense_id}")
def remove_expense(expense_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    if not delete_expense(db, expense_id):
        raise HTTPException(status_code=404, detail="Expense not found")
    return {"message": "Expense deleted"}
