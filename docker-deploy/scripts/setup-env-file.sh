cp --no-clobber .env.example .env
echo ""
echo "Edit .env file."
echo "Write right VITE_DEPLOY_HOSTNAME without https:// and url paths!"
echo "Set right API_HOST - it's host of backend. If backend deployed in local docker - it's the name of docker container"
echo "Set right API_PORT - it's port of backend"
echo "[press Enter...]"
read ENTER
nano .env

echo ""
echo "Is your backend deployed on this computer or docker-cluster in docker container? (y/N): "
read USER_ANSWER
cat ./docker-deploy/docker-compose.template.yaml > ./docker-deploy/docker-compose.yaml
if [[ $USER_ANSWER == "Y" ]] || [[ $USER_ANSWER == "y" ]] || [[ $USER_ANSWER == "yes" ]] || [[ $USER_ANSWER == "Yes" ]] || [[ $USER_ANSWER == "YES" ]]
then
  echo "Enter the backend container network name (you can edit it after this setting at bottom of docker-compose.yml): "
  read USER_ANSWER
  echo "    external:
      name: $USER_ANSWER" >> ./docker-deploy/docker-compose.yaml
fi
