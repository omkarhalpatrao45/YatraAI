from sqlalchemy.orm import Session
from app.models.models import Expense
from app.schemas.expense import ExpenseCreate, ExpenseUpdate

def create_expense(db: Session, expense: ExpenseCreate) -> Expense:
    db_exp = Expense(**expense.model_dump())
    db.add(db_exp)
    db.commit()
    db.refresh(db_exp)
    return db_exp

def get_expenses_by_trip(db: Session, trip_id: int):
    return db.query(Expense).filter(Expense.trip_id == trip_id).order_by(Expense.expense_date.desc()).all()

def update_expense(db: Session, expense_id: int, data: ExpenseUpdate) -> Expense:
    exp = db.query(Expense).filter(Expense.id == expense_id).first()
    if not exp:
        return None
    for k, v in data.model_dump().items():
        setattr(exp, k, v)
    db.commit()
    db.refresh(exp)
    return exp

def delete_expense(db: Session, expense_id: int) -> bool:
    exp = db.query(Expense).filter(Expense.id == expense_id).first()
    if not exp:
        return False
    db.delete(exp)
    db.commit()
    return True
