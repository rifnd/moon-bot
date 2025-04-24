{ pkgs } : {
   deps = [
      pkgs.nodejs_20
      pkgs.neofetch
      pkgs.jellyfin-ffmpeg
      pkgs.imagemagick
      pkgs.libwebp
   ];
   env = {
      LD_LIBRARY_PATH = pkgs.lib.makeLibraryPath [
         pkgs.libuuid
      ];
   };
}