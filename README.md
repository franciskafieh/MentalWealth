> Note: this project was originally generated using the t3-turbo template, but then was moved to a new stack (.NET Core & Vite)

# MentalWealth
A mental health app that brings you the best of the virtual and digital worlds.

# Installation
in backend/MentalWealth:
1. setup a postgres db and add its url in .env (see .env.example for a template)
2. `dotnet restore`
3. `dotnet ef database update`
4. `dotnet run watch` (the db is now being run in dev mode)

in frontend/MentalWealth:
1. `pnpm i`
2. `pnpm run dev` (the frontend is now being run in dev mode, open the URL provided to try out the app)