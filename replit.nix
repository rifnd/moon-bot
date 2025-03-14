{ pkgs } : {
   deps = [
      pkgs.nodejs_20
      pkgs.neofetch
      pkgs.jellyfin-ffmpeg
      pkgs.imagemagick
      pkgs.libwebp
   ];
}