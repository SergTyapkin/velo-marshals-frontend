git fetch --all
git reset --hard "origin/$(. ".env"; echo "$DEPLOY_BRANCH")"
echo "Deploying last commit:"
git log --oneline -1
cd docker-deploy || exit
docker compose --env-file ../.env down
docker compose --env-file ../.env up -d nginx --build
echo "Frontend updated successfully"
