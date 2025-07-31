docker build -t server ./server
docker tag server:latest 916863632898.dkr.ecr.us-east-1.amazonaws.com/server
docker push 916863632898.dkr.ecr.us-east-1.amazonaws.com/server