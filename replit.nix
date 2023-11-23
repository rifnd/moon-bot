{ pkgs }: {
    deps = [
		pkgs.nodePackages.prettier
       pkgs.yarn
        pkgs.nodejs-16_x
        pkgs.openssh_with_kerberos
        pkgs.nodePackages.typescript
        pkgs.nodePackages.pm2
        pkgs.arcan.ffmpeg
        pkgs.libwebp
        pkgs.imagemagick
        pkgs.libuuid
    ];
    env = {
        LD_LIBRARY_PATH = pkgs.lib.makeLibraryPath [
            pkgs.libuuid
        ];
    };
}