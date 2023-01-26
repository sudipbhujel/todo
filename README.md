# Todo

## Backend

```bash
# Navigate to backend
cd backend/src

# Navigate to backend
npx prisma generate
npx prisma migrate dev -- name todo

# back to backend directory
cd ..

# Install all package
npm i

# Copy .env.example to .env
cp .env.example .env

# Start server
npm run start:dev
```

**Backend server will run on 4000 port.**

## Client

```bash
# Navigate to backend
cd client

# Install all package
npm i

# Copy .env.example to .env
cp .env.example .env

# Start client
npm run dev
```

**Client will run on 3000 port.**
