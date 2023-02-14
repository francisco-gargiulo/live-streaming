# -f alsa -i hw:CARD=S,DEV=0 \

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
