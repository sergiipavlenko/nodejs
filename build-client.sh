docker build -t client ./client
docker tag client:latest 916863632898.dkr.ecr.us-east-1.amazonaws.com/client
docker push 916863632898.dkr.ecr.us-east-1.amazonaws.com/client