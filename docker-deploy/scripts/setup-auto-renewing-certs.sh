sudo apt-get update
sudo apt-get install cron
echo "----------------------------------------------------------------------------------------------"
echo "Now you must add this string-command in your crontab to auto executing it each 1 month. Command:"
echo ""
echo "0 0 1 * * cd $(pwd) && make renew-certs >> ./certbot-renew.log"
echo ""
echo "Copy that command and [press Enter]. Then add this string in end of opened file."
read ENTER
crontab -e
