# Starter template

## Includes

- Nextjs
- Supabase
- Shadcn

## Dev

1. Run `npm run dev`
    > - 🛑 Stops all other docker containers
    > - 🟢 Starts local supabase
    > - 🟢 Starts local nextjs


## Prerequisistes 

1. Supabase CLI isntalled https://supabase.com/docs/guides/local-development/cli/getting-started?queryGroups=platform&platform=npm

## FAQ

### Supabase fails to start
```
# Error in bash
failed to start docker container: Error response from daemon: failed to set up container networking: 
driver failed programming external connectivity on endpoint supabase_db_<...> (<...>): 
Bind for 0.0.0.0:54322 failed: port is already allocated
```

**Explanation:** other local supabase instance is running. 

**Solution:** To stop **ALL** containers and fix the issue run `./bin/stop-all-docker-containers.sh`