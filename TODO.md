# TODO List for Debugging and Repairing the Internship Portal Project

## Backend Fixes
- [x] Add include_router for jobs in backend/app/__init__.py
- [x] Remove sys.path.append hack from backend/app/__init__.py
- [x] Verify backend/app/routers/jobs.py imports and endpoints
- [x] Verify backend/app/utils/security.py JWT and hashing
- [x] Verify backend/app/schemas.py aligns with models

## Frontend Fixes
- [x] Update frontend/src/contexts/AuthContext.tsx to add useEffect for fetching user on load
- [x] Verify setAuthToken export in frontend/src/api/axiosClient.ts

## Validation Steps
- [x] Run Alembic migrations (alembic upgrade head)
- [x] Test backend startup (uvicorn app.main:app --reload)
- [x] Test frontend build/run (npm install && npm run dev)
- [x] Test API connectivity via browser (login, /me, other endpoints)
- [x] Test protected routes and auth flow
- [x] Final verification: No errors, successful auth/DB ops
