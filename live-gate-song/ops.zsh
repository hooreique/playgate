# 실제로 실행할 용도로 만든 파일이 아닙니다.
echo 'nop'
exit 1

minikube delete --all

minikube status

minikube start
# 위 명령 후 ssh 프로세스를 찾아보면 아래 두 개가 추가됨을 확인할 수 있다.
#   $ ps aux | grep -i ssh
#   root   Ss   0:00 sshd: /usr/sbin/sshd -D [listener] 0 of 10-100 startups
#   root   Ss   0:00 sshd: /usr/sbin/sshd -D [listener] 0 of 10-100 startups

minikube image ls

eval $(minikube docker-env --shell zsh)

# 빌드 오래 걸림
docker compose build app

#
#
#

kubectl apply --filename manifest.yaml

kubectl get all

kubectl get pods -o wide

kubectl port-forward pod/live-gate-song-0 2222:22

#
#
#

ssh-keygen -f '/home/song/.ssh/known_hosts' -R '[localhost]:2222'

# git ssh 통신용 키
scp -P 2222 <PRIVATE_KEY> song@localhost:~/.ssh/

ssh -p 2222 song@localhost

#
#
#

docker compose --file ../play-target/compose.yaml build app

kubectl run -it --rm --restart=Never busybox --image=busybox -- nslookup play-nginx

kubectl get pods -o wide

kubectl run -it --rm --restart=Never curl-test --image=curlimages/curl -- curl http://<POD_IP>:80/index.html

kubectl replace --force --filename ../play-target/manifest.yaml
