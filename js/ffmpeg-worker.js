importScripts('https://cdn.jsdelivr.net/npm/@ffmpeg/ffmpeg@0.11.0/dist/ffmpeg.min.js');

const { createFFmpeg } = FFmpeg;
const ffmpeg = createFFmpeg({ log: true });

// 初始化 FFmpeg
(async function() {
    try {
        await ffmpeg.load();
        postMessage({ type: 'ready' });
    } catch (error) {
        postMessage({ type: 'error', error: '无法加载 FFmpeg' });
    }
})();

// 处理主线程发来的消息
self.onmessage = async function(e) {
    if (e.data.type === 'compress') {
        try {
            const { file, quality } = e.data;
            
            // 将文件写入 FFmpeg 虚拟文件系统
            ffmpeg.FS('writeFile', 'input.mp4', new Uint8Array(await file.arrayBuffer()));
            
            // 执行压缩命令
            await ffmpeg.run(
                '-i', 'input.mp4',
                '-c:v', 'libx264',
                '-crf', String(Math.round((1 - quality) * 51)), // 质量转换：0-100 -> 51-0
                '-preset', 'medium',
                '-c:a', 'aac',
                '-b:a', '128k',
                'output.mp4'
            );
            
            // 读取压缩后的文件
            const data = ffmpeg.FS('readFile', 'output.mp4');
            
            // 清理文件系统
            ffmpeg.FS('unlink', 'input.mp4');
            ffmpeg.FS('unlink', 'output.mp4');
            
            // 发送压缩结果
            postMessage({
                type: 'done',
                data: data.buffer
            }, [data.buffer]);
            
        } catch (error) {
            postMessage({
                type: 'error',
                error: '视频压缩失败: ' + error.message
            });
        }
    }
}; 