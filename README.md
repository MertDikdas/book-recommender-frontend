**Book Recommender – Frontend**
Frontend application of the Book Recommender System built with React, TypeScript and Vite.
This application communicates with the FastAPI backend and allows users to browse books, rate them, and manage their personal book list.
If you want to use this application in full verison, you should download **book-recommender-backend** also
**Tech Stack**
React
TypeScript
Vite
TailwindCSS
Axios / Fetch API

**Installation**
Clone repository
git clone https://github.com/MertDikdas/book-recommender-frontend.git
cd book-recommender-frontend
**Install dependencies**
npm install
**Run development server**
npm run dev
**Application runs at:**
http://localhost:5173


**Backend Requirement and Installation**
Make sure the backend server is running at:
http://127.0.0.1:8000
**Clone repository**
git clone https://github.com/MertDikdas/book-recommender-backend.git
cd book-recommender-backend
**Create virtual environment (optional but recommended)**
python -m venv venv
source venv/bin/activate  # Mac/Linux
**Install dependencies**
pip install -r requirements.txt
**Pull books from open library**
python -m src.database.create_db #Database creation
python -m src.api.open_library_api.seed_from_api #Pull book from open lib. to database
**Run the server**
uvicorn src.api.api:app --reload


**If needed, update the API base URL inside:**
src/api/
**Build for Production**
npm run build
Build output will be generated in the dist/ folder.
**Author**
Mert Dikdaş
Computer Engineering Student
Ege University