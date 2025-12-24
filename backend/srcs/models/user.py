from typing import Optional
from sqlmodel import Field, SQLModel

class User(SQLModel, table=True):
    id: str = Field(primary_key=True)
    name: str
    ic_no: str
    car_plate: str
    car_model: str
    insurance_policy: str
    is_police: bool = Field(default=False)

    # Extended Profile for Police Report
    address: str | None = None
    phone_number: str | None = None
    job: str | None = None
    license_number: str | None = None
