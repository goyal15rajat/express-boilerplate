if [[ $1 == 'test' ]];
then
    echo "Running test...."
    exec npm run test
elif [[ $1 == 'prod' ]];
then
	echo "starting prod server"
	exec npm run start
elif [[ $1 == 'dev' ]];
then
	echo "starting dev server...."
	exec npm run dev
else
	echo "starting prod server...."
	exec npm run prod
fi
