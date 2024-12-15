class FileCompressor {
    constructor() {
        // 设置图片压缩的最大宽度，超过这个宽度会等比例缩小
        this.maxWidth = 1920;
        // 默认压缩质量，取值范围 0-1
        this.quality = 0.8;
        // 视频文件的最大大小限制（50MB）
        this.maxVideoSize = 50 * 1024 * 1024;
    }

    // 图片压缩方法
    async compressImage(file) {
        return new Promise((resolve, reject) => {
            // 创建文件读取器
            const reader = new FileReader();
            // 以 base64 格式读取文件
            reader.readAsDataURL(file);
            
            // 文件加载完成后的处理
            reader.onload = (event) => {
                const img = new Image();
                img.src = event.target.result;
                
                // 图片加载完成后进行压缩处理
                img.onload = () => {
                    const canvas = document.createElement('canvas');
                    let width = img.width;
                    let height = img.height;

                    // 如果图片宽度超过最大限制，进行等比例缩放
                    if (width > this.maxWidth) {
                        height = Math.round((height * this.maxWidth) / width);
                        width = this.maxWidth;
                    }

                    // 设置 canvas 尺寸
                    canvas.width = width;
                    canvas.height = height;

                    // 在 canvas 上绘制压缩后的图片
                    const ctx = canvas.getContext('2d');
                    ctx.drawImage(img, 0, 0, width, height);

                    // 将 canvas 转换为 Blob 对象
                    canvas.toBlob((blob) => {
                        resolve({
                            file: blob,                // 压缩后的文件
                            width,                     // 压缩后的宽度
                            height,                    // 压缩后的高度
                            preview: canvas.toDataURL('image/jpeg') // 预览用的 base64 URL
                        });
                    }, 'image/jpeg', this.quality);
                };
            };
            
            // 处理读取错误
            reader.onerror = reject;
        });
    }

    // 视频压缩方法
    async compressVideo(file) {
        return new Promise((resolve, reject) => {
            // 使用 Web Worker ���后台进行视频压缩
            const worker = new Worker('js/ffmpeg-worker.js');
            
            worker.onmessage = (e) => {
                if (e.data.type === 'ready') {
                    // FFmpeg 准备就绪后，设置压缩参数
                    const command = `-i input.mp4 -c:v libx264 -crf ${Math.round((1 - this.quality) * 51)} -preset medium -c:a aac -b:a 128k output.mp4`;
                    worker.postMessage({
                        type: 'run',
                        arguments: ['-i', 'input.mp4', ...command.split(' ')]
                    });
                } else if (e.data.type === 'done') {
                    resolve({
                        file: new Blob([e.data.data], { type: 'video/mp4' }),
                        preview: URL.createObjectURL(new Blob([e.data.data], { type: 'video/mp4' }))
                    });
                    worker.terminate();
                }
            };
        });
    }

    // 设置压缩质量（0-100 的值转换为 0-1）
    setQuality(quality) {
        this.quality = quality / 100;
    }

    // 获取文件大小的可读描述
    static getFileSizeDescription(bytes) {
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        if (bytes === 0) return '0 Byte';
        const i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)));
        return Math.round(bytes / Math.pow(1024, i), 2) + ' ' + sizes[i];
    }

    // 判断文件类型
    static getFileType(file) {
        if (file.type.startsWith('image/')) return 'image';
        if (file.type.startsWith('video/')) return 'video';
        return 'unknown';
    }
} 