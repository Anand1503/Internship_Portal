# Deployment Guide

## Production Deployment Checklist

### Backend Deployment

1. **Environment Variables**
   - Set `DATABASE_URL` to production PostgreSQL database
   - Generate a strong `SECRET_KEY` (use `openssl rand -hex 32`)
   - Set `ALGORITHM=HS256`
   - Set `ACCESS_TOKEN_EXPIRE_MINUTES=30` (or desired value)

2. **Database Setup**
   - Create production database
   - Run migrations: `alembic upgrade head`
   - (Optional) Seed initial data: `python seed_data.py`

3. **Server Configuration**
   - Use a production ASGI server (e.g., Gunicorn with Uvicorn workers)
   - Example: `gunicorn app.main:app -w 4 -k uvicorn.workers.UvicornWorker --bind 0.0.0.0:8000`
   - Set up reverse proxy (Nginx/Apache)
   - Enable HTTPS with SSL certificate
   - Configure CORS for production frontend domain

4. **File Storage**
   - Ensure `resumes/` directory exists and has write permissions
   - Consider using cloud storage (AWS S3, Google Cloud Storage) for production

### Frontend Deployment

1. **Environment Variables**
   - Create `.env.production` file
   - Set `VITE_API_BASE_URL` to production backend URL

2. **Build**
   ```bash
   npm run build
   ```

3. **Deploy**
   - Upload `dist/` folder to hosting service
   - Options: Netlify, Vercel, AWS S3 + CloudFront, etc.
   - Configure routing for SPA (redirect all routes to index.html)

### Security Considerations

- ✅ Use HTTPS for all communications
- ✅ Set secure HTTP headers (HSTS, CSP, X-Frame-Options)
- ✅ Enable rate limiting on API endpoints
- ✅ Regularly update dependencies
- ✅ Use environment variables for sensitive data
- ✅ Implement proper logging and monitoring
- ✅ Set up database backups
- ✅ Use strong passwords for database and admin accounts

### Monitoring

- Set up application monitoring (e.g., Sentry, DataDog)
- Monitor server resources (CPU, memory, disk)
- Set up alerts for errors and downtime
- Track API response times and error rates

### Backup Strategy

- Daily database backups
- Backup uploaded resumes regularly
- Store backups in separate location
- Test backup restoration periodically

## Docker Deployment (Optional)

### Backend Dockerfile
```dockerfile
FROM python:3.11-slim

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
```

### Frontend Dockerfile
```dockerfile
FROM node:18-alpine as build

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

### Docker Compose
```yaml
version: '3.8'

services:
  db:
    image: postgres:15
    environment:
      POSTGRES_DB: internship_portal
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: ${DB_PASSWORD}
    volumes:
      - postgres_data:/var/lib/postgresql/data

  backend:
    build: ./backend
    ports:
      - "8000:8000"
    environment:
      DATABASE_URL: postgresql://postgres:${DB_PASSWORD}@db/internship_portal
      SECRET_KEY: ${SECRET_KEY}
    depends_on:
      - db

  frontend:
    build: ./frontend
    ports:
      - "80:80"
    depends_on:
      - backend

volumes:
  postgres_data:
```

## Performance Optimization

### Backend
- Use connection pooling for database
- Implement caching (Redis) for frequently accessed data
- Optimize database queries (add indexes)
- Use async/await for I/O operations
- Compress API responses (gzip)

### Frontend
- Code splitting for large bundles
- Lazy load routes and components
- Optimize images and assets
- Use CDN for static assets
- Implement service workers for offline support

## Maintenance

### Regular Tasks
- Update dependencies monthly
- Review and rotate API keys/secrets
- Clean up old uploaded files
- Optimize database (VACUUM, ANALYZE)
- Review application logs
- Update documentation

### Scaling
- Horizontal scaling: Add more backend instances behind load balancer
- Database: Consider read replicas for heavy read workloads
- File storage: Move to cloud storage (S3, GCS)
- Caching: Implement Redis for session management and caching
