# StudySync Database Management Guide

## 1. Prerequisites
- PostgreSQL 14+ installed locally or via Docker
- `psql` command-line utility or pgAdmin

## 2. Local Database Initialization

### Step 1: Create Database and User
```sql
CREATE DATABASE studysync_db;
CREATE USER studysync_user WITH ENCRYPTED PASSWORD 'studysync_dev_password';
GRANT ALL PRIVILEGES ON DATABASE studysync_db TO studysync_user;
```

### Step 2: Run Schema Migration
```bash
psql -h localhost -U studysync_user -d studysync_db -f migrations/001_initial_schema.sql
```

### Step 3: Populate Seed Data (Optional / Testing)
```bash
psql -h localhost -U studysync_user -d studysync_db -f seeds/001_sample_seed.sql
```

## 3. Database Migration Workflow
1. All changes must be discussed in team sync before schema files are altered.
2. New migrations must follow numbering: `002_add_feature_xyz.sql`.
3. Test migration locally against clean database before submitting pull request.
