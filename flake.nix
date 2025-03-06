{
  description = "inconcon";

  inputs = {
    nixpkgs.url = "github:NixOS/nixpkgs/nixos-unstable";
    flake-utils.url = "github:numtide/flake-utils";
  };

  outputs = { self, nixpkgs, flake-utils }:
    flake-utils.lib.eachDefaultSystem (system:
      let pkgs = nixpkgs.legacyPackages.${system};
      in {
        devShells.default = pkgs.mkShell {
          buildInputs = [
            pkgs.kubectl
            pkgs.minikube
            pkgs.dockerfile-language-server-nodejs
            pkgs.nil
            pkgs.deno
          ];

          # shellHook = ''
          #   echo hello
          # '';
        };
      });
}
