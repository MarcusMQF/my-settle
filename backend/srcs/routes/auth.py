from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session, select
from srcs.database import get_session
from srcs.models.user import User

router = APIRouter(prefix="/auth", tags=["Auth"])

MOCK_PROFILES = [
    {
        "name": "Ali Bin Abu",
        "ic_no": "900101-14-5566",
        "car_plate": "WXY 1234",
        "car_model": "Perodua Myvi",
        "insurance_policy": "AXA-999-888",
        "address": "No 12, Jalan Damai, 55100 Kuala Lumpur",
        "phone_number": "012-3456789",
        "job": "Software Engineer",
        "license_number": "L-900101145566"
    },
    {
        "name": "Siti Nurhaliza",
        "ic_no": "950505-10-1234",
        "car_plate": "VAB 7777",
        "car_model": "Honda City",
        "insurance_policy": "ETIQA-112-334",
        "address": "A-10-2, Condo Indah, 43200 Cheras, Selangor",
        "phone_number": "019-8765432",
        "job": "Teacher",
        "license_number": "L-950505101234"
    },
    {
        "name": "Ah Chong",
        "ic_no": "880808-08-8888",
        "car_plate": "PJJ 8888",
        "car_model": "Toyota Camry",
        "insurance_policy": "ALLIANZ-777-666",
        "address": "55, Lorong Baru, 10400 George Town, Penang",
        "phone_number": "016-5554444",
        "job": "Businessman",
        "license_number": "L-880808088888"
    },
    {
        "name": "Muthu A/L Ramasamy",
        "ic_no": "921122-01-3344",
        "car_plate": "JQV 4567",
        "car_model": "Proton X50",
        "insurance_policy": "KURNIA-555-444",
        "address": "No 88, Taman Perling, 81200 Johor Bahru, Johor",
        "phone_number": "013-9988776",
        "job": "Civil Engineer",
        "license_number": "L-921122013344"
    },
    {
        "name": "Sarah Tan Wei Ling",
        "ic_no": "980214-14-6677",
        "car_plate": "BMA 9090",
        "car_model": "Mazda 3",
        "insurance_policy": "ZURICH-123-987",
        "address": "15, Jalan Gasing, 46000 Petaling Jaya, Selangor",
        "phone_number": "017-2233445",
        "job": "Graphic Designer",
        "license_number": "L-980214146677"
    },
    {
        "name": "Awang Anak Nyadang",
        "ic_no": "850615-13-5522",
        "car_plate": "QAA 1122",
        "car_model": "Toyota Hilux",
        "insurance_policy": "TOKIO-888-111",
        "address": "Lot 45, Kampung Bako, 93050 Kuching, Sarawak",
        "phone_number": "014-5566778",
        "job": "Plantation Manager",
        "license_number": "L-850615135522"
    },
    {
        "name": "Melissa Kaur",
        "ic_no": "960909-10-9988",
        "car_plate": "WUV 3344",
        "car_model": "Honda Civic",
        "insurance_policy": "AIG-777-222",
        "address": "B-5-12, Pavilion Residence, 50200 Kuala Lumpur",
        "phone_number": "011-12341234",
        "job": "Doctor",
        "license_number": "L-960909109988"
    },
    {
        "name": "Kevin Raj",
        "ic_no": "930303-05-1122",
        "car_plate": "NCS 5678",
        "car_model": "Proton Saga",
        "insurance_policy": "RHB-444-333",
        "address": "No 7, Taman Cempaka, 70400 Seremban, Negeri Sembilan",
        "phone_number": "018-7766554",
        "job": "Sales Executive",
        "license_number": "L-930303051122"
    },
    {
        "name": "Nurul Izzah",
        "ic_no": "990101-03-7766",
        "car_plate": "DDA 2020",
        "car_model": "Perodua Ativa",
        "insurance_policy": "TAKAFUL-101-202",
        "address": "22, Jalan Meru, 15050 Kota Bharu, Kelantan",
        "phone_number": "019-9988221",
        "job": "Nurse",
        "license_number": "L-990101037766"
    },
    {
        "name": "Jason Lee",
        "ic_no": "891212-12-8989",
        "car_plate": "SAB 1234 K",
        "car_model": "Nissan Navara",
        "insurance_policy": "LIBERTY-333-999",
        "address": "Lot 10, Jalan Lintas, 88300 Kota Kinabalu, Sabah",
        "phone_number": "016-8899001",
        "job": "Contractor",
        "license_number": "L-891212128989"
    }
]

import random

@router.post("/login")
def login(user_id: str, session: Session = Depends(get_session)) -> User:
    """
    Mock Login. Just checks if user exists, if not creates a dummy one for the demo.
    """
    user: User | None = session.get(User, user_id)
    if isinstance(user, User):
        return user

    profile = random.choice(MOCK_PROFILES)
    MOCK_PROFILES.remove(profile)
    
    user = User(
        id=user_id,
        name=profile["name"],
        ic_no=profile["ic_no"],
        car_plate=profile["car_plate"],
        car_model=profile["car_model"],
        insurance_policy=profile["insurance_policy"],
        address=profile["address"],
        phone_number=profile["phone_number"],
        job=profile["job"],
        license_number=profile["license_number"]
    )
    session.add(user)
    session.commit()
    session.refresh(user)

    return user
