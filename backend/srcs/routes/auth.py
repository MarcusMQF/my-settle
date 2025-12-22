from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session, select
from srcs.database import get_session
from srcs.models.user import User

router = APIRouter(prefix="/auth", tags=["Auth"])

@router.post("/login")
def login(user_id: str, session: Session = Depends(get_session)):
    """
    Mock Login. Just checks if user exists, if not creates a dummy one for the demo.
    """
    user = session.get(User, user_id)
    if not user:
        # Create on the fly for demo speed
        user = User(
            id=user_id, 
            name=f"User {user_id}", 
            ic_no="900101-14-1234",
            car_plate=f"W{user_id.upper()}123",
            car_model="Myvi",
            insurance_policy="AXA-123-456"
        )
        session.add(user)
        session.commit()
        session.refresh(user)
    return user
