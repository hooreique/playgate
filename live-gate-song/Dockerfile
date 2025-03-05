FROM ubuntu:24.04

RUN apt update && apt install -y zsh curl xz-utils sudo openssh-server iproute2 dnsutils && rm -rf /var/lib/apt/lists/*
RUN useradd -m -s /usr/bin/zsh -G sudo song
COPY song.sudoer /etc/sudoers.d/song

USER song:song
RUN ["/usr/bin/zsh", "-c", "sh <(curl -L https://nixos.org/nix/install) --no-daemon"]
COPY --chown=song:song config/ /home/song/.config/
RUN ["/usr/bin/zsh", "-c", "USER=song PATH=/home/song/.nix-profile/bin nix run nixpkgs#home-manager -- switch"]
USER root:root

COPY sshd_config /etc/ssh/sshd_config.d/custom.conf
COPY --chown=song:song id_ed25519.pub /home/song/.ssh/authorized_keys
RUN mkdir -p /run/sshd

EXPOSE 22

CMD ["/usr/sbin/sshd", "-D"]
