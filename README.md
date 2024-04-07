# Frontend of World in Movies

This is the actual frontend of the project.
Here there will be different ways to look at data regarding movies, hopefully.

First hand, it's supposed to show the top-ranked movies from each country.
Second hand, show you which countries you've seen movies from and from which you haven't.


### Commands

```bash
# Build and serve on :3000
VITE_TMDB_URL=http://localhost:8020 npm run start

npm run test

```

### Docker
```bash
docker buildx build --platform linux/amd64,linux/arm64 -t seppaleinen/worldinmovies_webapp:latest .
```
