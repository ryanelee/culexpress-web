# $1 -- api.jerry.pub, api.umiex.com ...

cd /home/cul/cul-web
git checkout .
git pull

cd /home/cul/cul-web/culwebapp
# npm install
bower install --allow-root
grunt build
sed -i "s/localhost:8000/$1/g" `grep localhost:8000 -rl /home/cul/cul-web/culwebapp/dist/scripts`
rm -rf /home/cul/culwww
mv /home/cul/cul-web/culwebapp/dist /home/cul/culwww

cd /home/cul/cul-web/culadminapp
# npm install
bower install --allow-root
grunt build
sed -i "s/localhost:8000/$1/g" `grep localhost:8000 -rl /home/cul/cul-web/culadminapp/dist/scripts`
rm -rf /home/cul/culadmin
mv /home/cul/cul-web/culadminapp/dist /home/cul/culadmin
