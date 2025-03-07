if ! minikube status; then
  return 1
fi

source <(minikube completion zsh)
source <(kubectl  completion zsh)
source <(docker   completion zsh)

eval $(minikube docker-env --shell zsh)
