{ pkgs } : {
  deps = [
    pkgs.nodejs_18
    pkgs.neofetch
    pkgs.jellyfin-ffmpeg
    pkgs.imagemagick
    pkgs.libwebp
  ];
}