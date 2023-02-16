# Streaming

## Overview

This documentation describes the configuration and usage of a video streaming service. It supports 16:9 aspect ratio, H.264 at 30Hz, floating point durations as separate segment files, and a CODECS attribute in the master playlist. It offers four video variants, with resolutions ranging from 416x234 at 265 kbps to 1920x1080 at 2 Mbps, and one audio-only variant, which provides stereo sound at 22.05 kHz and 40 kbps.

## Getting started with ffmpeg

### Install

To use this video streaming service, you must first install ffmpeg and v4l-utils. You can do so with the following commands:

```sh
sudo apt install ffmpeg
sudo apt -y install v4l-utils
```

List devices
To list video devices, run the following command:

```sh
v4l2-ctl --list-devices
```

To list audio devices, run the following command:

```sh
arecord -L
```

List formats for a device
To list the formats supported by a device, run the following command:

```sh
ffmpeg -hide_banner -f video4linux2 -list_formats all -i /dev/video0
```

### Test hardware acceleration

To test hardware acceleration, run the following command:

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

### Stream

To stream video to the `media-server`, run the following command:

```sh
ffmpeg -y -hide_banner \
    -headers "Authorization: Basic YWRtaW46MTIz" \
    -init_hw_device vaapi=foo:/dev/dri/renderD128 -hwaccel vaapi -hwaccel_output_format vaapi -hwaccel_device foo \
    -f v4l2 -i /dev/video0 \
    -filter_hw_device foo \
    -vf 'scale=-1:720:force_original_aspect_ratio,fps=30,format=nv12|vaapi,hwupload' \
    -c:v h264_vaapi -profile:v main -crf 20 -sc_threshold 0 -g 48 -keyint_min 48 \
    -c:a aac -b:a 128k \
    -f hls \
    -master_pl_name master.m3u8 \
    -method PUT http://localhost:3003/static/master.m3u8
```

This script resizes and transcodes the input from the USB video capture, then pushes it to the media server.

### Preview

To play a video from a device, run the following command:

``` sh
ffplay -f video4linux2 -framerate 30 -video_size hd720 /dev/video0
```

To play a video from an HLS, run the following command:

``` sh
ffplay hls+file://home/francisco/projects/stream/out/master.m3
```

### References

- [How To Set Up a Video Streaming Server using Nginx-RTMP on Ubuntu 20.04](https://www.digitalocean.com/community/tutorials/how-to-set-up-a-video-streaming-server-using-nginx-rtmp-on-ubuntu-20-04)
- [How To Setup a Firewall with UFW on an Ubuntu and Debian Cloud Server](https://www.digitalocean.com/community/tutorials/how-to-setup-a-firewall-with-ufw-on-an-ubuntu-and-debian-cloud-server)
- [How To Install Nginx on Ubuntu 20.04](https://www.digitalocean.com/community/tutorials/how-to-install-nginx-on-ubuntu-20-04)
- [Creating A Production Ready Multi Bitrate HLS VOD stream](https://docs.peer5.com/guides/production-ready-hls-vod/)
- [HTTP Live Streaming](https://developer.apple.com/documentation/http_live_streaming)
