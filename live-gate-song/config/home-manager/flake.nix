{
  description = "Home Manager configuration of song";

  inputs = {
    nixpkgs.url = "github:nixos/nixpkgs/nixos-unstable";
    flake-utils.url = "github:numtide/flake-utils";
    neovim-nightly-overlay = {
      url = "github:nix-community/neovim-nightly-overlay";
      inputs.nixpkgs.follows = "nixpkgs";
    };
    home-manager = {
      url = "github:nix-community/home-manager";
      inputs.nixpkgs.follows = "nixpkgs";
    };
  };

  outputs = { self, nixpkgs, flake-utils, neovim-nightly-overlay, home-manager }: flake-utils.lib.eachSystem [
    "x86_64-linux"
    "aarch64-darwin"
  ] (system: {
    packages.homeConfigurations.song = home-manager.lib.homeManagerConfiguration {
      pkgs = nixpkgs.legacyPackages.${system}.extend neovim-nightly-overlay.overlays.default;
      modules = [ ./home.nix ];
      extraSpecialArgs = {
        currSys = system;
        nvimNightly = neovim-nightly-overlay.packages.${system}.default;
      };
    };
  });
}
