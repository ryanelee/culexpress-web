# $1 -- api.jerry.pub, api.umiex.com ...

cd /home/cul/culexpressweb
git checkout .
git pull

cd /home/cul/culexpressweb/culwebapp
# npm install
bower install --allow-root
grunt build
sed -i "s/localhost:8000/$1/g" `grep localhost:8000 -rl /home/cul/culexpressweb/culwebapp/dist/scripts`
rm -rf /home/cul/culwww
mv /home/cul/culexpressweb/culwebapp/dist /home/cul/culwww

cd /home/cul/culexpressweb/culadminapp
# npm install
bower install --allow-root
grunt build
sed -i "s/localhost:8000/$1/g" `grep localhost:8000 -rl /home/cul/culexpressweb/culadminapp/dist/scripts`
rm -rf /home/cul/culadmin
mv /home/cul/culexpressweb/culadminapp/dist /home/cul/culadmin
