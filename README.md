# Streaming

## Overview

- 16x9 aspect ratio
- H.264 @ 30Hz
- floating point durations as separate segment files
- CODECS attribute in master playlist
- 4 video variants
  - Gear 1 - 416x234 @ 265 kbps
  - Gear 2 - 640x360 @ 580 kbps
  - Gear 3 - 960x540 @ 910 kbps
  - Gear 4 - 1280x720 @ 1 Mbps
  - Gear 5 - 1920x1080 @ 2 Mbps
- 1 audio-only variant
  - Gear 0 AAC - 22.05 kHz stereo @ 40 kbps

## Getting started

### Install

```
sudo apt install ffmpeg
sudo apt -y install v4l-utils
```

### List devices

#### video

```sh
v4l2-ctl --list-devices
```

#### audio

```
arecord -L
```

### List formats for a device

```sh
ffmpeg -hide_banner -f video4linux2 -list_formats all -i /dev/video0
```

### Test hardware acceleration

```sh
ffmpeg -y \
    -vaapi_device /dev/dri/renderD128 \
    -f v4l2 \
    -video_size 1920x1080 \
    -i /dev/video0 \
    -vf 'format=nv12,hwupload' \
    -c:v h264_vaapi \
    -c:a copy \
    -f flv \
    - | ffplay -i -
```

### Push to RTMP

```
ffmpeg -y \
  -vaapi_device /dev/dri/renderD128 \
  -f v4l2 -i /dev/video0 \
  -c:v h264_vaapi \
  -c:a copy \
  -f flv rtmp://127.0.0.1/live/stream

```

### Stream

This script takes the input from the usb video capture to resize and transcode it, after that, it is pushed to the media server

```sh
ffmpeg -y -hide_banner \
    -init_hw_device vaapi=foo:/dev/dri/renderD128 \
    -hwaccel vaapi \
    -hwaccel_output_format vaapi \
    -hwaccel_device foo \
    -f v4l2 -i /dev/video0 \
    -f alsa -i hw:CARD=S,DEV=0 \
    -filter_hw_device foo \
    -vf 'scale=-1:480:force_original_aspect_ratio,fps=30,format=nv12|vaapi,hwupload' \
    -c:v h264_vaapi -profile:v main -crf 20 -sc_threshold 0 -g 48 -keyint_min 48 \
    -c:a aac -b:a 128k \
    -f hls \
    -master_pl_name master.m3u8 \
    -method PUT http://localhost:3000/media/out_%v.m3u8
```

### Monitoring

Play from device

```sh
  ffplay -f video4linux2 -framerate 30 -video_size hd720 /dev/video0
```

Play from HLS

```sh
ffplay hls+file://home/francisco/projects/stream/out/master.m3u8

```

## Getting Started

### RTMP Server

#### Pre-requisites

```sh
    sudo apt-get update
    sudo apt-get upgrade
```

#### Install NGINX

```sh
    sudo apt-get install nginx -y
```

#### Install RTMP module

```sh
    sudo apt-get install libnginx-mod-rtmp -y
```

#### Edit config

```sh
    sudo nano /etc/nginx/nginx.conf
```

Add config:

```js
    rtmp {
        server {
            listen 1935;
            application live {
                live on;
                hls on;
                hls_path /tmp/hls;
            }
        }
    }
```

#### Restart service

```sh
    sudo systemctl restart nginx
```

#### Stop service

```sh
    sudo systemctl stop nginx
```


### References

- [How To Set Up a Video Streaming Server using Nginx-RTMP on Ubuntu 20.04](https://www.digitalocean.com/community/tutorials/how-to-set-up-a-video-streaming-server-using-nginx-rtmp-on-ubuntu-20-04)
- [How To Setup a Firewall with UFW on an Ubuntu and Debian Cloud Server](https://www.digitalocean.com/community/tutorials/how-to-setup-a-firewall-with-ufw-on-an-ubuntu-and-debian-cloud-server)
- [How To Install Nginx on Ubuntu 20.04](https://www.digitalocean.com/community/tutorials/how-to-install-nginx-on-ubuntu-20-04)
- [Creating A Production Ready Multi Bitrate HLS VOD stream](https://docs.peer5.com/guides/production-ready-hls-vod/)
- [HTTP Live Streaming](https://developer.apple.com/documentation/http_live_streaming)