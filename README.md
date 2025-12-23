# Medical Project Backend

Backend server for the medical project with PostgreSQL database and OpenAI integration.

## Setup

1. Install dependencies:

```bash
npm install
```

2. Set up environment variables:

```bash
cp env.example .env
```

Edit `.env` file with your configuration:

```
PORT=3001
DATABASE_URL=postgresql://username:password@localhost:5432/med_project
OPENAI_API_KEY=your_openai_api_key_here
UPLOAD_DIR=./uploads
```

3. Set up PostgreSQL database:

```sql
CREATE DATABASE med_project;
```

4. Run the server:

```bash
# Development
npm run dev

# Production
npm run build
npm start
```

## API Endpoints

- `GET /health` - Health check
- `GET /api/users` - Get all users
- `POST /api/users` - Create new user (with file uploads)
- `GET /api/users/:id` - Get user by ID
- `DELETE /api/users/:id` - Delete user

## File Upload

The server accepts multipart/form-data with:

- `beforeImage` - Before treatment image
- `afterImage` - After treatment image
- `patientBio` - Patient biographical information
- `patientHistory` - Patient medical history

## OpenAI Integration

The server uses OpenAI GPT-3.5-turbo to generate medical analysis based on patient information.
# checking-RNG
# med-backed
